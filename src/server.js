const app = require("./app");
const { initializeDatabase } = require("./config/db");
const { env } = require("./config/env");

function formatStartupError(error) {
  const parts = [
    error.message,
    error.code ? `code=${error.code}` : null,
    error.sqlMessage ? `sqlMessage=${error.sqlMessage}` : null
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" | ");
  }

  return error.stack || String(error);
}

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", formatStartupError(error));
    console.error(
      `Check MySQL connection settings: DB_HOST=${env.DB_HOST}, DB_PORT=${env.DB_PORT}, DB_NAME=${env.DB_NAME}, DB_USER=${env.DB_USER}`
    );
    process.exit(1);
  }
}

startServer();
