require('dotenv').config(); // Ajout de l'import dotenv

// Fichier backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Remplacez <MONGODB_URI> par votre URI MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

app.use(express.json());
// CORS simplifié (ouvert) pour débloquer rapidement le fonctionnement en prod
app.use(cors());

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
