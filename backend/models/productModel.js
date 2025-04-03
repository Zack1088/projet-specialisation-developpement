const db = require('../config/db');

module.exports = {
  // 📦 Obtenir tous les produits
  getAllProducts: () =>
    new Promise((resolve, reject) =>
      db.getConnection().all('SELECT * FROM products', [], (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    ),

  // 🔍 Produit par ID
  getProductById: (id) =>
    new Promise((resolve, reject) =>
      db.getConnection().get('SELECT * FROM products WHERE id = ?', [id], (err, row) =>
        err ? reject(err) : resolve(row)
      )
    ),

  // ➕ Ajouter un produit
  addProduct: (name, description, images, price, category) =>
    new Promise((resolve, reject) =>
      db.getConnection().run(
        'INSERT INTO products (name, description, images, price, category) VALUES (?, ?, ?, ?, ?)',
        [name, description, JSON.stringify(images), price, category],
        function (err) {
          return err
            ? reject(err)
            : resolve({ id: this.lastID, name, description, images, price, category });
        }
      )
    ),

  // ✏️ Modifier un produit
  updateProduct: (id, name, description, images, price, category) =>
    new Promise((resolve, reject) =>
      db.getConnection().run(
        'UPDATE products SET name = ?, description = ?, images = ?, price = ?, category = ? WHERE id = ?',
        [name, description, JSON.stringify(images), price, category, id],
        function (err) {
          return err
            ? reject(err)
            : resolve({ id, name, description, images, price, category });
        }
      )
    ),

  // ❌ Supprimer un produit
  deleteProduct: (id) =>
    new Promise((resolve, reject) =>
      db.getConnection().run('DELETE FROM products WHERE id = ?', [id], function (err) {
        return err ? reject(err) : resolve({ id });
      })
    ),

  // 🔄 Obtenir plusieurs produits par leur ID (pour le panier visiteur)
  getProductsByIds: (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return Promise.resolve([]);

    const placeholders = ids.map(() => '?').join(',');
    const sql = `SELECT * FROM products WHERE id IN (${placeholders})`;

    return new Promise((resolve, reject) =>
      db.getConnection().all(sql, ids, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );
  }
};
