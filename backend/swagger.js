const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Auth MyContacts',
      version: '1.0.0',
      description: 'Documentation de l’API d’authentification (register, login)'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur local'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

