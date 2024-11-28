const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: process.env.USER,
  database: process.env.DB,
  password: process.env.PW,
  port: +process.env.PORT,
});

module.exports = { pool };
