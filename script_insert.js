const dbInstance = require('./backend/config/db');
const db = dbInstance.getConnection();

const products = [
  { name: "Smartphone Galaxy X", description: "Un smartphone performant avec écran AMOLED", images: JSON.stringify(["images/products/image1.jpg", "images/products/image2.jpg"]), price: 599.99, category: "Électronique" },
  { name: "Ordinateur Portable UltraBook", description: "Un ultrabook léger et puissant", images: JSON.stringify(["images/products/image3.jpg", "images/products/image4.jpg"]), price: 1099.99, category: "Informatique" },
  { name: "Casque Bluetooth Pro", description: "Casque sans fil avec réduction de bruit", images: JSON.stringify(["images/products/image5.jpg"]), price: 199.99, category: "Audio" },
  { name: "Montre Connectée FitPlus", description: "Montre intelligente avec suivi d'activité", images: JSON.stringify(["images/products/image6.jpg"]), price: 149.99, category: "Accessoires" },
  { name: "TV OLED 55 pouces", description: "Téléviseur OLED 4K avec HDR10", images: JSON.stringify(["images/products/image7.jpg"]), price: 1299.99, category: "Électronique" },
  { name: "Clavier Mécanique RGB", description: "Clavier gamer avec switchs mécaniques", images: JSON.stringify(["images/products/image8.jpg"]), price: 129.99, category: "Informatique" },
  { name: "Souris Gaming UltraLight", description: "Souris ultra légère avec capteur 16K DPI", images: JSON.stringify(["images/products/image9.jpg"]), price: 79.99, category: "Informatique" },
  { name: "Enceinte Bluetooth Boom", description: "Enceinte portable avec son stéréo puissant", images: JSON.stringify(["images/products/image10.jpg"]), price: 89.99, category: "Audio" },
  { name: "Tablette Graphique Pro", description: "Tablette pour dessin numérique avec stylet", images: JSON.stringify(["images/products/image11.jpg"]), price: 249.99, category: "Informatique" },
  { name: "Caméra de Surveillance HD", description: "Caméra WiFi avec vision nocturne", images: JSON.stringify(["images/products/image12.jpg"]), price: 129.99, category: "Sécurité" },
];

const insertProduct = (product) => {
  const { name, description, images, price, category } = product;
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO products (name, description, images, price, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, images, price, category],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, name, description, images: JSON.parse(images), price, category });
        }
      }
    );
  });
};

const insertAllProducts = async () => {
  for (const product of products) {
    try {
      const result = await insertProduct(product);
      console.log(`Produit inséré:`, result);
    } catch (err) {
      console.error(`Erreur lors de l'insertion du produit:`, err.message);
    }
  }
  db.close();
};

insertAllProducts();
