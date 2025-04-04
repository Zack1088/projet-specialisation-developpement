module.exports = (() => {
  const db = () => require('../config/db').getConnection();

  return Object.freeze({
    addToCart: (userId, productId, quantity) =>
      new Promise((resolve, reject) =>
        db().run(
          'INSERT INTO panier (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [userId, productId, quantity],
          function (err) {
            return err
              ? reject(err)
              : resolve({ id: this.lastID, userId, productId, quantity });
          },
        ),
      ),

    getCartByUser: (userId) =>
      new Promise((resolve, reject) =>
        db().all(
          `SELECT p.id AS panier_id, pr.id AS product_id, pr.name, pr.price, pr.images, pr.category, p.quantity
             FROM panier p
             JOIN products pr ON p.product_id = pr.id
             WHERE p.user_id = ?`,
          [userId],
          (err, rows) => (err ? reject(err) : resolve(rows)),
        ),
      ),

    removeFromCart: (panierId) =>
      new Promise((resolve, reject) =>
        db().run('DELETE FROM panier WHERE id = ?', [panierId], function (err) {
          return err ? reject(err) : resolve({ deleted: this.changes > 0 });
        }),
      ),

    removeByUserAndProduct: (userId, productId) =>
      new Promise((resolve, reject) =>
        db().run(
          'DELETE FROM panier WHERE user_id = ? AND product_id = ?',
          [userId, productId],
          function (err) {
            return err ? reject(err) : resolve({ deleted: this.changes > 0 });
          },
        ),
      ),

    clearCart: (userId) =>
      new Promise((resolve, reject) =>
        db().run(
          'DELETE FROM panier WHERE user_id = ?',
          [userId],
          function (err) {
            return err ? reject(err) : resolve({ cleared: this.changes });
          },
        ),
      ),
  });
})();
