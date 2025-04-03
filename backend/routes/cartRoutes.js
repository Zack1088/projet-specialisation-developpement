const router = require('express').Router();
const controller = require('../controllers/cartController');

// 🧠 Important : routes précises d'abord

router.post('/', controller.addToCart);
router.delete('/:id', controller.removeFromCart);
router.delete('/user/:userId', controller.clearCart);

// ✅ 🧨 Doit être placée en dernier !
router.get('/:userId', controller.getCartByUser);

module.exports = router;