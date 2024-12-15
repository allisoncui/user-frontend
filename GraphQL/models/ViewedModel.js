const { getConnection } = require("../config/database");

const getViewedRestaurants = async (user_id) => {
  const connection = await getConnection();
  const query = `
    SELECT r.restaurant_code, r.name
    FROM Viewed_Restaurants vr
    JOIN Restaurant r ON vr.restaurant_code = r.restaurant_code
    WHERE vr.user_id = ?
  `;
  const [rows] = await connection.execute(query, [user_id]);
  await connection.end();
  return rows;
};

module.exports = { getViewedRestaurants };
