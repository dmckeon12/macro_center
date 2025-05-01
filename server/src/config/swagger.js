import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config.js';
import { version } from '../../package.json';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MacroCenter API Documentation',
    version,
    description: 'API documentation for MacroCenter e-commerce platform',
    license: {
      name: 'ISC',
    },
    contact: {
      name: 'MacroCenter Support',
      url: 'https://macrocenter.example.com',
      email: 'support@macrocenter.example.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api`,
      description: 'Development server',
    },
    {
      url: 'https://macrocenter.example.com/api',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/docs/*.yml', './src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

/**
 * Setup Swagger documentation middleware for Express
 * @param {Express} app - Express app
 */
const setupSwagger = (app) => {
  // Serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve swagger spec as JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default setupSwagger;
