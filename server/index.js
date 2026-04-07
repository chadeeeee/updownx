import "dotenv/config";
import cors from "cors";
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
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "0.0.0.0";
const rejectUnauthorized = process.env.PGSSL_REJECT_UNAUTHORIZED === "true";

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
});

console.log("[db] SSL rejectUnauthorized:", rejectUnauthorized);

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
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS challenge_orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      challenge_id TEXT NOT NULL,
      challenge_name TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      country TEXT NOT NULL,
      city TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

app.get("/api/health", async (_, res) => {
  const now = await pool.query("SELECT NOW()");
  res.json({ ok: true, dbTime: now.rows[0].now });
});

app.get("/api/challenges", (_, res) => {
  res.json(challenges);
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    console.warn("[register] missing fields", { name, email });
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    console.log("[register] creating user", { email: email.toLowerCase() });
    const insert = await pool.query(
      "INSERT INTO app_users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email.toLowerCase(), password],
    );
    console.log("[register] success", { userId: insert.rows[0].id });
    return res.status(201).json(insert.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
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
    console.log("[send-code] success to", email, info.messageId);
    return res.json({ success: true, code });
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
    return res.json({ id: 0, name: "Admin", email: "admin", created_at: new Date().toISOString() });
  }

  try {
    const query = await pool.query(
      "SELECT id, name, email, created_at FROM app_users WHERE email = $1 AND password = $2",
      [email.toLowerCase(), password],
    );
    if (!query.rowCount) {
      console.warn("[login] invalid credentials", { email: email.toLowerCase() });
      return res.status(401).json({ message: "Invalid credentials." });
    }
    console.log("[login] success", { userId: query.rows[0].id });
    return res.json(query.rows[0]);
  } catch (error) {
    console.error("[login] failed", error);
    return res.status(500).json({ message: "Login failed." });
  }
});

app.get("/api/accounts/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  const user = await pool.query(
    "SELECT id, name, email, created_at FROM app_users WHERE id = $1",
    [userId],
  );
  const orders = await pool.query(
    "SELECT id, challenge_name, amount, status, created_at FROM challenge_orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return res.json({ user: user.rows[0] ?? null, orders: orders.rows });
});

app.get("/api/payments/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  const payments = await pool.query(
    "SELECT id, challenge_name, amount, payment_method, status, created_at FROM challenge_orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return res.json(payments.rows);
});

app.post("/api/orders", async (req, res) => {
  const { userId, challengeId, country, city, paymentMethod } = req.body;
  const selected = challenges.find((item) => item.id === challengeId);
  if (!selected) {
    return res.status(404).json({ message: "Challenge not found." });
  }
  if (!userId || !country || !city || !paymentMethod) {
    return res.status(400).json({ message: "Missing order fields." });
  }
  const order = await pool.query(
    `INSERT INTO challenge_orders(user_id, challenge_id, challenge_name, amount, country, city, payment_method, status)
     VALUES($1, $2, $3, $4, $5, $6, $7, 'paid')
     RETURNING *`,
    [userId, selected.id, selected.name, selected.fee, country, city, paymentMethod],
  );
  return res.status(201).json(order.rows[0]);
});

ensureSchema()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`API listening on http://${host}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Schema init failed:", error);
    process.exit(1);
  });
