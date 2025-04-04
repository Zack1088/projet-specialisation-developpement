require('./app').listen(process.env.PORT || 5000, () =>
    console.log(`Serveur démarré sur http://localhost:${process.env.PORT || 5000}`)
  );