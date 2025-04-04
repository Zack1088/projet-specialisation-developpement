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
const hsts = require('hsts');

// 📦 Routes & middlewares
const verifySession = require('./middlewares/verifySession');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const visitorCartRoutes = require('./routes/visitorCartRoutes');

const app = express();

const distPath = path.join(__dirname, '../frontend/dist');

// 🧠 Middleware : nonce CSP aléatoire à chaque requête
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

// 🛡️ CSP strict + reporting JSON
app.use((req, res, next) => {
  const nonce = res.locals.nonce;

  res.setHeader(
    'Content-Security-Policy',
    [
      `script-src 'self' 'nonce-${nonce}'`,
      `style-src 'self' 'nonce-${nonce}'`,
      `object-src 'none'`,
      `base-uri 'none'`,
      `report-uri /api/csp-reports`,
    ].join('; '),
  );

  next();
});

// 🔒 HSTS pour forcer HTTPS (en prod)
app.use(hsts({ maxAge: 15552000 }));

// 🔐 Sessions
app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    },
  }),
);

// ⚙️ Middlewares classiques
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet({ contentSecurityPolicy: false })); // CSP déjà gérée manuellement
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// 🛡️ CSRF protection
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

// 🔐 API sécurisées
app.use('/api/auth', csrfProtection, authRoutes);
app.use('/api/products', csrfProtection, productRoutes);
app.use('/api/cart/session', csrfProtection, visitorCartRoutes);
app.use('/api/cart', csrfProtection, verifySession, cartRoutes);

// 🧾 Exposition du nonce côté client (optionnel)
app.get('/api/nonce', (req, res) => {
  res.json({ nonce: res.locals.nonce });
});

// 🧠 Middleware pour injecter dynamiquement le nonce dans les HTML buildés
const serveHtmlWithNonce = (fileName) => (req, res) => {
  const nonce = res.locals.nonce;
  const filePath = path.join(distPath, fileName);

  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) return res.status(500).send('Erreur serveur');

    // 🔐 Injection du nonce dans la première balise <script type="module" ...>
    const htmlWithNonce = html.replace(
      /<script\s+type="module"([^>]*?)>/gi,
      `<script type="module"$1 nonce="${nonce}">`,
    );

    console.log(`✅ [${fileName}] Nonce injecté dynamiquement :`, nonce);
    res.send(htmlWithNonce);
  });
};

// 🗂️ Pages HTML principales 
app.get('/', serveHtmlWithNonce('index.html'));
app.get('/login.html', serveHtmlWithNonce('login.html'));
app.get('/register.html', serveHtmlWithNonce('register.html'));

// Route dashboard protégée 
app.get('/dashboard.html', verifySession, serveHtmlWithNonce('dashboard.html'));

// ✅ Fichiers statiques du build Vite 
app.use(express.static(distPath));

// 🛡️ Mémoire des rapports CSP
const cspReports = [];

// 👮 Headers précis pour les rapports CSP (prévol inclus)
const allowCSPFromVite = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
};

// 🛑 OPTIONS = réponse immédiate pour le pré-vol
app.options('/api/csp-reports', allowCSPFromVite, (req, res) => {
  res.sendStatus(204);
});

// 📊 Réception des rapports CSP
app.post(
  '/api/csp-reports',
  allowCSPFromVite,
  express.json({ type: ['application/csp-report', 'application/json'] }),
  (req, res) => {
    const report = req.body['csp-report'] || req.body;
    if (report) {
      cspReports.push({ receivedAt: new Date().toISOString(), ...report });
      console.warn('🛡️ Rapport CSP reçu :', report);
    }
    res.status(204).end();
  },
);

// 🔐 Consultation (protégée si besoin)
app.get('/api/csp-reports', (req, res) => {
  // if (!req.session.user) return res.status(401).json({ error: 'Accès réservé' });
  res.json(cspReports.slice(-100));
});

// 🔚 Gestion des erreurs globales
app.use((err, _, res, __) => {
  console.error('❌ Erreur backend :', err);
  res.status(err.status || 500).json({
    error: err.code === 'EBADCSRFTOKEN' ? 'Token CSRF invalide' : err.message,
  });
});

module.exports = app;
