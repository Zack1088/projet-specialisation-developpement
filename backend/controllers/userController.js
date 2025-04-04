require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.register = (req, res) =>
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) =>
      User.create(req.body.username, req.body.email, hashedPassword)
    )
    .then((user) =>
      res.status(201).json({ message: 'Utilisateur créé', user })
    )
    .catch((err) => {
      if (
        err.message.includes('UNIQUE constraint failed') ||
        err.message.includes('SQLITE_CONSTRAINT')
      ) {
        return res.status(400).json({ error: 'Utilisateur existe déjà' });
      }

      return res.status(400).json({ error: err.message });
    });

exports.login = (req, res) =>
  User.findByEmail(req.body.email)
    .then((user) => {
      if (!user) {
        return Promise.reject({ code: 404, message: 'Utilisateur non trouvé' });
      }
      return bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return Promise.reject({
            code: 401,
            message: 'Mot de passe incorrect',
          });
        }

        // ✅ Enregistre l'utilisateur dans la session
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
        };

        return res.json({
          message: 'Connexion réussie',
          user: req.session.user,
        });
      });
    })
    .catch((err) =>
      res.status(err.code || 500).json({ error: err.message || err }),
    );

exports.getProfile = (req, res) =>
  User.findById(req.params.id)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(404).json({ error: 'Utilisateur non trouvé' }),
    )
    .catch((err) => res.status(500).json({ error: err.message }));

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // ← true en production HTTPS
    });
    res.json({ message: 'Déconnexion réussie' });
  });
};
