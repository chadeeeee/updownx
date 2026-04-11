import "dotenv/config";
import cors from "cors";
import crypto from "crypto";
import express from "express";
import pg from "pg";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'mail.adm.tools',
    port: 465,
    secure: true,
    auth: {
        user: 'verification@updownxpro.com',
        pass: 'mR3ilC1xuT4xwO6rkK1y'
    }
});

const { Pool } = pg;
const app = express();

// In-memory store for email verification codes: email -> { code, expiresAt }
const verificationCodes = new Map();
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "0.0.0.0";
const rejectUnauthorized = process.env.PGSSL_REJECT_UNAUTHORIZED === "true";
const NOWPAYMENTS_DEMO = process.env.NOWPAYMENTS_DEMO === "true";
const NOWPAYMENTS_API_KEY =
  process.env.NOWPAYMENTS_API_KEY || "QR1TFMV-K8D4NNY-QWTRBD3-QEH0SKN";
const NOWPAYMENTS_BASE_URL =
  (process.env.NOWPAYMENTS_BASE_URL || "https://api.nowpayments.io/v1").replace(/\/+$/, "");
const NOWPAYMENTS_DEMO_API_KEY =
  process.env.NOWPAYMENTS_DEMO_API_KEY || NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_DEMO_BASE_URL =
  (process.env.NOWPAYMENTS_DEMO_BASE_URL || "https://api-sandbox.nowpayments.io/v1").replace(/\/+$/, "");
const NOWPAYMENTS_DEMO_PAY_CURRENCY =
  (process.env.NOWPAYMENTS_DEMO_PAY_CURRENCY || "btc").toLowerCase();
const NOWPAYMENTS_IPN_CALLBACK_URL = process.env.NOWPAYMENTS_IPN_CALLBACK_URL || "";
const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "updownx-auth-secret";
const PAYMENT_STATUS = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
};

const challenges = [
  { id: "starter", name: "Starter", balance: 799, fee: 49 },
  { id: "boost", name: "Boost", balance: 5000, fee: 99 },
  { id: "pro", name: "Pro", balance: 25000, fee: 199 },
  { id: "elite", name: "Elite", balance: 50000, fee: 399 },
  { id: "legend", name: "Legend", balance: 100000, fee: 699 },
];

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in environment variables.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized,
  },
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
});

console.log("[db] SSL rejectUnauthorized:", rejectUnauthorized);

const createAuthToken = (userId) => {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
    }),
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_TOKEN_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
};

const buildAdminUser = () => ({
  id: 0,
  name: "Admin",
  surname: "",
  account_id: "000000000000",
  email: "admin",
  created_at: new Date().toISOString(),
});

const verifyAuthToken = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac("sha256", AUTH_TOKEN_SECRET).update(payload).digest("base64url");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (decoded?.userId == null || !decoded?.exp || Date.now() > decoded.exp) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const session = verifyAuthToken(token);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  req.authUserId = Number(session.userId);
  return next();
};

const ensureAuthorizedUserId = (req, res, userId) => {
  if (!Number.isFinite(userId) || userId < 0) {
    res.status(400).json({ message: "Invalid user id." });
    return false;
  }

  if (req.authUserId !== userId) {
    res.status(403).json({ message: "Forbidden." });
    return false;
  }

  return true;
};

const normalizePaymentStatus = (value) => {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

  if (!normalized) {
    return PAYMENT_STATUS.PENDING;
  }

  if (normalized === "completed" || normalized === "finished") {
    return PAYMENT_STATUS.COMPLETED;
  }

  if (
    normalized === "pending" ||
    normalized === "waiting" ||
    normalized === "confirming" ||
    normalized === "confirmed" ||
    normalized === "partially_paid"
  ) {
    return PAYMENT_STATUS.PENDING;
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "failed" ||
    normalized === "expired" ||
    normalized === "refunded"
  ) {
    return PAYMENT_STATUS.CANCELLED;
  }

  return PAYMENT_STATUS.PENDING;
};

const quoteIdentifier = (value) => `"${String(value).replace(/"/g, '""')}"`;

const getPaymentsTableName = (accountId) => {
  if (!isValidAccountId(accountId)) {
    throw new Error("Invalid account_id for payments table.");
  }

  return `payments_${accountId}`;
};

const getPaymentsTableIdentifier = (accountId) => quoteIdentifier(getPaymentsTableName(accountId));

