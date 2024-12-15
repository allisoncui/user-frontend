const { getConnection } = require("../config/database");

const getAllProfiles = async () => {
  const connection = await getConnection();
  const [rows] = await connection.execute("SELECT * FROM Profile");
  await connection.end();
  return rows;
};

const getProfileById = async (user_id) => {
  const connection = await getConnection();
  const [rows] = await connection.execute("SELECT * FROM Profile WHERE user_id = ?", [user_id]);
  await connection.end();
  return rows[0];
};

module.exports = { getAllProfiles, getProfileById };
