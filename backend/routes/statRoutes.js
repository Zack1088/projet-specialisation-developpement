const path = require('path');
const router = require('express').Router();

// 🔓 Accessible sans authentification
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/stats.html'));
});

// 🔓 Statistiques publiques (fictives)
// router.get('/', (req, res) => {
//   const stats = {
//     message: 'Statistiques accessibles publiquement',
//     visiteurs: getRandomInt(1000, 3000),
//     produitsConsultés: getRandomInt(3000, 6000),
//     produitsAjoutésAuPanier: getRandomInt(500, 1500),
//     date: new Date().toISOString()
//   };

//   res.json(stats);
// });

// // 🔁 Générateur de valeurs aléatoires
// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

module.exports = router;