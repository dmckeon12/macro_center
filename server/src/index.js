import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import config from './config/config.js';
import logger from './config/logger.js';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import setupSwagger from './config/swagger.js';
import { errorConverter, errorHandler } from './middleware/error.middleware.js';
import { initializePassport } from './middleware/auth.middleware.js';

// Initialize Express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data to prevent MongoDB Injection
app.use(mongoSanitize());

// Enable CORS
app.use(cors());

// Enable request compression
app.use(compression());

// Request logger
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Initialize Passport
initializePassport();

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// Set up Swagger documentation
setupSwagger(app);

// API routes
app.use('/api', routes);

// Handle Stripe webhook route separately (needs raw body)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Serve static files in production
if (config.env === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, '../../../dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../dist/index.html'));
  });
}

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

// Start server
const PORT = config.port || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start listening
    app.listen(PORT, () => {
      logger.info(`Server running in ${config.env} mode on port ${PORT}`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  // process.exit(1);
});

export default app;
