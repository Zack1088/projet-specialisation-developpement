# 📄 Projet Spécialisation Développement - API + Frontend Vite

## 🚀 Objectif
Une application fullstack avec :
- Backend Express/SQLite3 (port 5000)
- Frontend Vite + HTML/CSS/JS (port 3000)
- Programmation fonctionnelle 
- Sécurité via JWT + CSRF + CORS

---

## 🌐 Aperçu des technologies
| Côté        | Stack principale                       |
|------------|-----------------------------------------|
| Backend    | Node.js, Express, SQLite3               |
| Frontend   | Vite (template vanilla), Tailwind CSS   |
| Auth       | JWT, bcryptjs                           |
| Sécurité   | Helmet, CORS, CSRF                      |

---

## 🛠️ Installation du projet

### ✅ 1. Cloner le projet
```bash
git clone https://github.com/Zack1088/projet-specialisation-developpement.git
cd projet-specialisation-developpement
```

### ✅ 2. Installer les dépendances backend (racine)
```bash
npm install
```

### ✅ 3. Installer les dépendances frontend (Vite)
```bash
cd frontend
npm install
cd ..
```

---

## ▶️ Lancement du projet
```bash
npm run dev
```
Cela lance en parallèle :
- 🎮 Vite (frontend) sur [http://localhost:3000](http://localhost:3000)
- 💡 API backend sur [http://localhost:5000](http://localhost:5000)

---

## 🌐 Architecture des dossiers
```
projet-specialisation-developpement/
├── backend/              # Code serveur Node.js + Express
├── frontend/             # Frontend Vite (JS/HTML/CSS)
│   ├── index.html
│   ├── js/
│   └── css/
├── package.json          # Gestion globale (scripts backend + dev)
└── README.md             # Document explicatif
```

---

## 🎨 Frontend (Vite)
- Chargement des produits
- Ajout au panier
- Authentification (connexion/inscription)
- Dashboard utilisateur (appliqué via JWT)

### Scripts disponibles dans `/frontend` :
```bash
npm run dev       # démarrage du serveur Vite
npm run build     # build production
npm run preview   # prévisualisation build
```

---

## 🔒 Backend (Express)
- JWT auth
- CSRF protection (via cookie + header)
- SQLite3 persistante
- Routes REST : `/api/products`, `/api/cart`, `/api/auth`, etc.

---

## 🚫 Important :
- Le frontend fonctionne uniquement si le **token JWT** est présent (cookie ou localStorage)
- Toute requête `POST/PUT/DELETE` doit être accompagnée d'un token CSRF (via `/api/csrf-token`)

---

## 🚀 Pour aller plus loin
- Ajouter un dashboard admin (role-based access)
- Ajouter des tests avec Jest ou Vitest
- Ajouter un panneau de statistiques
- Passer le backend en architecture REST + validation JOI
- Déploiement : Vercel (front) + Render / Railway (API)

---

**Made with ❤️ + Vite + FP mindset**
