import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/auth';

const app = new Hono();

// Enable CORS
app.use('*', cors());

// Health check endpoint
app.get('/', (c) => {
  return c.text('Auth Service is running!');
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'auth' });
});

// Mount auth routes
app.route('/api/auth', authRoutes);

// Error handling middleware
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: 'Internal Server Error' }, 500);
});

const port = parseInt(process.env.NODE_AUTH_PORT || '3001');

// For Cloudflare Workers or other environments that support the export default pattern
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // For local development with node server
  import('@hono/node-server').then(({ serve }) => {
    console.log(`Server running on port ${port}`);
    serve({
      fetch: app.fetch,
      port
    });
  });
} else {
  console.log(`Server running on port ${port}`);
}

export default app;