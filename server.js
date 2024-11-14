const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const User = require('./user');
const sequelize = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public')); // Servir les fichiers statiques

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use(limiter);

// CSRF Protection
const csrfProtection = csurf({ cookie: true });

// Route pour servir le formulaire avec CSRF Token
app.get('/form', csrfProtection, (req, res) => {
  res.sendFile(__dirname + '/public/form.html');
});

// Route pour obtenir le CSRF Token
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Validation et sanitation des données
const userValidationRules = [
  body('nom').isString().withMessage('Nom doit être une chaîne de caractères').trim().escape(),
  body('prenom').isString().withMessage('Prénom doit être une chaîne de caractères').trim().escape(),
  body('date').isDate().withMessage('Date doit être une date valide').toDate()
];

// Route pour créer un utilisateur
app.post('/utilisateurs', userValidationRules, csrfProtection, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nom, prenom, date } = req.body;
    const user = await User.create({ nom, prenom, date });
    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Route pour récupérer tous les utilisateurs
app.get('/utilisateurs', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Route pour récupérer un utilisateur par ID
app.get('/utilisateurs/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

// Route pour mettre à jour un utilisateur
app.put('/utilisateurs/:id', userValidationRules, csrfProtection, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    const { nom, prenom, date } = req.body;
    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.date = date || user.date;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Route pour supprimer un utilisateur
app.delete('/utilisateurs/:id', csrfProtection, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    await user.destroy();
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
