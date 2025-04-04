const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 📁 Création du dossier ./data si inexistant
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// 📦 Connexion à la base SQLite
const dbPath = path.join('./data', 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur ouverture DB :', err.message);
  } else {
    console.log('✅ Connexion à SQLite établie');
  }
});

// 🏗️ Création des tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    images TEXT,
    price REAL NOT NULL,
    category TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS panier (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);
});

// ✅ Export de l'accès à la DB + fermeture propre pour les tests
module.exports = Object.freeze({
  getConnection: () => db,

  // Fonction pour fermer proprement la DB après les tests
  closeConnection: (done) => {
    db.close((err) => {
      if (err) {
        console.error('❌ Erreur fermeture DB :', err.message);
      } else {
        console.log('✅ Connexion à SQLite fermée');
      }
      if (done) done(); // Supporte les tests Jest
    });
  },
});
