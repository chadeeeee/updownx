const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://avnadmin:AVNS_HMFlcewHlphkLoSK1sB@bybit-pineapple-clicker.g.aivencloud.com:20732/defaultdb',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const userId = 2;
  try {
    const thRes = await pool.query("SELECT * FROM trading_trade_history WHERE user_id = $1 ORDER BY closed_at DESC LIMIT 200", [userId]);
    console.log("TH rows:", thRes.rowCount);
  } catch(e) {
    console.error("GET Error:", e.stack);
  }

  try {
    const result = await pool.query(
      `INSERT INTO trading_trade_history(user_id, side, symbol, entry_price, exit_price, size_usdt, leverage, pnl, opened_at, closed_at)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [userId, 'long', 'BTC', 60000, 61000, 100, 10, 50, Date.now(), Date.now()]
    );
    console.log("POST result:", result.rows[0]);
  } catch(e) {
    console.error("POST Error:", e.stack);
  }

  process.exit(0);
}
main();
