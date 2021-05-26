const db = require("../db");

exports.addOne = async (user) => {
  const { first_name, last_name, email, password } = user;
  return await db.execute(
    `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?);`,
    [first_name, last_name, email, password]
  );
};

exports.getUserEmail = async (email) => {
  return await db.execute(`SELECT * FROM users WHERE email = ?;`, [email]);
};

exports.deleteOne = async (id) => {
  return await db.execute(`DELETE FROM users WHERE id =?;`, [id]);
};

exports.getOne = async (id) => {
  return await db.execute(`SELECT * FROM users WHERE id =?;`, [id]);
};

exports.updateOne = async (fn, ln, em, ps, id) => {
  return await db.execute(
    `UPDATE  users set firstName = ?, lastName = ?, email = ?, password = ? WHERE id = ?;`,
    [fn, ln, em, ps, id]
  );
};
