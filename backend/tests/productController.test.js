const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

let csrfToken;
let csrfCookie;

beforeAll(async () => {
  // 🔐 Récupération du token CSRF + cookie session
  const res = await request(app).get('/api/csrf-token');
  csrfToken = res.body.csrfToken;
  csrfCookie = res.headers['set-cookie'];
});

describe('🧪 CRUD Produit', () => {
  let createdProductId;

  test('✅ POST /api/products - Créer un produit', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', csrfCookie)
      .set('X-CSRF-Token', csrfToken)
      .send({
        name: 'Produit Test',
        description: 'Description test',
        price: 19.99,
        category: 'test',
        images: [],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Produit Test');
    createdProductId = res.body.id;
  });

  test('✅ GET /api/products - Liste des produits', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('✅ GET /api/products/:id - Récupérer produit', async () => {
    const res = await request(app).get(`/api/products/${createdProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Produit Test');
  });

  test('✅ PUT /api/products/:id - Modifier le produit', async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set('Cookie', csrfCookie)
      .set('X-CSRF-Token', csrfToken)
      .send({
        name: 'Produit Modifié',
        description: 'Description modifiée',
        price: 29.99,
        category: 'modifié',
        images: [],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Produit Modifié');
  });

  test('✅ DELETE /api/products/:id - Supprimer le produit', async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Cookie', csrfCookie)
      .set('X-CSRF-Token', csrfToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Produit supprimé');
  });
});

// 🔚 Ferme proprement la base SQLite après tous les tests
afterAll((done) => {
  db.closeConnection(done); // passe done pour éviter les erreurs asynchrones
});
