require("dotenv").config();

const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "github_profile_analyzer",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
  GITHUB_REPO_PAGE_LIMIT: Number(process.env.GITHUB_REPO_PAGE_LIMIT) || 10
};

module.exports = { env };
