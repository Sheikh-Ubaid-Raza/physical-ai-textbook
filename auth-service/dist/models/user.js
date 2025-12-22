"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileSchema = exports.LoginDataSchema = exports.RegistrationDataSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1).max(100),
    password_hash: zod_1.z.string(),
    software_background: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced']),
    hardware_background: zod_1.z.enum(['None', 'Arduino', 'RaspberryPi']),
    learning_goal: zod_1.z.string().optional(),
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime(),
    is_active: zod_1.z.boolean().default(true),
});
exports.RegistrationDataSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1).max(100),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
    software_background: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced']),
    hardware_background: zod_1.z.enum(['None', 'Arduino', 'RaspberryPi']),
    learning_goal: zod_1.z.string().optional(),
});
exports.LoginDataSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
});
exports.UpdateProfileSchema = zod_1.z.object({
    software_background: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    hardware_background: zod_1.z.enum(['None', 'Arduino', 'RaspberryPi']).optional(),
    learning_goal: zod_1.z.string().optional(),
});
//# sourceMappingURL=user.js.map