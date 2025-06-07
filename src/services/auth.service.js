import bcrypt from 'bcrypt';
import { users } from '../models/user.model.js';
import { db } from '../database/db.js';
import { eq } from 'drizzle-orm';
import { betterAuth } from 'better-auth';

// Register 
export const registerUserService = async (email, password) => {
  // Check if the user already exists
  const existingUser = await db.query.users.findFirst({ where: (users) => eq(users.email, email)});
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user into the database
 await db.insert(users).values({
    email,
    hashed_password: hashedPassword,
  });
};

// LOGIN
export const loginUserService = async (email, password) => {
  // Find the user by email
  const user = await db.query.users.findFirst({ where: (users) => eq(users.email, email)});
  if (!user) {
    throw new Error('User not found');
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
    token: generateToken(user.id, email),
  };
};

const generateToken = (userId, email) => {
  // Generate a JWT token using the `brearToken` library if `better-auth` is not used.
};
