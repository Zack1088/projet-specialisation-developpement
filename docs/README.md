# 📄 Projet Backend Fonctionnel - API de Gestion Produits / Utilisateurs / Panier

## 🚀 Objectif

Une API backend en **Node.js + Express + SQLite** 100% en **programmation fonctionnelle pure** :

- Fonctions pures, sans effets de bord
- Promesses avec `then()`/`catch()` (pas d'`async/await`)
- JWT pour l'authentification
- CSRF et CORS pour la sécurité

---

## 🧬 Technologies

| Stack            | Lib/Technologie              |
| ---------------- | ---------------------------- |
| Serveur          | Node.js / Express            |
| Base de données  | SQLite3 (fichier local)      |
| Authentification | JWT + bcryptjs               |
| Sécurité         | Helmet, csurf, cookie-parser |
| Logger           | morgan                       |
| Paradigme        | Programmation fonctionnelle  |

---

## 📂 Structure des dossiers

```
project-root/
├── config/
│   └── db.js                  # Initialisation SQLite
├── controllers/              # Logique métier
│   ├── userController.js
│   ├── productController.js
│   └── cartController.js
├── models/                   # Accès aux données
│   ├── userModel.js
│   ├── productModel.js
│   └── cartModel.js
├── routes/                   # API endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── cartRoutes.js
├── middlewares/             # Middlewares JWT etc.
│   └── verifyToken.js
├── app.js                    # Configuration express
└── server.js                 # Lancement du serveur
```

---

## 🛡️ Authentification et sécurité

### ✅ Connexion

- Route : `POST /api/auth/login`
- Securité : JWT dans **cookie httpOnly** + CSRF token à renvoyer

### ✉️ Token CSRF

- Route : `GET /api/csrf-token`
- À appeler avant tout `POST`, `PUT`, `DELETE`
- Le token est à mettre dans le header `X-CSRF-Token`

### 🚪 Déconnexion

- Route : `GET /api/auth/logout`
- Supprime le cookie `token`

---

## 💪 Fonctionnalités principales

### 📅 Produits

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### 🤖 Utilisateurs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile/:id`
- `GET /api/auth/logout`

### 🛂 Panier

- `POST /api/cart` : ajouter un produit
- `GET /api/cart/:userId` : récupérer le panier d’un utilisateur
- `DELETE /api/cart/:id` : supprimer un élément du panier
- `DELETE /api/cart/user/:userId` : vider le panier

---

## 🌟 Paradigme fonctionnel respecté

- ✅ Appels chaînés via `.then()` / `.catch()`
- ✅ Middlewares et routes sans mutation
- ✅ `map`, `reduce`, `filter` utilisés dans `cartController`
- ✅ `Object.freeze()` pour figer les exports

---

## 🚫 Requêtes bloquées sans :

- Token JWT dans le cookie `token`
- Header `X-CSRF-Token` valide (pour POST, PUT, DELETE)

---

## 🌐 Lancement du projet

```bash
npm install
npm start
```

> Serveur : [http://localhost:5000](http://localhost:5000)\
> Frontend prévu : [http://localhost:3000](http://localhost:3000)

---

## 🚀 TODO / extensions possibles

- ☑️ Rôle admin / gestion avancée utilisateurs
- ☑️ Gestion des stocks
- ☑️ Ajout de coupons, commandes
- ☑️ Upload d’image pour les produits
- ☑️ Dashboard stats avec reduce/groupBy

---

Made with ❤️ and full FP 🌟