require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
// Validation et nettoyage de l'URI Mongo
let rawUri = (process.env.MONGODB_URI || '').trim();
if (!rawUri) {
  console.error('MONGODB_URI manquant (variable d\'environnement).');
} else if (!rawUri.startsWith('mongodb://') && !rawUri.startsWith('mongodb+srv://')) {
  console.error('MONGODB_URI invalide (schéma attendu mongodb:// ou mongodb+srv://) =>', rawUri);
}
// Masquage mot de passe pour log
function maskMongo(uri) {
  try {
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:@]+):([^@]+)@(.+)$/);
    if (match) {
      return match[1] + match[2] + ':***@' + match[4];
    }
    return uri;
  } catch { return uri; }
}
console.log('MONGODB_URI utilisé (masqué):', maskMongo(rawUri || '(vide)'));
const MONGODB_URI = rawUri || 'mongodb://localhost:27017/test';

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
