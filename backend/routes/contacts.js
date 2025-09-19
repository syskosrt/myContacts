const express = require('express');
const Contact = require('../models/Contact');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *           example: Jean
 *         lastName:
 *           type: string
 *           example: Dupont
 *         phone:
 *           type: string
 *           example: 0612345678
 *         user:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Liste des contacts de l'utilisateur connecté
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Erreur serveur
 */
// Middleware pour protéger toutes les routes
router.use(requireAuth);

// GET /contacts - Liste des contacts de l'utilisateur connecté
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.userId });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Création d'un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: Dupont
 *               phone:
 *                 type: string
 *                 example: 0612345678
 *     responses:
 *       201:
 *         description: Contact créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Champs requis manquants ou numéro invalide
 *       500:
 *         description: Erreur serveur
 */
// POST /contacts - Création d'un contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({ error: 'Champs requis manquants.' });
    }
    if (phone.length < 10 || phone.length > 20) {
      return res.status(400).json({ error: 'Le numéro doit faire entre 10 et 20 caractères.' });
    }
    const contact = new Contact({
      firstName,
      lastName,
      phone,
      user: req.user.userId
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Modification partielle d'un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: Dupont
 *               phone:
 *                 type: string
 *                 example: 0612345678
 *     responses:
 *       200:
 *         description: Contact modifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Numéro invalide
 *       404:
 *         description: Contact non trouvé
 *       500:
 *         description: Erreur serveur
 */
// PATCH /contacts/:id - Modification partielle
router.patch('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user.userId });
    if (!contact) {
      return res.status(404).json({ error: 'Contact non trouvé.' });
    }
    const { firstName, lastName, phone } = req.body;
    if (phone && (phone.length < 10 || phone.length > 20)) {
      return res.status(400).json({ error: 'Le numéro doit faire entre 10 et 20 caractères.' });
    }
    if (firstName !== undefined) contact.firstName = firstName;
    if (lastName !== undefined) contact.lastName = lastName;
    if (phone !== undefined) contact.phone = phone;
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Suppression d'un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du contact
 *     responses:
 *       200:
 *         description: Contact supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact supprimé.
 *       404:
 *         description: Contact non trouvé
 *       500:
 *         description: Erreur serveur
 */
// DELETE /contacts/:id - Suppression
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!contact) {
      return res.status(404).json({ error: 'Contact non trouvé.' });
    }
    res.json({ message: 'Contact supprimé.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
