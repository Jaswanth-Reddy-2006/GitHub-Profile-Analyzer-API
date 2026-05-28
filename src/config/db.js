const mysql = require("mysql2/promise");
const { env } = require("./env");

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

async function initializeDatabase() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS github_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      github_id BIGINT UNSIGNED NOT NULL UNIQUE,
      name VARCHAR(255),
      avatar_url VARCHAR(500),
      html_url VARCHAR(500) NOT NULL,
      bio TEXT,
      company VARCHAR(255),
      location VARCHAR(255),
      blog VARCHAR(500),
      twitter_username VARCHAR(100),
      public_repos INT UNSIGNED NOT NULL DEFAULT 0,
      public_gists INT UNSIGNED NOT NULL DEFAULT 0,
      followers INT UNSIGNED NOT NULL DEFAULT 0,
      following INT UNSIGNED NOT NULL DEFAULT 0,
      total_stars INT UNSIGNED NOT NULL DEFAULT 0,
      total_forks INT UNSIGNED NOT NULL DEFAULT 0,
      total_open_issues INT UNSIGNED NOT NULL DEFAULT 0,
      top_language VARCHAR(100),
      languages JSON,
      most_starred_repo JSON,
      account_created_at DATETIME,
      account_updated_at DATETIME,
      last_analyzed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_username (username),
      INDEX idx_followers (followers),
      INDEX idx_public_repos (public_repos),
      INDEX idx_last_analyzed_at (last_analyzed_at)
    )
  `);
}

module.exports = {
  pool,
  initializeDatabase
};
