// MongoDB init script — creates demo accounts with pre-hashed passwords
// Passwords are bcrypt hashes of "password123" (12 rounds)
const HASH = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/yfQ2yOvYU3tZa6rIe";

db = db.getSiblingDB("users_db");

db.createCollection("users");

db.users.createIndex({ email: 1 }, { unique: true });

const now = new Date();

db.users.insertMany([
  {
    email: "admin@demo.com",
    passwordHash: HASH,
    firstName: "Admin",
    lastName: "LearnHub",
    role: "admin",
    isActive: true,
    bio: "Administrateur de la plateforme LearnHub.",
    createdAt: now,
    updatedAt: now,
  },
  {
    email: "instructor@demo.com",
    passwordHash: HASH,
    firstName: "Marie",
    lastName: "Dupont",
    role: "instructor",
    isActive: true,
    bio: "Instructrice expérimentée en DevOps et Cloud.",
    createdAt: now,
    updatedAt: now,
  },
  {
    email: "student@demo.com",
    passwordHash: HASH,
    firstName: "Thomas",
    lastName: "Martin",
    role: "student",
    isActive: true,
    bio: "Apprenant passionné par le développement web et le cloud.",
    createdAt: now,
    updatedAt: now,
  },
], { ordered: false });

print("✅ Demo users created: admin@demo.com, instructor@demo.com, student@demo.com (password: password123)");
