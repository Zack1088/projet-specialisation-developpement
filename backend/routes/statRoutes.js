const router = require('express').Router();

// 🔓 Accessible sans authentification
router.get('/', (req, res) => {
  res.json({
    message: 'Statistiques accessibles publiquement',
    visiteurs: 1245,
    produitsConsultés: 3421,
    produitsAjoutésAuPanier: 892,
    date: new Date().toISOString(),
  });
});

module.exports = router;