const ensurePaymentsTable = async (accountId, db = pool) => {
  const paymentsTableIdentifier = getPaymentsTableIdentifier(accountId);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${paymentsTableIdentifier} (
      id SERIAL PRIMARY KEY,
      challenge_order_id INTEGER UNIQUE,
      challenge_id TEXT NOT NULL,
      challenge_name TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      billing_full_name TEXT NOT NULL DEFAULT '',
      billing_email TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL,
      city TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT '${PAYMENT_STATUS.PENDING}' CHECK (status IN ('${PAYMENT_STATUS.COMPLETED}', '${PAYMENT_STATUS.PENDING}', '${PAYMENT_STATUS.CANCELLED}')),
      provider TEXT,
      provider_invoice_id TEXT,
      provider_payment_id TEXT,
      merchant_order_id TEXT,
      payment_url TEXT,
      pay_address TEXT,
      pay_amount TEXT,
      pay_currency TEXT,
      demo_mode BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await db.query(`ALTER TABLE ${paymentsTableIdentifier} ADD COLUMN IF NOT EXISTS provider_payment_id TEXT`);
};

const getUserPaymentContext = async (userId, db = pool) => {
  const user = await db.query("SELECT id, account_id FROM app_users WHERE id = $1", [userId]);
  if (!user.rowCount) {
    return null;
  }

  const accountId = user.rows[0].account_id;
  await ensurePaymentsTable(accountId, db);

  return {
    accountId,
    paymentsTableIdentifier: getPaymentsTableIdentifier(accountId),
  };
};

const syncPaymentsTableForUser = async (userId, accountId, db = pool) => {
  await ensurePaymentsTable(accountId, db);

  const paymentsTableIdentifier = getPaymentsTableIdentifier(accountId);
  const orders = await db.query(
    `SELECT
       id,
       challenge_id,
       challenge_name,
       amount,
       billing_full_name,
       billing_email,
       country,
       city,
       payment_method,
       status,
       provider,
       provider_invoice_id,
       provider_payment_id,
       merchant_order_id,
       payment_url,
       pay_address,
       pay_amount,
       pay_currency,
       created_at
     FROM challenge_orders
     WHERE user_id = $1
     ORDER BY created_at ASC`,
    [userId],
  );

  for (const order of orders.rows) {
    const demoMode = order.provider === "nowpayments" && !order.payment_url && Boolean(order.pay_address);

    await db.query(
      `INSERT INTO ${paymentsTableIdentifier}(
         challenge_order_id,
         challenge_id,
         challenge_name,
         amount,
         billing_full_name,
         billing_email,
         country,
         city,
         payment_method,
         status,
         provider,
         provider_invoice_id,
         provider_payment_id,
         merchant_order_id,
         payment_url,
         pay_address,
         pay_amount,
         pay_currency,
         demo_mode,
         created_at,
         updated_at
       )
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW())
       ON CONFLICT (challenge_order_id) DO UPDATE SET
         challenge_id = EXCLUDED.challenge_id,
         challenge_name = EXCLUDED.challenge_name,
         amount = EXCLUDED.amount,
         billing_full_name = EXCLUDED.billing_full_name,
         billing_email = EXCLUDED.billing_email,
         country = EXCLUDED.country,
         city = EXCLUDED.city,
         payment_method = EXCLUDED.payment_method,
         status = EXCLUDED.status,
         provider = EXCLUDED.provider,
         provider_invoice_id = EXCLUDED.provider_invoice_id,
         provider_payment_id = EXCLUDED.provider_payment_id,
         merchant_order_id = EXCLUDED.merchant_order_id,
         payment_url = EXCLUDED.payment_url,
         pay_address = EXCLUDED.pay_address,
         pay_amount = EXCLUDED.pay_amount,
         pay_currency = EXCLUDED.pay_currency,
         demo_mode = EXCLUDED.demo_mode,
         updated_at = NOW()`,
      [
        order.id,
        order.challenge_id,
        order.challenge_name,
        order.amount,
        order.billing_full_name || "",
        order.billing_email || "",
        order.country,
        order.city,
        order.payment_method,
        normalizePaymentStatus(order.status),
        order.provider,
        order.provider_invoice_id,
        order.provider_payment_id,
        order.merchant_order_id,
        order.payment_url,
        order.pay_address,
        order.pay_amount,
        order.pay_currency,
        demoMode,
        order.created_at,
      ],
    );
  }
};

const fetchNowPaymentsPayment = async (paymentId, { demoMode = NOWPAYMENTS_DEMO } = {}) => {
  const baseUrl = demoMode ? NOWPAYMENTS_DEMO_BASE_URL : NOWPAYMENTS_BASE_URL;
  const apiKey = demoMode ? NOWPAYMENTS_DEMO_API_KEY : NOWPAYMENTS_API_KEY;
  const response = await fetch(`${baseUrl}/payment/${encodeURIComponent(paymentId)}`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Failed to fetch NOWPayments payment.");
  }

  return response.json();
};

const syncProviderStatusForStoredPayment = async ({
  payment,
  paymentsTableIdentifier,
  db = pool,
}) => {
  const providerPaymentId =
    payment?.provider_payment_id || (!payment?.payment_url && payment?.provider_invoice_id ? payment.provider_invoice_id : null);

  if (payment?.provider !== "nowpayments" || !providerPaymentId) {
    return {
      payment,
      providerStatus: null,
    };
  }

  const providerPayment = await fetchNowPaymentsPayment(providerPaymentId, {
    demoMode: Boolean(payment.demo_mode),
  });
  const providerStatus = providerPayment.payment_status ?? null;
  const normalizedProviderStatus = normalizePaymentStatus(providerStatus);
  const nextPayAddress = providerPayment.pay_address ?? payment.pay_address;
  const nextPayAmount = providerPayment.pay_amount ? String(providerPayment.pay_amount) : payment.pay_amount;
  const nextPayCurrency = providerPayment.pay_currency ?? payment.pay_currency;
  const nextPaymentUrl = providerPayment.invoice_url ?? providerPayment.payment_url ?? payment.payment_url;

  let nextPayment = payment;

  if (
    payment.status !== normalizedProviderStatus ||
    payment.pay_address !== nextPayAddress ||
    payment.pay_amount !== nextPayAmount ||
    payment.pay_currency !== nextPayCurrency ||
    payment.payment_url !== nextPaymentUrl
  ) {
    const updatedPayment = await db.query(
      `UPDATE ${paymentsTableIdentifier}
       SET status = $2,
           pay_address = $3,
           pay_amount = $4,
           pay_currency = $5,
           payment_url = $6,
           provider_payment_id = $7,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [payment.id, normalizedProviderStatus, nextPayAddress, nextPayAmount, nextPayCurrency, nextPaymentUrl, providerPaymentId],
    );
    nextPayment = updatedPayment.rows[0];

    if (payment.challenge_order_id) {
      await db.query(
        `UPDATE challenge_orders
         SET status = $2,
             pay_address = $3,
             pay_amount = $4,
             pay_currency = $5,
             payment_url = $6,
             provider_payment_id = $7
         WHERE id = $1`,
        [payment.challenge_order_id, normalizedProviderStatus, nextPayAddress, nextPayAmount, nextPayCurrency, nextPaymentUrl, providerPaymentId],
      );
    }
  }

  return {
    payment: nextPayment,
    providerStatus,
  };
};

let nowPaymentsSyncInFlight = false;

const syncNowPaymentsStatuses = async () => {
  if (nowPaymentsSyncInFlight) {
    return;
  }

  nowPaymentsSyncInFlight = true;

  try {
    const orders = await pool.query(
      `SELECT id, user_id
       FROM challenge_orders
       WHERE provider = 'nowpayments'
         AND status = $1
       ORDER BY created_at ASC`,
      [PAYMENT_STATUS.PENDING],
    );

    for (const order of orders.rows) {
      try {
        const context = await getUserPaymentContext(order.user_id);
        if (!context) {
          continue;
        }

        let paymentQuery = await pool.query(
          `SELECT *
           FROM ${context.paymentsTableIdentifier}
           WHERE challenge_order_id = $1
           LIMIT 1`,
          [order.id],
        );

        if (!paymentQuery.rowCount) {
          await syncPaymentsTableForUser(order.user_id, context.accountId);
          paymentQuery = await pool.query(
            `SELECT *
             FROM ${context.paymentsTableIdentifier}
             WHERE challenge_order_id = $1
             LIMIT 1`,
            [order.id],
          );
        }

        if (!paymentQuery.rowCount) {
          continue;
        }

        await syncProviderStatusForStoredPayment({
          payment: paymentQuery.rows[0],
          paymentsTableIdentifier: context.paymentsTableIdentifier,
        });
      } catch (error) {
        console.error("[nowpayments sync] payment sync failed", {
          orderId: order.id,
          userId: order.user_id,
          error,
        });
      }
    }
  } finally {
    nowPaymentsSyncInFlight = false;
  }
};

const createNowPaymentsCharge = async ({
  amount,
  challengeId,
  challengeName,
  balance,
  merchantOrderId,
  origin,
  paymentMethod,
}) => {
  const isDemoMode = NOWPAYMENTS_DEMO;
  const baseUrl = isDemoMode ? NOWPAYMENTS_DEMO_BASE_URL : NOWPAYMENTS_BASE_URL;
  const apiKey = isDemoMode ? NOWPAYMENTS_DEMO_API_KEY : NOWPAYMENTS_API_KEY;
  const endpoint = isDemoMode ? "payment" : "invoice";
  const payload = {
    price_amount: amount,
    price_currency: "usd",
    order_id: merchantOrderId,
    order_description: `${challengeName} Challenge - $${balance.toLocaleString()} account`,
    is_fixed_rate: true,
  };

  const callbackUrl = NOWPAYMENTS_IPN_CALLBACK_URL || (origin ? `${origin}/api/payments/nowpayments/ipn` : "");
  if (callbackUrl) {
    payload.ipn_callback_url = callbackUrl;
  }

  if (isDemoMode) {
    payload.pay_currency = NOWPAYMENTS_DEMO_PAY_CURRENCY;
  } else {
    payload.success_url = origin
      ? `${origin}/payments?order=${encodeURIComponent(merchantOrderId)}&status=success`
      : undefined;
    payload.cancel_url = origin
      ? `${origin}/checkout/${challengeId}?method=${encodeURIComponent(paymentMethod)}&status=cancelled`
      : undefined;
  }

  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "NOWPayments request failed.");
  }

  const data = await response.json();
  return {
    demoMode: isDemoMode,
    invoiceId: data.id ?? null,
    paymentId: data.payment_id ?? (isDemoMode ? data.id ?? null : null),
    paymentStatus: data.payment_status ?? null,
    paymentUrl: data.invoice_url ?? data.payment_url ?? null,
    payAddress: data.pay_address ?? null,
    payAmount: data.pay_amount ? String(data.pay_amount) : null,
    payCurrency: data.pay_currency ?? (isDemoMode ? NOWPAYMENTS_DEMO_PAY_CURRENCY : null),
  };
};

const isValidAccountId = (value) => typeof value === "string" && /^\d{12}$/.test(value);

const creditBalanceForOrder = async (userId, orderId, challenge, db = pool) => {
  // Check if already credited
  const existing = await db.query(
    "SELECT 1 FROM balance_transactions WHERE challenge_order_id = $1 LIMIT 1",
    [orderId],
  );
  if (existing.rowCount) {
    return; // Already credited
  }

  // Insert balance transaction
  await db.query(
    `INSERT INTO balance_transactions(user_id, challenge_order_id, challenge_id, challenge_name, amount, type, description)
     VALUES($1, $2, $3, $4, $5, 'credit', $6)`,
    [userId, orderId, challenge.id, challenge.name, challenge.balance, `Challenge ${challenge.name} purchased`],
  );

  // Upsert balance
  await db.query(
    `INSERT INTO balances(user_id, balance, updated_at)
     VALUES($1, $2, NOW())
     ON CONFLICT(user_id) DO UPDATE SET
       balance = balances.balance + $2,
       updated_at = NOW()`,
    [userId, challenge.balance],
  );

  console.log(`[balance] credited ${challenge.balance} to user ${userId} for order ${orderId} (${challenge.name})`);
};

const syncChallengeCreditsForUser = async (userId, db = pool) => {
  const completedOrders = await db.query(
    `SELECT co.id, co.challenge_id
     FROM challenge_orders co
     WHERE co.user_id = $1
       AND co.status = $2
     ORDER BY co.created_at ASC`,
    [userId, PAYMENT_STATUS.COMPLETED],
  );

  for (const order of completedOrders.rows) {
    const challenge = challenges.find((item) => item.id === order.challenge_id);
    if (!challenge) {
      continue;
    }

    await creditBalanceForOrder(userId, order.id, challenge, db);
  }
};

const generateNumericAccountId = () =>
  Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");

const findUniqueAccountId = async (reservedAccountIds = new Set()) => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const accountId = generateNumericAccountId();
    if (reservedAccountIds.has(accountId)) {
      continue;
    }

    const existing = await pool.query("SELECT 1 FROM app_users WHERE account_id = $1 LIMIT 1", [accountId]);
    if (!existing.rowCount) {
      return accountId;
    }
  }

  throw new Error("Failed to generate unique account_id.");
};

const backfillAccountIds = async () => {
  const users = await pool.query("SELECT id, account_id FROM app_users ORDER BY id ASC");
  const seenAccountIds = new Set();

  for (const user of users.rows) {
    const currentAccountId = typeof user.account_id === "string" ? user.account_id : "";
    const accountIdIsReusable = isValidAccountId(currentAccountId) && !seenAccountIds.has(currentAccountId);

    if (accountIdIsReusable) {
      seenAccountIds.add(currentAccountId);
      await ensurePaymentsTable(currentAccountId);
      continue;
    }

    const nextAccountId = await findUniqueAccountId(seenAccountIds);
    await pool.query("UPDATE app_users SET account_id = $1 WHERE id = $2", [nextAccountId, user.id]);
    seenAccountIds.add(nextAccountId);
    await ensurePaymentsTable(nextAccountId);
  }
};

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[api] ${req.method} ${req.path}`, req.body ?? {});
  next();
});

const ensureSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      surname TEXT NOT NULL DEFAULT '',
      account_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      invitation_code TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Add columns if they don't exist (for existing databases)
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS surname TEXT NOT NULL DEFAULT ''`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS invitation_code TEXT NOT NULL DEFAULT ''`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS account_id TEXT`);
  await backfillAccountIds();
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS app_users_account_id_key ON app_users(account_id)`);
  await pool.query(`ALTER TABLE app_users ALTER COLUMN account_id SET NOT NULL`);

  // Ensure Admin user (ID=0) exists so trading history foreign keys don't fail
  await pool.query(`
    INSERT INTO app_users (id, name, surname, account_id, email, password, invitation_code)
    VALUES (0, 'Admin', '', '000000000000', 'admin', 'admin', '')
    ON CONFLICT (id) DO NOTHING
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS challenge_orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      challenge_id TEXT NOT NULL,
      challenge_name TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      billing_full_name TEXT NOT NULL DEFAULT '',
      billing_email TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL,
      city TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT '${PAYMENT_STATUS.PENDING}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS provider TEXT`);
  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS provider_invoice_id TEXT`);
  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS provider_payment_id TEXT`);
  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS merchant_order_id TEXT`);
  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS payment_url TEXT`);
  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS billing_full_name TEXT NOT NULL DEFAULT ''`);
  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS billing_email TEXT NOT NULL DEFAULT ''`);
  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS pay_address TEXT`);
  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS pay_amount TEXT`);
  await pool.query(`ALTER TABLE challenge_orders ADD COLUMN IF NOT EXISTS pay_currency TEXT`);
  await pool.query(
    `UPDATE challenge_orders
     SET status = CASE
       WHEN LOWER(status) IN ('completed', 'finished') THEN '${PAYMENT_STATUS.COMPLETED}'
       WHEN LOWER(status) IN ('cancelled', 'canceled', 'failed', 'expired') THEN '${PAYMENT_STATUS.CANCELLED}'
       ELSE '${PAYMENT_STATUS.PENDING}'
     END`,
  );
  await pool.query(
    `UPDATE challenge_orders
     SET provider_payment_id = provider_invoice_id
     WHERE provider = 'nowpayments'
       AND provider_payment_id IS NULL
       AND (payment_url IS NULL OR payment_url = '')`,
  );

  // Create balances table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS balances (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      balance NUMERIC NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id)
    );
  `);

  // Give Admin 100000 balance default
  await pool.query(`
    INSERT INTO balances(user_id, balance) VALUES(0, 100000)
    ON CONFLICT(user_id) DO NOTHING
  `);

  // Create balance_transactions table to track each credit/debit
  await pool.query(`
    CREATE TABLE IF NOT EXISTS balance_transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      challenge_order_id INTEGER,
      challenge_id TEXT,
      challenge_name TEXT,
      amount NUMERIC NOT NULL,
      type TEXT NOT NULL DEFAULT 'credit',
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Backfill balances for completed orders that haven't been credited yet
  const completedOrders = await pool.query(
    `SELECT co.id, co.user_id, co.challenge_id, co.challenge_name
     FROM challenge_orders co
     WHERE co.status = '${PAYMENT_STATUS.COMPLETED}'
       AND NOT EXISTS (
         SELECT 1 FROM balance_transactions bt WHERE bt.challenge_order_id = co.id
       )
     ORDER BY co.created_at ASC`,
  );
  for (const order of completedOrders.rows) {
    const challenge = challenges.find((c) => c.id === order.challenge_id);
    if (challenge) {
      await creditBalanceForOrder(order.user_id, order.id, challenge);
    }
  }

  // ─── Trading Tables ───
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trading_positions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      side TEXT NOT NULL CHECK (side IN ('long','short')),
      symbol TEXT NOT NULL,
      pair TEXT NOT NULL,
      entry_price NUMERIC NOT NULL,
      size_usdt NUMERIC NOT NULL,
      leverage NUMERIC NOT NULL,
      margin NUMERIC NOT NULL,
      liq_price NUMERIC NOT NULL,
      take_profit NUMERIC,
      stop_loss NUMERIC,
      open_time BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE trading_positions
    ADD COLUMN IF NOT EXISTS take_profit NUMERIC
  `);
  await pool.query(`
    ALTER TABLE trading_positions
    ADD COLUMN IF NOT EXISTS stop_loss NUMERIC
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trading_pending_orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('limit','trigger')),
      side TEXT NOT NULL CHECK (side IN ('long','short')),
      symbol TEXT NOT NULL,
      pair TEXT NOT NULL,
      price NUMERIC NOT NULL,
      trigger_price NUMERIC,
      exec_type TEXT CHECK (exec_type IN ('limit','market')),
      trigger_direction TEXT CHECK (trigger_direction IN ('up','down')),
      size_usdt NUMERIC NOT NULL,
      leverage NUMERIC NOT NULL,
      margin NUMERIC NOT NULL,
      created_at_ms BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trading_order_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      side TEXT NOT NULL CHECK (side IN ('long','short')),
      symbol TEXT NOT NULL,
      price NUMERIC NOT NULL,
      size_usdt NUMERIC NOT NULL,
      leverage NUMERIC NOT NULL,
      status TEXT NOT NULL DEFAULT 'filled',
      created_at_ms BIGINT NOT NULL,
      filled_at_ms BIGINT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trading_trade_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      side TEXT NOT NULL CHECK (side IN ('long','short')),
      symbol TEXT NOT NULL,
      entry_price NUMERIC NOT NULL,
      exit_price NUMERIC NOT NULL,
      size_usdt NUMERIC NOT NULL,
      leverage NUMERIC NOT NULL,
      pnl NUMERIC NOT NULL,
      opened_at BIGINT NOT NULL,
      closed_at BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const users = await pool.query("SELECT id, account_id FROM app_users ORDER BY id ASC");
  for (const user of users.rows) {
    await syncPaymentsTableForUser(user.id, user.account_id);
  }
};

