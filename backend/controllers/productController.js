const productModel = require('../models/productModel');

exports.getAllProducts = (req, res) =>
  productModel.getAllProducts()
    .then((products) => res.json(products))
    .catch((err) => res.status(500).json({ error: err.message }));

exports.getProductById = (req, res) =>
  productModel.getProductById(req.params.id)
    .then((product) =>
      product
        ? res.json(product)
        : res.status(404).json({ error: 'Produit non trouvé' })
    )
    .catch((err) => res.status(500).json({ error: err.message }));

exports.addProduct = (req, res) =>
  productModel.addProduct(
    req.body.name,
    req.body.description,
    req.body.images,
    req.body.price,
    req.body.category
  )
    .then((product) => res.status(201).json(product))
    .catch((err) => res.status(500).json({ error: err.message }));

exports.updateProduct = (req, res) =>
  productModel.updateProduct(
    req.params.id,
    req.body.name,
    req.body.description,
    req.body.images,
    req.body.price,
    req.body.category
  )
    .then((product) => res.json(product))
    .catch((err) => res.status(500).json({ error: err.message }));

exports.deleteProduct = (req, res) =>
  productModel.deleteProduct(req.params.id)
    .then(() => res.json({ message: 'Produit supprimé' }))
    .catch((err) => res.status(500).json({ error: err.message }));
