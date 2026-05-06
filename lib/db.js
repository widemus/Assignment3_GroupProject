import mysql from 'mysql2/promise';

// Create a connection pool 
const pool = mysql.createPool({
    host:     process.env.DB_HOST, // database host
    port:     parseInt(process.env.DB_PORT || '3306'), // default MySQL port
    user:     process.env.DB_USER, // DB username
    password: process.env.DB_PASSWORD, // DB password
    database: process.env.DB_NAME, // database name

    waitForConnections: true, // queue requests if no connection available
    connectionLimit:    10, // max number of connections in pool
    queueLimit:         0, // unlimited queue
});

export default pool;