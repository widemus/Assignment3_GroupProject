import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host:     process.env.DB_HOST     || '127.0.0.1',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'dev',           // Updated to your new user
    password: process.env.DB_PASSWORD || 'dev1847!*',     // Updated to your new password
    database: process.env.DB_NAME     || 'neuracortex',    // Matches the DB you just seeded
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
});

export default pool;