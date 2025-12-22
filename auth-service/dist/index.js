"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const auth_1 = __importDefault(require("./routes/auth"));
const app = new hono_1.Hono();
app.use('*', (0, cors_1.cors)({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.get('/', (c) => {
    return c.text('Auth Service is running!');
});
app.get('/health', (c) => {
    return c.json({ status: 'ok', service: 'auth' });
});
app.route('/api/auth', auth_1.default);
app.onError((err, c) => {
    console.error(`${err}`);
    return c.json({ error: 'Internal Server Error' }, 500);
});
const port = parseInt(process.env.NODE_AUTH_PORT || '3001');
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    import('@hono/node-server').then(({ serve }) => {
        console.log(`Server running on port ${port}`);
        serve({
            fetch: app.fetch,
            port
        });
    });
}
else {
    console.log(`Server running on port ${port}`);
}
exports.default = app;
//# sourceMappingURL=index.js.map