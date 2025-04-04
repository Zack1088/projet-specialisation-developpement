const router = require('express').Router();
const controller = require('../controllers/userController');
const verifySession = require('../middlewares/verifySession');

// ✅ Routes publiques
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', controller.logout);

// ✅ Route protégée
router.get('/profile/:id', verifySession, controller.getProfile);

// ✅ Route d'identité (me) accessible sans verifySession
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Non connecté' });
  }
  res.status(200).json(req.session.user); // ✅ réponse directe = user
});
module.exports = router;
