const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'availability-database.cb821k94flru.us-east-1.rds.amazonaws.com',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'dbuserdbuser',
    database: process.env.DB_NAME || 'availability',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const getConnection = async () => pool.getConnection();

module.exports = {
  getConnection,
  pool,
};
