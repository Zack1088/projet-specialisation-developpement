const router = require('express').Router();
const controller = require('../controllers/cartController');

// 🔓 Accessible aux visiteurs
router.get('/', controller.getCartSession);    // 🧾 Voir panier visiteur
router.post('/', controller.addToCart);        // ➕ Ajouter produit au panier visiteur

module.exports = router;
