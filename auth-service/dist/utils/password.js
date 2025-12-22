"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await (0, bcrypt_1.hash)(password, saltRounds);
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hash) => {
    return await (0, bcrypt_1.compare)(password, hash);
};
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=password.js.map