export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  mongoUri: process.env.MONGODB_URI || "mongodb://learning:learning_secret@mongodb:27017/users_db?authSource=admin",
  jwtSecret: process.env.JWT_SECRET || "supersecretjwtkey_change_in_production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  redisUrl: process.env.REDIS_URL || "redis://:redis_secret@redis:6379",
  nodeEnv: process.env.NODE_ENV || "development",
};
