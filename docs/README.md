
# 🛒 Ma Boutique – Documentation Développeur

Dernière mise à jour : 2025-04-04

## 🔧 Stack utilisée

- **Frontend** : HTML + TailwindCSS + JS (modulaire ES6)
- **Bundler** : Vite (dev + build)
- **Backend** : Node.js + Express
- **Base de données** : SQLite (test)
- **Session / Auth** : express-session + cookie
- **Sécurité** :
  - CSP (Content Security Policy) strict avec `nonce`
  - CSRF protection avec `csurf`
  - HSTS, Helmet
- **Gestion des erreurs CSP** : reporting JSON (`/api/csp-reports`)
- **Middleware** de session global : `verifySession`
- **UnitsTest** : Framework JEST et SUPERTEST

---

## 📁 Structure du projet

```
.
├── backend/
│   ├── app.js                 # App Express principale
│   ├── routes/                # Routes API (auth, cart, etc.)
│   ├── middlewares/           # CSP, sessions, etc.
│   ├── controllers/           # Logique métier
|   ├── tests/                 # Tests unitaires
|   ├── server.js              # Initialisation du serveur
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── index.html          # Page publique
│   │   ├── login.html          # Connexion
│   │   ├── register.html       # Inscription
│   │   ├── dashboard.html      # Interface admin
│   │   └── js/
│   │       ├── main.js         # Logique de la boutique (visiteur / user)
│   │       ├── dashboard.js    # Interface d'administration
│   │       └── injector.js     # Dev uniquement : injection CSP
│   └── dist/                   # Fichiers générés par Vite
├── vite.config.js              # Config vite avec plugin nonce
├── vite-plugin-csp-nonce.js    # Plugin personnalisé CSP pour dev
└── README.md                   # Ce fichier ✨
```

---

## 🚀 Lancement en dev

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

⚠️ Assure-toi que le serveur Express tourne sur `http://localhost:5000` et Vite sur `http://localhost:3000`.


---

## 🏗️ Build de production

```bash
cd frontend
npm run build
```

Cela génère un dossier `dist/` contenant tous les fichiers nécessaires, injectés avec `nonce` via `app.js` dans Express.
Le projet prod sera accéssible sur: `http://localhost:5000`

---

## ✨ Fonctionnalités

- 🔐 Authentification utilisateur
- 📦 Gestion des produits (catalogue)
- 🛒 Panier :
  - Visiteur : session côté serveur
  - Utilisateur connecté : panier en base de données
- 🧾 Affichage dynamique des produits
- 🧹 Suppression d’articles du panier (DOM + base/session)
- 📊 Route de statistiques : `/api/stats`
- 🛡️ Rapport CSP JSON disponible : `/api/csp-reports` (accessible uniquement si activé)

---

## 🔧 Configuration Vite

Vite buildera automatiquement les fichiers `index.html`, `login.html`, `register.html`, `dashboard.html` dans `/dist`. Les scripts générés sont injectés avec le `nonce` via Express.

Exemple dans `index.html` :
```html
<script type="module" src="/assets/main.js" nonce="{{nonce}}"></script>
```

---

## 🔐 Sécurité & Middleware

- Middleware `verifySession` bloque les accès aux routes sensibles
- Route `/dashboard.html` protégée côté serveur Express
- Les routes API `/api/cart` et `/api/auth/profile/:id` exigent une session valide
- Fallback sécurisé pour visiteurs (retour 401)

---

## 👤 Authentification

- `/api/auth/login` : connexion (via email / mdp)
- `/api/auth/me` : renvoie l'objet `<built-in function id>` si connecté (sinon 401)
- `/api/auth/profile/:id` : renvoie l'utilisateur complet (protégé)
- `logout` supprime la session

---

## 🧠 Politique CSP

Injectée dynamiquement dans `app.js` Express avec un `nonce` généré par requête.

```http
Content-Security-Policy: script-src 'self' 'nonce-abc123'; style-src 'self' 'nonce-abc123'; object-src 'none'; base-uri 'none'; report-uri /api/csp-reports;
```

---

## 🔍 Suivi des erreurs CSP

- Requêtes envoyées à `/api/csp-reports`
- Format JSON (type `application/csp-report`)
- Affichées dans le backend (console)
- Les rapports son consultable via `http://localhost:5000//api/csp-report`
---

## 🧪 Tests conseillés

- ✅ Accès dashboard uniquement si connecté
- ✅ Panier dynamique selon session / visiteur
- ✅ Connexion / déconnexion persistante via cookies
- ✅ Build injecte correctement le `nonce` dans les JS
- ✅ Aucun `<script>` inline bloqué par la CSP

---

## 🧼 À venir (TODO)

- Gestion des images produit
- Pagination des produits
- Page profil utilisateur
- Intégration Stripe (paiement)

---

## 🙌 Auteur

Développé avec ❤️ par Bastien et Zack. Pour toute question, suggestion ou bug : ouvre une issue ou contacte-nous.

---

## 🙏 Remerciements

Merci aux packages :
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [SQLite3](https://www.sqlite.org/)
- [Helmet](https://helmetjs.github.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- Et toi, cher·e lecteur·rice ❤️

---

## 📄 License

MIT - libre d'utilisation pour tout projet personnel ou pédagogique.

**Happy coding !**
