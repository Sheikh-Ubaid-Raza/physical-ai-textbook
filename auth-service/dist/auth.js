"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    if (password.length < 8) {
        return {
            valid: false,
            message: 'Password must be at least 8 characters long'
        };
    }
    return {
        valid: true,
        message: ''
    };
};
exports.validatePassword = validatePassword;
exports.auth = {
    hono: null,
};
//# sourceMappingURL=auth.js.map