const AuthService = require('../services/AuthService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }
    const existingUser = await AuthService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await AuthService.createUser(email, hashedPassword);
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Erreur serveur.', detail: process.env.DEBUG_ERRORS ? String(err) : undefined });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }
    const user = await AuthService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '1d' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Erreur serveur.', detail: process.env.DEBUG_ERRORS ? String(err) : undefined });
  }
};
