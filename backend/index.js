require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(cors()); // CORS ouvert simple
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Routes
const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');
app.use('/auth', authRoutes);
app.use('/contacts', contactsRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req, res) => res.send('API opérationnelle !'));

if (require.main === module) {
  app.listen(PORT, () => console.log('Serveur sur http://localhost:' + PORT));
}

module.exports = app;
