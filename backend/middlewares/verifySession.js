module.exports = (req, res, next) => {
  // ✅ Autorise toutes les routes commençant par /api/cart/session (visiteur)
  if (req.originalUrl.startsWith('/api/cart/session')) return next();

  console.log('✅ verifySession exécuté sur:', req.originalUrl);

  if (!req.session || !req.session.user) {
    console.log('❌ PAS DE SESSION pour :', req.originalUrl);
    return res.status(401).json({ error: 'Non autorisé, session requise' });
  }

  next();
};