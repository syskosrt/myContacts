const ContactsService = require('../services/ContactsService');

exports.getContacts = async (req, res) => {
  try {
    const contacts = await ContactsService.findByUser(req.user.userId);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.createContact = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({ error: 'Champs requis manquants.' });
    }
    if (phone.length < 10 || phone.length > 20) {
      return res.status(400).json({ error: 'Le numéro doit faire entre 10 et 20 caractères.' });
    }
    const contact = await ContactsService.create({ firstName, lastName, phone, user: req.user.userId });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    if (phone && (phone.length < 10 || phone.length > 20)) {
      return res.status(400).json({ error: 'Le numéro doit faire entre 10 et 20 caractères.' });
    }
    const contact = await ContactsService.update(req.params.id, req.user.userId, { firstName, lastName, phone });
    if (!contact) {
      return res.status(404).json({ error: 'Contact non trouvé.' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await ContactsService.delete(req.params.id, req.user.userId);
    if (!contact) {
      return res.status(404).json({ error: 'Contact non trouvé.' });
    }
    res.json({ message: 'Contact supprimé.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

