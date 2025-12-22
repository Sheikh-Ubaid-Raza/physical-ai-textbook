"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.validateUpdateProfile = exports.validateLogin = exports.validateRegistration = void 0;
const zod_1 = require("zod");
const user_1 = require("../models/user");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = require("path");
const dbPath = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace('sqlite:///', '')
    : (0, path_1.join)(process.cwd(), 'local_chat.db');
const db = new better_sqlite3_1.default(dbPath);
const validateRegistration = async (c, next) => {
    try {
        const body = await c.req.json();
        if (body.password && body.password.length < 8) {
            return c.json({
                error: 'Validation error',
                details: [{
                        field: 'password',
                        message: 'Password must be at least 8 characters long'
                    }]
            }, 400);
        }
        if (body.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(body.email)) {
                return c.json({
                    error: 'Validation error',
                    details: [{
                            field: 'email',
                            message: 'Invalid email format'
                        }]
                }, 400);
            }
        }
        const validatedData = user_1.RegistrationDataSchema.parse(body);
        c.set('validatedData', validatedData);
        await next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return c.json({
                error: 'Validation error',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            }, 400);
        }
        return c.json({ error: 'Invalid request data' }, 400);
    }
};
exports.validateRegistration = validateRegistration;
const validateLogin = async (c, next) => {
    try {
        const body = await c.req.json();
        if (body.password && body.password.length < 8) {
            return c.json({
                error: 'Validation error',
                details: [{
                        field: 'password',
                        message: 'Password must be at least 8 characters long'
                    }]
            }, 400);
        }
        if (body.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(body.email)) {
                return c.json({
                    error: 'Validation error',
                    details: [{
                            field: 'email',
                            message: 'Invalid email format'
                        }]
                }, 400);
            }
        }
        const validatedData = user_1.LoginDataSchema.parse(body);
        c.set('validatedData', validatedData);
        await next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return c.json({
                error: 'Validation error',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            }, 400);
        }
        return c.json({ error: 'Invalid request data' }, 400);
    }
};
exports.validateLogin = validateLogin;
const validateUpdateProfile = async (c, next) => {
    try {
        const body = await c.req.json();
        const validatedData = user_1.UpdateProfileSchema.parse(body);
        c.set('validatedData', validatedData);
        await next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return c.json({
                error: 'Validation error',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            }, 400);
        }
        return c.json({ error: 'Invalid request data' }, 400);
    }
};
exports.validateUpdateProfile = validateUpdateProfile;
const requireAuth = async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Authorization header required' }, 401);
    }
    const token = authHeader.substring(7);
    const session = db.prepare('SELECT * FROM user_sessions WHERE token = ?').get(token);
    if (!session) {
        return c.json({ error: 'Invalid or expired token' }, 401);
    }
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    if (now > expiresAt) {
        db.prepare('DELETE FROM user_sessions WHERE token = ?').run(token);
        return c.json({ error: 'Session has expired' }, 401);
    }
    c.set('userId', session.user_id);
    await next();
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=validation.js.map