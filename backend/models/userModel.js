module.exports = {
  create: (username, email, hashedPassword) =>
    new Promise((resolve, reject) =>
      require('../config/db')
        .getConnection()
        .run(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          function (err) {
            return err
              ? reject(err)
              : resolve({ id: this.lastID, username, email });
          },
        ),
    ),

  findByEmail: (email) =>
    new Promise((resolve, reject) =>
      require('../config/db')
        .getConnection()
        .get('SELECT * FROM users WHERE email = ?', [email], (err, row) =>
          err ? reject(err) : resolve(row),
        ),
    ),

  findById: (id) =>
    new Promise((resolve, reject) =>
      require('../config/db')
        .getConnection()
        .get(
          'SELECT id, username, email FROM users WHERE id = ?',
          [id],
          (err, row) => (err ? reject(err) : resolve(row)),
        ),
    ),
};
