require("dotenv").config();

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
const dbPassword = process.env.DB_PASSWORD || "password";

if (nodeEnv === "production") {
  if (!jwtSecret || jwtSecret === "your-secret-key") {
    throw new Error(
      "❌ PRODUCTION CONFIG ERROR: Invalid JWT_SECRET. Set a strong JWT_SECRET in .env.production before startup.",
    );
  }
  if (!dbPassword || dbPassword === "password") {
    throw new Error(
      "❌ PRODUCTION CONFIG ERROR: Invalid DB_PASSWORD. Set a strong DB_PASSWORD in .env.production before startup.",
    );
  }
  console.log("✅ Production secrets validated.");
}

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "task_api",
    user: process.env.DB_USER || "postgres",
    password: dbPassword,
  },
  jwt: {
    secret: jwtSecret,
    expire: process.env.JWT_EXPIRE || "7d",
  },
};
