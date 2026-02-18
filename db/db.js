// const Database = require("better-sqlite3");

// const db = new Database("database.sqlite");

// db.exec(`
// CREATE TABLE IF NOT EXISTS users (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT,
//   email TEXT UNIQUE,
//   password TEXT,
//   role TEXT DEFAULT 'user'
// );

// CREATE TABLE IF NOT EXISTS tickets (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   title TEXT,
//   description TEXT,
//   category TEXT,
//   priority TEXT,
//   status TEXT DEFAULT 'Open',
//   createdBy INTEGER,
//   assignedTo INTEGER,
//   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY(createdBy) REFERENCES users(id)
// );
// `);

// module.exports = db;




const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Database connection error:", err));

module.exports = pool;
