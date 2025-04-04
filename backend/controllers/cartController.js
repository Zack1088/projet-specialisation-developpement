const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel'); // Pour charger les infos des produits

// ➕ Ajouter un produit au panier (connecté ou visiteur)
exports.addToCart = (req, res) => {
  const { user_id, product_id, quantity = 1 } = req.body;

  if (user_id) {
    // ✅ Utilisateur connecté → en base de données
    return CartModel.addToCart(user_id, product_id, quantity)
      .then((item) =>
        res.status(201).json({ message: 'Article ajouté au panier', item }),
      )
      .catch((err) => res.status(400).json({ error: err.message }));
  }

  // 👤 Visiteur → stockage dans session
  req.session.cart = req.session.cart || [];

  const existing = req.session.cart.find(
    (item) => item.product_id === product_id,
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    req.session.cart.push({ product_id, quantity });
  }

  return res
    .status(201)
    .json({ message: 'Article ajouté au panier (visiteur)' });
};

// 🧾 Panier visiteur enrichi avec infos produit (même sans session.user)
exports.getCartSession = async (req, res) => {
  req.session.cart = req.session.cart || [];

  try {
    const ids = req.session.cart.map((item) => item.product_id);
    const products = await ProductModel.getProductsByIds(ids); // 🔍 depuis BDD

    const items = req.session.cart.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        id: null,
        product_id: item.product_id,
        name: product?.name || `Produit #${item.product_id}`,
        category: product?.category || 'générique',
        price: product?.price || 0,
        quantity: item.quantity,
        images: product?.images ? JSON.parse(product.images) : [],
      };
    });

    const total = items.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0,
    );
    res.json({ items, total });
  } catch (err) {
    console.error('Erreur panier visiteur :', err);
    res.status(500).json({ error: 'Erreur lors du chargement du panier' });
  }
};

// ✅ Panier utilisateur (protégé)
exports.getCartByUser = (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (!req.session.user || req.session.user.id !== userId) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  CartModel.getCartByUser(userId)
    .then((items) =>
      res.json({
        total: items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0),
        items: items.map((p) => ({
          id: p.panier_id,
          product_id: p.product_id,
          name: p.name,
          category: p.category.toLowerCase(),
          price: p.price,
          quantity: p.quantity,
          images: JSON.parse(p.images),
        })),
      }),
    )
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ❌ Supprimer un item du panier connecté
exports.removeFromCart = (req, res) => {
  CartModel.removeFromCart(req.params.id)
    .then((result) =>
      result.deleted
        ? res.json({ message: 'Article supprimé du panier' })
        : res.status(404).json({ error: 'Élément non trouvé' }),
    )
    .catch((err) => res.status(500).json({ error: err.message }));
};

// 🧹 Vider le panier connecté
exports.clearCart = (req, res) => {
  CartModel.clearCart(req.params.userId)
    .then((result) =>
      res.json({ message: `Panier vidé (${result.cleared} élément(s))` }),
    )
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ❌ Supprimer un item du panier visiteur (par productId)
exports.removeFromVisitorCart = (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  req.session.cart = req.session.cart || [];

  const initialLength = req.session.cart.length;
  req.session.cart = req.session.cart.filter(
    (item) => item.product_id !== productId,
  );

  if (req.session.cart.length === initialLength) {
    return res.status(404).json({ error: 'Produit non trouvé dans le panier' });
  }

  res.json({ message: 'Produit supprimé du panier (visiteur)' });
};

// ❌ Supprimer un item du panier connecté (par userId et productId)
exports.removeByUserAndProduct = (req, res) => {
  const { userId, productId } = req.params;

  CartModel.removeByUserAndProduct(userId, productId)
    .then((result) =>
      result.deleted
        ? res.json({ message: 'Produit supprimé du panier' })
        : res.status(404).json({ error: 'Élément non trouvé' }),
    )
    .catch((err) => res.status(500).json({ error: err.message }));
};
