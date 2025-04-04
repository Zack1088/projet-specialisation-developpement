const router = require('express').Router();
const controller = require('../controllers/productController');

// ✅ Route publique
router.get('/', controller.getAllProducts);

// ✅ Route par ID (optionnelle pour afficher un produit)
router.get('/:id', controller.getProductById);

// 🔒 Routes sécurisées (admin uniquement par exemple)
router.post('/', controller.addProduct);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;
