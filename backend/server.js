const app = require('./app');

const PORT = 80;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur http://${HOST}:${PORT}`);
});
