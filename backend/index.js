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

// Connexion MongoDB avec timeout et logs détaillés
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('Connecté à MongoDB (URI ok)'))
  .catch(err => {
    console.error('Echec connexion MongoDB:', err.message);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB déconnecté');
});

// Route santé avant middleware DB
app.get('/', (_req, res) => res.send('API opérationnelle !'));
app.get('/health', (_req,res) => {
  res.json({ dbState: mongoose.connection.readyState });
});

// Middleware: bloquer si DB pas prête (0=disconnected,2=connecting)
app.use((req,res,next) => {
  const ready = mongoose.connection.readyState === 1; // 1 = connected
  if (!ready && !req.path.startsWith('/api-docs')) {
    return res.status(503).json({ error: 'Base de données indisponible', state: mongoose.connection.readyState });
  }
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');
app.use('/auth', authRoutes);
app.use('/contacts', contactsRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (require.main === module) {
  app.listen(PORT, () => console.log('Serveur sur http://localhost:' + PORT));
}

module.exports = app;