app.get("/api/health", async (_, res) => {
  const now = await pool.query("SELECT NOW()");
  res.json({ ok: true, dbTime: now.rows[0].now });
});

app.get("/api/challenges", (_, res) => {
  res.json(challenges);
});

app.post("/api/auth/register", async (req, res) => {
  const { name, surname, email, password, verificationCode, invitationCode } = req.body;
  if (!name || !surname || !email || !password || !verificationCode) {
    console.warn("[register] missing fields", { name, surname, email });
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Verify the email code
  const stored = verificationCodes.get(email.toLowerCase());
  if (!stored) {
    return res.status(400).json({ message: "Verification code not found. Please request a new code." });
  }
  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(email.toLowerCase());
    return res.status(400).json({ message: "Verification code expired. Please request a new code." });
  }
  if (stored.code !== verificationCode) {
    return res.status(400).json({ message: "Invalid verification code." });
  }

  // Code is valid — remove it so it can't be reused
  verificationCodes.delete(email.toLowerCase());

  try {
    console.log("[register] creating user", { email: email.toLowerCase() });
    let insert = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const accountId = await findUniqueAccountId();

      try {
        insert = await pool.query(
          "INSERT INTO app_users(name, surname, account_id, email, password, invitation_code) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, surname, account_id, email, created_at",
          [name, surname, accountId, email.toLowerCase(), password, invitationCode || ""],
        );
        break;
      } catch (error) {
        if (error.code === "23505" && error.constraint === "app_users_account_id_key") {
          console.warn("[register] account_id collision", { email: email.toLowerCase(), accountId });
          continue;
        }
        throw error;
      }
    }

    if (!insert) {
      throw new Error("Unable to allocate account_id for user registration.");
    }

    await ensurePaymentsTable(insert.rows[0].account_id);
    console.log("[register] success", { userId: insert.rows[0].id });
    return res.status(201).json({
      user: insert.rows[0],
      token: createAuthToken(insert.rows[0].id),
    });
  } catch (error) {
    if (error.code === "23505" && error.constraint === "app_users_email_key") {
      console.warn("[register] duplicate email", { email: email.toLowerCase() });
      return res.status(409).json({ message: "Email already exists." });
    }
    console.error("[register] failed", error);
    return res.status(500).json({ message: "Registration failed." });
  }
});

