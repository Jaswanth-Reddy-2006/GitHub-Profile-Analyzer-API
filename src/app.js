const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const profileRoutes = require("./routes/profile.routes");
const { errorHandler, notFoundHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GitHub Profile Analyzer API is running",
    endpoints: {
      analyzeProfile: "POST /api/profiles/analyze/:username",
      profiles: "GET /api/profiles",
      profileByUsername: "GET /api/profiles/:username",
      health: "GET /health"
    }
  });
});

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/profiles", profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
