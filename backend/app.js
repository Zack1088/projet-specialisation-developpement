const express = require('express');
const session = require('express-session');
const csrf = require('csurf');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const verifySession = require('./middlewares/verifySession');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const visitorCartRoutes = require('./routes/visitorCartRoutes');

const app = express();

// 🧠 Middleware : nonce aléatoire à chaque requête
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

// 🛡️ CSP : politique stricte + reporting
app.use((req, res, next) => {
  const nonce = res.locals.nonce;
  res.setHeader('Content-Security-Policy', [
    `script-src 'strict-dynamic' 'nonce-${nonce}' https: http:`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `require-trusted-types-for 'script'`,
    `report-uri /api/csp-reports`
  ].join('; '));
  next();
});

// 🔐 Session utilisateur
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // 👉 à passer à `true` en HTTPS prod
    sameSite: 'lax',
  },
}));

// 🌐 Middleware classiques
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet({ contentSecurityPolicy: false })); // Désactive CSP interne d'Helmet
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// 🛡️ CSRF
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  },
});
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 📦 Routes API
app.use('/api/auth', csrfProtection, authRoutes);
app.use('/api/products', csrfProtection, productRoutes);
app.use('/api/cart/session', csrfProtection, visitorCartRoutes);
app.use('/api/cart', csrfProtection, verifySession, cartRoutes);

// 🏠 Page d'accueil de l'API
app.get('/', (_, res) => res.json({ message: 'Bienvenue sur l’API' }));

// 📊 Reporting CSP (collecte)
const cspReports = [];
app.post('/api/csp-reports', express.json({ type: ['json', 'application/csp-report'] }), (req, res) => {
  if (req.body['csp-report']) {
    cspReports.push({
      time: new Date().toISOString(),
      ...req.body['csp-report'],
    });
    console.warn('🛡️ Rapport CSP reçu :', req.body['csp-report']);
  }
  res.status(204).end();
});

// 🔒 Accès au reporting CSP (restreint aux utilisateurs connectés)
app.get('/api/csp-reports', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Accès réservé' });
  res.json(cspReports.slice(-50));
});

// 📜 Fourniture du fichier security.txt
app.get('/.well-known/security.txt', (_, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(
`Contact: mailto:security@votresite.com
Expires: ${new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString()}
Policy: https://votresite.com/securite
Encryption: https://votresite.com/pgp.txt
Acknowledgements: https://votresite.com/hall-of-fame
Preferred-Languages: fr, en`
  );
});
// ❌ Erreurs globales
app.use((err, _, res, __) => {
  console.error('Erreur backend :', err);
  res.status(err.status || 500).json({
    error: err.code === 'EBADCSRFTOKEN'
      ? 'Token CSRF invalide'
      : err.message,
  });
});

module.exports = app;