app.post("/api/auth/send-code", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const html = `
    <div style="background-color: #000000; color: #ffffff; font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 60px 20px; text-align: center; width: 100%; box-sizing: border-box; min-height: 400px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; text-align: center;">
        <tr>
          <td align="center">
            <img src="cid:logo" alt="UPDOWNX" style="height: 35px; margin-bottom: 40px; display: block;" />
            <h1 style="color: #ffffff; font-size: 26px; font-weight: 700; margin-bottom: 15px; margin-top: 0;">Verification Code</h1>
            <p style="color: #a6aabe; font-size: 16px; margin-bottom: 40px; line-height: 1.5; max-width: 400px; margin-left: auto; margin-right: auto;">
              Please use the following 6-digit code to complete your registration. This code is valid for 10 minutes.
            </p>
            
            <div style="background: #013226; border: 1px solid #00ffa3; border-radius: 12px; padding: 20px; max-width: 240px; margin: 0 auto;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #00ffa3;">${code}</span>
            </div>
            
            <p style="color: #5a6270; font-size: 13px; margin-top: 50px;">
              If you didn't request this email, please safely ignore it.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: 'UPDOWNX <verification@updownxpro.com>',
      to: email,
      subject: 'Your Verification Code',
      html,
      attachments: [{
        filename: 'logo.png',
        path: process.cwd() + '/public/images/logo.png',
        cid: 'logo' // same cid value as in the html img src
      }]
    });
    // Store the code server-side with 10 minute TTL
    verificationCodes.set(email.toLowerCase(), {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    console.log("[send-code] success to", email, info.messageId);
    return res.json({ success: true });
  } catch (error) {
    console.error("[send-code] error", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.warn("[login] missing credentials", { email });
    return res.status(400).json({ message: "Missing credentials." });
  }

  if (email === "admin" && password === "admin") {
    console.log("[login] admin fallback login");
    const adminUser = buildAdminUser();
    return res.json({
      user: adminUser,
      token: createAuthToken(adminUser.id),
    });
  }

  try {
    const query = await pool.query(
      "SELECT id, name, surname, account_id, email, created_at FROM app_users WHERE email = $1 AND password = $2",
      [email.toLowerCase(), password],
    );
    if (!query.rowCount) {
      console.warn("[login] invalid credentials", { email: email.toLowerCase() });
      return res.status(401).json({ message: "Invalid credentials." });
    }
    console.log("[login] success", { userId: query.rows[0].id });
    return res.json({
      user: query.rows[0],
      token: createAuthToken(query.rows[0].id),
    });
  } catch (error) {
    console.error("[login] failed", error);
    return res.status(500).json({ message: "Login failed." });
  }
});

app.get("/api/accounts/:userId", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) {
    return;
  }
  const user = await pool.query(
    "SELECT id, name, surname, account_id, email, created_at FROM app_users WHERE id = $1",
    [userId],
  );
  if (!user.rows[0]) {
    return res.json({ user: null, orders: [] });
  }

  await syncPaymentsTableForUser(user.rows[0].id, user.rows[0].account_id);
  await syncChallengeCreditsForUser(userId);
  const paymentsTableIdentifier = getPaymentsTableIdentifier(user.rows[0].account_id);
  await ensurePaymentsTable(user.rows[0].account_id);
  const orders = await pool.query(
    `SELECT id, challenge_name, amount, status, created_at FROM ${paymentsTableIdentifier} ORDER BY created_at DESC`,
  );

  // Get active challenges (COMPLETED payments)
  const activeChallenges = await pool.query(
    `SELECT co.id, co.challenge_id, co.challenge_name, co.created_at, co.status
     FROM challenge_orders co
     WHERE co.user_id = $1 AND co.status = '${PAYMENT_STATUS.COMPLETED}'
     ORDER BY co.created_at DESC`,
    [userId],
  );

  // Map challenge details
  const userChallenges = activeChallenges.rows.map((row) => {
    const challenge = challenges.find((c) => c.id === row.challenge_id);
    return {
      id: row.id,
      challenge_id: row.challenge_id,
      challenge_name: row.challenge_name,
      balance: challenge ? challenge.balance : 0,
      status: row.status,
      created_at: row.created_at,
    };
  });

  return res.json({ user: user.rows[0], orders: orders.rows, challenges: userChallenges });
});

app.get("/api/payments/:userId", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) {
    return;
  }
  if (userId === 0 && req.authUserId === 0) {
    return res.json([]);
  }
  const context = await getUserPaymentContext(userId);
  if (!context) {
    return res.json([]);
  }

  await syncPaymentsTableForUser(userId, context.accountId);
  const payments = await pool.query(
    `SELECT
       id,
       challenge_order_id,
       challenge_id,
       challenge_name,
       amount,
       billing_full_name,
       billing_email,
       country,
       city,
       payment_method,
       status,
       provider,
       provider_invoice_id,
       provider_payment_id,
       merchant_order_id,
       payment_url,
       pay_address,
       pay_amount,
       pay_currency,
       demo_mode,
       created_at,
       updated_at
     FROM ${context.paymentsTableIdentifier}
     ORDER BY created_at DESC`,
  );

  return res.json(payments.rows);
});

app.get("/api/payments/:userId/:paymentId", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) {
    return;
  }
  if (userId === 0 && req.authUserId === 0) {
    return res.status(404).json({ message: "Payment not found." });
  }
  const paymentId = Number(req.params.paymentId);
  const context = await getUserPaymentContext(userId);

  if (!context) {
    return res.status(404).json({ message: "User not found." });
  }

  const paymentQuery = await pool.query(
    `SELECT * FROM ${context.paymentsTableIdentifier} WHERE id = $1`,
    [paymentId],
  );

  if (!paymentQuery.rowCount) {
    return res.status(404).json({ message: "Payment not found." });
  }

  return res.json({
    payment: paymentQuery.rows[0],
    providerStatus: null,
  });
});

// Get user balance
app.get("/api/balance/:userId", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) {
    return;
  }
  if (userId === 0 && req.authUserId === 0) {
    return res.json({ balance: 0 });
  }

  try {
    await syncChallengeCreditsForUser(userId);
    const result = await pool.query(
      "SELECT balance FROM balances WHERE user_id = $1",
      [userId],
    );
    const balance = result.rowCount ? Number(result.rows[0].balance) : 0;
    return res.json({ balance });
  } catch (error) {
    console.error("[balance] failed", error);
    return res.status(500).json({ message: "Failed to fetch balance." });
  }
});

app.patch("/api/payments/:userId/:paymentId/status", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) {
    return;
  }
  return res.status(400).json({
    message: "Payment status is controlled by the provider and syncs automatically.",
  });
});

app.post("/api/payments/nowpayments/ipn", async (req, res) => {
  const providerInvoiceId =
    req.body?.invoice_id !== undefined && req.body?.invoice_id !== null
      ? String(req.body.invoice_id)
      : (req.body?.payment_id === undefined || req.body?.payment_id === null) && req.body?.id !== undefined && req.body?.id !== null
        ? String(req.body.id)
        : null;
  const providerPaymentId =
    req.body?.payment_id !== undefined && req.body?.payment_id !== null
      ? String(req.body.payment_id)
      : req.body?.id !== undefined && req.body?.id !== null && !providerInvoiceId
        ? String(req.body.id)
        : null;
  const merchantOrderId =
    typeof req.body?.order_id === "string" && req.body.order_id.trim() ? req.body.order_id.trim() : null;
  const providerStatus = typeof req.body?.payment_status === "string" ? req.body.payment_status : null;
  const normalizedStatus = normalizePaymentStatus(providerStatus);
  const payAddress = typeof req.body?.pay_address === "string" ? req.body.pay_address : null;
  const payAmount =
    req.body?.pay_amount !== undefined && req.body?.pay_amount !== null ? String(req.body.pay_amount) : null;
  const payCurrency = typeof req.body?.pay_currency === "string" ? req.body.pay_currency : null;
  const paymentUrl =
    typeof req.body?.invoice_url === "string"
      ? req.body.invoice_url
      : typeof req.body?.payment_url === "string"
        ? req.body.payment_url
        : null;

  if (!providerInvoiceId && !providerPaymentId && !merchantOrderId) {
    return res.status(400).json({ message: "Missing NOWPayments identifiers." });
  }

  try {
    const orderQuery = await pool.query(
       `SELECT *
        FROM challenge_orders
        WHERE provider = 'nowpayments'
          AND (
            ($1::text IS NOT NULL AND provider_payment_id = $1)
            OR ($2::text IS NOT NULL AND provider_invoice_id = $2)
            OR ($3::text IS NOT NULL AND merchant_order_id = $3)
          )
        ORDER BY id DESC
        LIMIT 1`,
      [providerPaymentId, providerInvoiceId, merchantOrderId],
    );

    if (!orderQuery.rowCount) {
      return res.status(404).json({ message: "Payment record not found." });
    }

    const order = orderQuery.rows[0];
    await pool.query(
      `UPDATE challenge_orders
       SET status = $2,
           provider_invoice_id = COALESCE($3, provider_invoice_id),
           provider_payment_id = COALESCE($4, provider_payment_id),
           pay_address = COALESCE($5, pay_address),
           pay_amount = COALESCE($6, pay_amount),
           pay_currency = COALESCE($7, pay_currency),
           payment_url = COALESCE($8, payment_url)
       WHERE id = $1`,
      [order.id, normalizedStatus, providerInvoiceId, providerPaymentId, payAddress, payAmount, payCurrency, paymentUrl],
    );

    const context = await getUserPaymentContext(order.user_id);
    if (context) {
      await pool.query(
        `UPDATE ${context.paymentsTableIdentifier}
         SET status = $2,
             provider_invoice_id = COALESCE($3, provider_invoice_id),
             provider_payment_id = COALESCE($4, provider_payment_id),
             pay_address = COALESCE($5, pay_address),
             pay_amount = COALESCE($6, pay_amount),
             pay_currency = COALESCE($7, pay_currency),
             payment_url = COALESCE($8, payment_url),
             updated_at = NOW()
         WHERE challenge_order_id = $1`,
        [order.id, normalizedStatus, providerInvoiceId, providerPaymentId, payAddress, payAmount, payCurrency, paymentUrl],
      );
    }

    // Credit balance if status is COMPLETED
    if (normalizedStatus === PAYMENT_STATUS.COMPLETED) {
      const challenge = challenges.find((c) => c.id === order.challenge_id);
      if (challenge) {
        try {
          await creditBalanceForOrder(order.user_id, order.id, challenge);
        } catch (balanceError) {
          console.error("[nowpayments ipn] balance credit failed", balanceError);
        }
      }
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error("[nowpayments ipn] failed", error);
    return res.status(500).json({ message: "Failed to process payment callback." });
  }
});

app.post("/api/orders", requireAuth, async (req, res) => {
  const { userId, challengeId, country, city, fullName, email, paymentMethod } = req.body;
  if (!ensureAuthorizedUserId(req, res, Number(userId))) {
    return;
  }
  const selected = challenges.find((item) => item.id === challengeId);
  const normalizedFullName = typeof fullName === "string" ? fullName.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedCountry = typeof country === "string" ? country.trim() : "";
  const normalizedCity = typeof city === "string" ? city.trim() : "";

  if (!selected) {
    return res.status(404).json({ message: "Challenge not found." });
  }
  if (!userId || !normalizedFullName || !normalizedEmail || !normalizedCountry || !normalizedCity || !paymentMethod) {
    return res.status(400).json({ message: "Missing order fields." });
  }

  const merchantOrderId = `UDX-${challengeId.toUpperCase()}-${userId}-${Date.now()}`;
  const origin = req.headers.origin;
  const context = await getUserPaymentContext(userId);

  if (!context) {
    return res.status(404).json({ message: "User not found." });
  }

  let provider = null;
  let providerInvoiceId = null;
  let providerPaymentId = null;
  let paymentUrl = null;
  let payAddress = null;
  let payAmount = null;
  let payCurrency = null;
  let status = PAYMENT_STATUS.PENDING;
  let orderRow = null;
  let paymentRow = null;
  let demoMode = NOWPAYMENTS_DEMO;

  try {
    const insertedOrder = await pool.query(
      `INSERT INTO challenge_orders(
        user_id,
        challenge_id,
        challenge_name,
        amount,
        billing_full_name,
        billing_email,
        country,
        city,
        payment_method,
        status,
        provider,
        provider_invoice_id,
        provider_payment_id,
        merchant_order_id,
        payment_url
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        userId,
        selected.id,
        selected.name,
        selected.fee,
        normalizedFullName,
        normalizedEmail,
        normalizedCountry,
        normalizedCity,
        paymentMethod,
        status,
        provider,
        providerInvoiceId,
        providerPaymentId,
        merchantOrderId,
        paymentUrl,
      ],
    );
    orderRow = insertedOrder.rows[0];

    const insertedPayment = await pool.query(
      `INSERT INTO ${context.paymentsTableIdentifier}(
        challenge_order_id,
        challenge_id,
        challenge_name,
        amount,
        billing_full_name,
        billing_email,
        country,
        city,
        payment_method,
        status,
        provider,
        provider_invoice_id,
        provider_payment_id,
        merchant_order_id,
        payment_url,
        pay_address,
        pay_amount,
        pay_currency,
        demo_mode
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        orderRow.id,
        selected.id,
        selected.name,
        selected.fee,
        normalizedFullName,
        normalizedEmail,
        normalizedCountry,
        normalizedCity,
        paymentMethod,
        status,
        provider,
        providerInvoiceId,
        providerPaymentId,
        merchantOrderId,
        paymentUrl,
        payAddress,
        payAmount,
        payCurrency,
        demoMode,
      ],
    );
    paymentRow = insertedPayment.rows[0];

    if (paymentMethod === "crypto") {
      provider = "nowpayments";
      const charge = await createNowPaymentsCharge({
        amount: selected.fee,
        challengeId: selected.id,
        challengeName: selected.name,
        balance: selected.balance,
        merchantOrderId,
        origin,
        paymentMethod,
      });

      demoMode = charge.demoMode;
      providerInvoiceId = charge.invoiceId;
      providerPaymentId = charge.paymentId;
      paymentUrl = charge.paymentUrl;
      payAddress = charge.payAddress;
      payAmount = charge.payAmount;
      payCurrency = charge.payCurrency;
      status = normalizePaymentStatus(charge.paymentStatus || (paymentUrl || payAddress ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.CANCELLED));

      const updatedOrder = await pool.query(
        `UPDATE challenge_orders
         SET status = $2,
             provider = $3,
             provider_invoice_id = $4,
             provider_payment_id = $5,
             payment_url = $6,
             pay_address = $7,
             pay_amount = $8,
             pay_currency = $9
         WHERE id = $1
         RETURNING *`,
        [orderRow.id, status, provider, providerInvoiceId, providerPaymentId, paymentUrl, payAddress, payAmount, payCurrency],
      );
      orderRow = updatedOrder.rows[0];

      const updatedPayment = await pool.query(
        `UPDATE ${context.paymentsTableIdentifier}
         SET status = $2,
             provider = $3,
             provider_invoice_id = $4,
             provider_payment_id = $5,
             payment_url = $6,
             pay_address = $7,
             pay_amount = $8,
             pay_currency = $9,
             demo_mode = $10,
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [paymentRow.id, status, provider, providerInvoiceId, providerPaymentId, paymentUrl, payAddress, payAmount, payCurrency, demoMode],
      );
      paymentRow = updatedPayment.rows[0];
    }

    return res.status(201).json({
      order: orderRow,
      payment: paymentRow,
      paymentRecordId: paymentRow?.id ?? null,
      paymentUrl,
      payment_url: paymentUrl,
      payAddress,
      payAmount,
      payCurrency,
      demoMode,
      provider,
      providerInvoiceId,
      providerPaymentId,
    });
  } catch (error) {
    console.error("[orders] failed", error);

    if (orderRow?.id) {
      const failedOrder = await pool.query(
        `UPDATE challenge_orders
         SET status = $2,
             provider = $3,
             provider_invoice_id = $4,
             provider_payment_id = $5,
             payment_url = $6,
             pay_address = $7,
             pay_amount = $8,
             pay_currency = $9
          WHERE id = $1
          RETURNING *`,
        [orderRow.id, PAYMENT_STATUS.CANCELLED, provider, providerInvoiceId, providerPaymentId, paymentUrl, payAddress, payAmount, payCurrency],
      );
      orderRow = failedOrder.rows[0];
    }

    if (paymentRow?.id) {
      const failedPayment = await pool.query(
        `UPDATE ${context.paymentsTableIdentifier}
         SET status = $2,
             provider = $3,
             provider_invoice_id = $4,
             provider_payment_id = $5,
             payment_url = $6,
             pay_address = $7,
             pay_amount = $8,
             pay_currency = $9,
             demo_mode = $10,
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [paymentRow.id, PAYMENT_STATUS.CANCELLED, provider, providerInvoiceId, providerPaymentId, paymentUrl, payAddress, payAmount, payCurrency, demoMode],
      );
      paymentRow = failedPayment.rows[0];
    }

    return res.status(502).json({
      message: "Failed to create payment invoice.",
      order: orderRow,
      payment: paymentRow,
      paymentRecordId: paymentRow?.id ?? null,
      demoMode,
    });
  }
});

// ─────────────────── Trading API ───────────────────

// GET all trading data for a user (positions, pending orders, order history, trade history)
app.get("/api/trading/:userId", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) return;

  try {
    const [posRes, ordRes, ohRes, thRes] = await Promise.all([
      pool.query("SELECT * FROM trading_positions WHERE user_id = $1 ORDER BY open_time DESC", [userId]),
      pool.query("SELECT * FROM trading_pending_orders WHERE user_id = $1 ORDER BY created_at_ms DESC", [userId]),
      pool.query("SELECT * FROM trading_order_history WHERE user_id = $1 ORDER BY created_at_ms DESC LIMIT 200", [userId]),
      pool.query("SELECT * FROM trading_trade_history WHERE user_id = $1 ORDER BY closed_at DESC LIMIT 200", [userId]),
    ]);

    const mapPosition = (r) => ({
      id: r.id, side: r.side, symbol: r.symbol, pair: r.pair,
      entryPrice: Number(r.entry_price), sizeUsdt: Number(r.size_usdt),
      leverage: Number(r.leverage), margin: Number(r.margin),
      liqPrice: Number(r.liq_price),
      takeProfit: r.take_profit === null ? null : Number(r.take_profit),
      stopLoss: r.stop_loss === null ? null : Number(r.stop_loss),
      openTime: Number(r.open_time),
    });
    const mapOrder = (r) => ({
      id: r.id, type: r.type, side: r.side, symbol: r.symbol, pair: r.pair,
      price: Number(r.price), triggerPrice: r.trigger_price ? Number(r.trigger_price) : undefined,
      execType: r.exec_type || undefined, triggerDirection: r.trigger_direction || undefined,
      sizeUsdt: Number(r.size_usdt), leverage: Number(r.leverage),
      margin: Number(r.margin), createdAt: Number(r.created_at_ms),
    });
    const mapOH = (r) => ({
      id: r.id, type: r.type, side: r.side, symbol: r.symbol,
      price: Number(r.price), sizeUsdt: Number(r.size_usdt),
      leverage: Number(r.leverage), status: r.status,
      createdAt: Number(r.created_at_ms), filledAt: r.filled_at_ms ? Number(r.filled_at_ms) : undefined,
    });
    const mapTH = (r) => ({
      id: r.id, side: r.side, symbol: r.symbol,
      entryPrice: Number(r.entry_price), exitPrice: Number(r.exit_price),
      sizeUsdt: Number(r.size_usdt), leverage: Number(r.leverage),
      pnl: Number(r.pnl), openedAt: Number(r.opened_at), closedAt: Number(r.closed_at),
    });

    return res.json({
      positions: posRes.rows.map(mapPosition),
      pendingOrders: ordRes.rows.map(mapOrder),
      orderHistory: ohRes.rows.map(mapOH),
      tradeHistory: thRes.rows.map(mapTH),
    });
  } catch (error) {
    console.error("[trading] GET failed", error);
    return res.status(500).json({ message: "Failed to load trading data." });
  }
});

// Save a position (upsert by symbol+side)
app.post("/api/trading/:userId/positions", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) return;

  const { side, symbol, pair, entryPrice, sizeUsdt, leverage, margin, liqPrice, openTime } = req.body;
  if (!side || !symbol || !pair || !entryPrice || !sizeUsdt || !leverage || !margin || !liqPrice || !openTime) {
    return res.status(400).json({ message: "Missing position fields." });
  }

  const parseOptionalBound = (value) => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return Number.NaN;
    return parsed;
  };

  const hasTakeProfit = Object.prototype.hasOwnProperty.call(req.body, "takeProfit");
  const hasStopLoss = Object.prototype.hasOwnProperty.call(req.body, "stopLoss");
  const takeProfit = parseOptionalBound(req.body?.takeProfit);
  const stopLoss = parseOptionalBound(req.body?.stopLoss);

  if (Number.isNaN(takeProfit) || Number.isNaN(stopLoss)) {
    return res.status(400).json({ message: "TP/SL values must be positive numbers or null." });
  }

  try {
    // Check if position for this symbol+side already exists
    const existing = await pool.query(
      "SELECT id FROM trading_positions WHERE user_id = $1 AND symbol = $2 AND side = $3",
      [userId, symbol, side]
    );

    let result;
    if (existing.rowCount) {
      result = await pool.query(
        `UPDATE trading_positions
         SET entry_price = $1,
             size_usdt = $2,
             leverage = $3,
             margin = $4,
             liq_price = $5,
             open_time = $6,
             take_profit = CASE WHEN $7 THEN $8 ELSE take_profit END,
             stop_loss = CASE WHEN $9 THEN $10 ELSE stop_loss END
         WHERE id = $11
         RETURNING *`,
        [entryPrice, sizeUsdt, leverage, margin, liqPrice, openTime, hasTakeProfit, takeProfit ?? null, hasStopLoss, stopLoss ?? null, existing.rows[0].id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO trading_positions(user_id, side, symbol, pair, entry_price, size_usdt, leverage, margin, liq_price, take_profit, stop_loss, open_time)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [userId, side, symbol, pair, entryPrice, sizeUsdt, leverage, margin, liqPrice, takeProfit ?? null, stopLoss ?? null, openTime]
      );
    }

    return res.json({ id: result.rows[0].id });
  } catch (error) {
    console.error("[trading] POST position failed", error);
    return res.status(500).json({ message: "Failed to save position." });
  }
});

// Close/delete a position
app.delete("/api/trading/:userId/positions/:posId", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) return;
  const posId = Number(req.params.posId);

  try {
    await pool.query("DELETE FROM trading_positions WHERE id = $1 AND user_id = $2", [posId, userId]);
    return res.json({ ok: true });
  } catch (error) {
    console.error("[trading] DELETE position failed", error);
    return res.status(500).json({ message: "Failed to delete position." });
  }
});

// Update TP/SL for an existing position
app.patch("/api/trading/:userId/positions/:posId/tpsl", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) return;

  const posId = Number(req.params.posId);
  const normalizeValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return NaN;
    }
    return parsed;
  };

  const takeProfit = normalizeValue(req.body?.takeProfit);
  const stopLoss = normalizeValue(req.body?.stopLoss);

  if (Number.isNaN(takeProfit) || Number.isNaN(stopLoss)) {
    return res.status(400).json({ message: "TP/SL values must be positive numbers or null." });
  }

  try {
    const result = await pool.query(
      `UPDATE trading_positions
       SET take_profit = $1,
           stop_loss = $2
       WHERE id = $3 AND user_id = $4
       RETURNING id, take_profit, stop_loss`,
      [takeProfit, stopLoss, posId, userId],
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Position not found." });
    }

    return res.json({
      id: result.rows[0].id,
      takeProfit: result.rows[0].take_profit === null ? null : Number(result.rows[0].take_profit),
      stopLoss: result.rows[0].stop_loss === null ? null : Number(result.rows[0].stop_loss),
    });
  } catch (error) {
    console.error("[trading] PATCH tpsl failed", error);
    return res.status(500).json({ message: "Failed to update TP/SL." });
  }
});

// Create pending order
app.post("/api/trading/:userId/orders", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) return;

  const { type, side, symbol, pair, price, triggerPrice, execType, triggerDirection, sizeUsdt, leverage, margin, createdAt } = req.body;
  if (!type || !side || !symbol || !pair || !price || !sizeUsdt || !leverage || !margin || !createdAt) {
    return res.status(400).json({ message: "Missing order fields." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO trading_pending_orders(user_id, type, side, symbol, pair, price, trigger_price, exec_type, trigger_direction, size_usdt, leverage, margin, created_at_ms)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [userId, type, side, symbol, pair, price, triggerPrice || null, execType || null, triggerDirection || null, sizeUsdt, leverage, margin, createdAt]
    );
    return res.json({ id: result.rows[0].id });
  } catch (error) {
    console.error("[trading] POST order failed", error);
    return res.status(500).json({ message: "Failed to save order." });
  }
});

// Cancel/delete a pending order
app.delete("/api/trading/:userId/orders/:orderId", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) return;
  const orderId = Number(req.params.orderId);

  try {
    await pool.query("DELETE FROM trading_pending_orders WHERE id = $1 AND user_id = $2", [orderId, userId]);
    return res.json({ ok: true });
  } catch (error) {
    console.error("[trading] DELETE order failed", error);
    return res.status(500).json({ message: "Failed to cancel order." });
  }
});

// Add order history entry
app.post("/api/trading/:userId/order-history", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) return;

  const { type, side, symbol, price, sizeUsdt, leverage, status, createdAt, filledAt } = req.body;
  if (!type || !side || !symbol || !price || !sizeUsdt || !leverage || !status || !createdAt) {
    return res.status(400).json({ message: "Missing order history fields." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO trading_order_history(user_id, type, side, symbol, price, size_usdt, leverage, status, created_at_ms, filled_at_ms)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [userId, type, side, symbol, price, sizeUsdt, leverage, status, createdAt, filledAt || null]
    );
    return res.json({ id: result.rows[0].id });
  } catch (error) {
    console.error("[trading] POST order-history failed", error);
    return res.status(500).json({ message: "Failed to save order history." });
  }
});

// Add trade history entry
app.post("/api/trading/:userId/trade-history", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) return;

  const { side, symbol, entryPrice, exitPrice, sizeUsdt, leverage, pnl, openedAt, closedAt } = req.body;
  if (!side || !symbol || entryPrice == null || exitPrice == null || !sizeUsdt || !leverage || pnl == null || !openedAt || !closedAt) {
    return res.status(400).json({ message: "Missing trade history fields." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO trading_trade_history(user_id, side, symbol, entry_price, exit_price, size_usdt, leverage, pnl, opened_at, closed_at)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [userId, side, symbol, entryPrice, exitPrice, sizeUsdt, leverage, pnl, openedAt, closedAt]
    );
    return res.json({ id: result.rows[0].id });
  } catch (error) {
    console.error("[trading] POST trade-history failed", error);
    return res.status(500).json({ message: "Failed to save trade history." });
  }
});

// Update user balance (for PnL adjustments)
app.patch("/api/trading/:userId/balance", requireAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!ensureAuthorizedUserId(req, res, userId)) return;

  const { delta } = req.body;
  if (delta == null || typeof delta !== "number") {
    return res.status(400).json({ message: "Missing balance delta." });
  }

  try {
    await pool.query(
      `INSERT INTO balances(user_id, balance, updated_at)
       VALUES($1, $2, NOW())
       ON CONFLICT(user_id) DO UPDATE SET
         balance = balances.balance + $2,
         updated_at = NOW()`,
      [userId, delta]
    );
    const updated = await pool.query("SELECT balance FROM balances WHERE user_id = $1", [userId]);
    return res.json({ balance: updated.rowCount ? Number(updated.rows[0].balance) : 0 });
  } catch (error) {
    console.error("[trading] PATCH balance failed", error);
    return res.status(500).json({ message: "Failed to update balance." });
  }
});

ensureSchema()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`API listening on http://${host}:${port}`);
    });
    syncNowPaymentsStatuses().catch((error) => {
      console.error("[nowpayments sync] initial sync failed", error);
    });
    setInterval(() => {
      syncNowPaymentsStatuses().catch((error) => {
        console.error("[nowpayments sync] interval failed", error);
      });
    }, 10000);
  })
  .catch((error) => {
    console.error("Schema init failed:", error);
    process.exit(1);
  });
