require("dotenv").config();

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
const dbPassword = process.env.DB_PASSWORD || "password";

if (nodeEnv === "production") {
  if (!jwtSecret || jwtSecret === "your-secret-key") {
    throw new Error(
      "Invalid JWT_SECRET for production. Configure a strong JWT_SECRET before startup.",
    );
  }

  if (!dbPassword || dbPassword === "password") {
    throw new Error(
      "Invalid DB_PASSWORD for production. Configure DB_PASSWORD before startup.",
    );
  }
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
