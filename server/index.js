import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';

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
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password]
    );
    const user = await getUserData(result.lastID);
    res.json({ success: true, user });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ success: false, error: 'User already exists' });
    } else {
      res.status(500).json({ success: false, error: err.message });
    }
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const userRow = await db.get('SELECT id FROM users WHERE email = ? AND password = ?', [email, password]);
    if (!userRow) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    const user = await getUserData(userRow.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Update Onboarding
app.put('/api/user/onboarding', async (req, res) => {
  const { userId, activeRole, language, location } = req.body;
  
  try {
    await db.run(
      `UPDATE users 
       SET activeRole = ?, language = ?, location = ?, onboardingComplete = 1 
       WHERE id = ?`,
      [activeRole, language, location, userId]
    );
    const user = await getUserData(userId);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Mark Step Complete
app.post('/api/journey/step', async (req, res) => {
  const { userId, stepIndex } = req.body;
  
  try {
    await db.run(
      'INSERT OR IGNORE INTO user_steps (user_id, step_index) VALUES (?, ?)',
      [userId, stepIndex]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
