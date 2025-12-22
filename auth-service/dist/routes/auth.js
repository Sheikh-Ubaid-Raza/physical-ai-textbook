"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const password_1 = require("../utils/password");
const validation_1 = require("../middleware/validation");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = require("path");
const dbPath = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace('sqlite:///', '')
    : (0, path_1.join)(process.cwd(), 'local_chat.db');
const db = new better_sqlite3_1.default(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    software_background TEXT DEFAULT 'Beginner',
    hardware_background TEXT DEFAULT 'None',
    learning_goal TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    last_accessed_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);
const app = new hono_1.Hono();
app.post('/register', validation_1.validateRegistration, async (c) => {
    try {
        const validatedData = c.get('validatedData');
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(validatedData.email);
        if (existingUser) {
            return c.json({ error: 'User already exists' }, 409);
        }
        const password_hash = await (0, password_1.hashPassword)(validatedData.password);
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const result = db.prepare(`
      INSERT INTO users (id, email, name, password_hash, software_background, hardware_background, learning_goal)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, validatedData.email, validatedData.name, password_hash, validatedData.software_background, validatedData.hardware_background, validatedData.learning_goal || null);
        const token = `mock-jwt-${userId}-${Date.now()}`;
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const sessionId = `session_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        db.prepare(`
      INSERT INTO user_sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(sessionId, userId, token, expires_at);
        const user = {
            id: userId,
            email: validatedData.email,
            name: validatedData.name,
            password_hash,
            software_background: validatedData.software_background,
            hardware_background: validatedData.hardware_background,
            learning_goal: validatedData.learning_goal,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true
        };
        const session = {
            token,
            expires_at
        };
        return c.json({
            user,
            session
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return c.json({ error: 'Registration failed', details: error.message }, 500);
    }
});
app.post('/login', validation_1.validateLogin, async (c) => {
    try {
        const validatedData = c.get('validatedData');
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(validatedData.email);
        if (!user) {
            return c.json({ error: 'Invalid email or password. Account does not exist.' }, 401);
        }
        const isValidPassword = await (0, password_1.verifyPassword)(validatedData.password, user.password_hash);
        if (!isValidPassword) {
            return c.json({ error: 'Invalid email or password' }, 401);
        }
        const token = `mock-jwt-${user.id}-${Date.now()}`;
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const sessionId = `session_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        db.prepare(`
      INSERT INTO user_sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(sessionId, user.id, token, expires_at);
        const session = {
            token,
            expires_at
        };
        return c.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                software_background: user.software_background,
                hardware_background: user.hardware_background,
                learning_goal: user.learning_goal,
                created_at: user.created_at,
                updated_at: user.updated_at,
                is_active: user.is_active
            },
            session
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return c.json({ error: 'Login failed', details: error.message }, 500);
    }
});
app.get('/me', validation_1.requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }
        return c.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                software_background: user.software_background,
                hardware_background: user.hardware_background,
                learning_goal: user.learning_goal,
                created_at: user.created_at,
                updated_at: user.updated_at,
                is_active: user.is_active
            }
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        return c.json({ error: 'Failed to get user', details: error.message }, 500);
    }
});
app.put('/profile', validation_1.requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json();
        const stmt = db.prepare(`
      UPDATE users
      SET
        software_background = COALESCE(?, software_background),
        hardware_background = COALESCE(?, hardware_background),
        learning_goal = ?
      WHERE id = ?
    `);
        stmt.run(body.software_background || null, body.hardware_background || null, body.learning_goal || null, userId);
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }
        return c.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                software_background: user.software_background,
                hardware_background: user.hardware_background,
                learning_goal: user.learning_goal,
                created_at: user.created_at,
                updated_at: user.updated_at,
                is_active: user.is_active
            }
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        return c.json({ error: 'Failed to update profile', details: error.message }, 500);
    }
});
app.post('/logout', validation_1.requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(userId);
        return c.json({ success: true });
    }
    catch (error) {
        console.error('Logout error:', error);
        return c.json({ error: 'Logout failed', details: error.message }, 500);
    }
});
exports.default = app;
//# sourceMappingURL=auth.js.map