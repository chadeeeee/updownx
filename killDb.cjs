const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://avnadmin:AVNS_HMFlcewHlphkLoSK1sB@bybit-pineapple-clicker.g.aivencloud.com:20732/defaultdb',
  ssl: { rejectUnauthorized: false }
});
client.connect()
  .then(() => client.query("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'defaultdb' AND pid <> pg_backend_pid()"))
  .then(res => { console.log('Killed', res.rowCount); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
