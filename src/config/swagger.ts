import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient Referral Tracker API',
      version: '1.0.0',
      description: 'API for managing patient referrals across facilities',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.ts')],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;