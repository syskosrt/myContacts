require('dotenv').config(); // Ajout de l'import dotenv

// Fichier backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS dynamique
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // requêtes internes / tests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origine non autorisée par CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors());

// Remplacez <MONGODB_URI> par votre URI MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

app.use(express.json());

// Importation des routes d'authentification
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Importation des routes de contacts
const contactsRoutes = require('./routes/contacts');
app.use('/contacts', contactsRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('API opérationnelle !');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
}

module.exports = app;
