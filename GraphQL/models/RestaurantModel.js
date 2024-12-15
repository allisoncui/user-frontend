const { getConnection } = require("../config/database");

const getAllRestaurants = async () => {
  const connection = await getConnection();
  const [rows] = await connection.execute("SELECT * FROM Restaurant");
  await connection.end();
  return rows;
};

const getRestaurantByCode = async (restaurant_code) => {
  const connection = await getConnection();
  const [rows] = await connection.execute("SELECT * FROM Restaurant WHERE restaurant_code = ?", [restaurant_code]);
  await connection.end();
  return rows[0];
};

module.exports = { getAllRestaurants, getRestaurantByCode };
