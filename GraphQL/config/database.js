const mysql = require('mysql2/promise');
require('dotenv').config();

const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'availability-database.cb821k94flru.us-east-1.rds.amazonaws.com',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'dbuserdbuser',
    database: process.env.DB_NAME || 'availability',
    port: process.env.DB_PORT || 3306
  });
};

module.exports = { getConnection };
