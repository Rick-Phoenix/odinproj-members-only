const { genPassword } = require("../auth/passwordUtils");
const { pool } = require("./pool");

async function addUser(user) {
  const { hash, salt } = genPassword(user.password);
  const query =
    "INSERT INTO users (username, hash, salt, tier) VALUES ($1, $2, $3, $4);";
  await pool.query(query, [user.username, hash, salt, user.tier]);
}

async function fetchUser(username) {
  const query = "SELECT * FROM users WHERE username = ($1) ;";
  const { rows } = await pool.query(query, [username]);
  return rows[0];
}

async function fetchUserById(id) {
  const query = "SELECT * FROM users WHERE id = ($1) ;";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

async function logMessage(userid, message) {
  const query =
    "INSERT INTO messages (userid, message, date) VALUES ($1, $2, $3) ;";
  const date = new Date().toISOString().replace("T", " ").split(".")[0];
  await pool.query(query, [userid, message, date]);
}

async function fetchMessages() {
  const { rows } = await pool.query(
    "SELECT username, message, date, messages.id AS msgid FROM messages JOIN users ON userid = users.id;"
  );
  return rows;
}

async function removeMessage(id) {
  const query = "DELETE FROM messages WHERE id = ($1) ;";
  await pool.query(query, [id]);
}

module.exports = {
  addUser,
  fetchUser,
  fetchUserById,
  logMessage,
  fetchMessages,
  removeMessage,
};
