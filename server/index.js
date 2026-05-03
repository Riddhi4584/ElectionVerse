import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import { isValidEmail, isValidPassword, isNotEmpty } from './utils/validation.js';
import { AppError, errorHandler } from './utils/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db;

// Initialize DB and start server
initDb().then(database => {
  db = database;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// Helper to get user with steps
async function getUserData(userId) {
  const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return null;
  const stepsRows = await db.all('SELECT step_index FROM user_steps WHERE user_id = ?', [userId]);
  user.completedSteps = stepsRows.map(r => r.step_index);
  return user;
}

// --- API ROUTES ---

// 1. Register
app.post('/api/auth/register', async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!isValidEmail(email)) {
    return next(new AppError('Invalid email format', 400, 'INVALID_EMAIL'));
  }
  if (!isValidPassword(password)) {
    return next(new AppError('Password must be at least 6 characters', 400, 'WEAK_PASSWORD'));
  }

  try {
    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password]
    );
    const user = await getUserData(result.lastID);
    res.status(200).json({ success: true, user });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      next(new AppError('User already exists', 400, 'USER_EXISTS'));
    } else {
      next(err);
    }
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!isValidEmail(email) || !isNotEmpty(password)) {
    return next(new AppError('Invalid email or password', 400, 'INVALID_CREDENTIALS'));
  }

  try {
    const userRow = await db.get('SELECT id FROM users WHERE email = ? AND password = ?', [email, password]);
    if (!userRow) {
      return next(new AppError('Invalid email or password', 401, 'UNAUTHORIZED'));
    }
    const user = await getUserData(userRow.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// 3. Update Onboarding
app.put('/api/user/onboarding', async (req, res, next) => {
  const { userId, activeRole, language, location } = req.body;
  
  if (!isNotEmpty(userId) || !isNotEmpty(activeRole)) {
    return next(new AppError('Missing required fields', 400, 'MISSING_FIELDS'));
  }

  try {
    await db.run(
      `UPDATE users 
       SET activeRole = ?, language = ?, location = ?, onboardingComplete = 1 
       WHERE id = ?`,
      [activeRole, language, location, userId]
    );
    const user = await getUserData(userId);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// 4. Mark Step Complete
app.post('/api/journey/step', async (req, res, next) => {
  const { userId, stepIndex } = req.body;
  
  if (!isNotEmpty(userId) || stepIndex === undefined) {
    return next(new AppError('Missing required fields', 400, 'MISSING_FIELDS'));
  }

  try {
    await db.run(
      'INSERT OR IGNORE INTO user_steps (user_id, step_index) VALUES (?, ?)',
      [userId, stepIndex]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Error handling middleware MUST be added after all routes
app.use(errorHandler);
