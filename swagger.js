const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Todo list API',
      version: '1.0.0',
      description: 'API endpoints for the My Todo list app',
    },
    servers: [
      {
        url: 'http://localhost:3020',
      },
    ],
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(options);

module.exports = swaggerDocs;
