const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

let csrfToken;
let csrfCookie;

// 🧪 Données utilisateur test
const testUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'test1234'
};

// 🔐 Récupère un token CSRF avant les tests
beforeAll(async () => {
  const res = await request(app).get('/api/csrf-token');
  csrfToken = res.body.csrfToken;
  csrfCookie = res.headers['set-cookie'];
});

describe('🧪 Authentification', () => {
  test('POST /api/auth/register - inscription', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Cookie', csrfCookie)
      .set('X-CSRF-Token', csrfToken)
      .send(testUser);

    // ✅ Accepte une inscription ou un doublon (en test répété)
    expect([201, 400]).toContain(res.statusCode);

    if (res.statusCode === 201) {
      expect(res.body).toHaveProperty('message', 'Utilisateur créé');
    }
    if (res.statusCode === 400) {
      expect(res.body).toHaveProperty('error', 'Utilisateur existe déjà');
    }
  });

  test('POST /api/auth/login - connexion', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Cookie', csrfCookie)
      .set('X-CSRF-Token', csrfToken)
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Connexion réussie');

    // 🔄 Met à jour le cookie de session
    csrfCookie = res.headers['set-cookie'];
  });

  test('GET /api/auth/me - session active', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', csrfCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', testUser.email);
  });

  test('GET /api/auth/logout - déconnexion', async () => {
    const res = await request(app)
      .get('/api/auth/logout')
      .set('Cookie', csrfCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Déconnexion réussie');
  });

  test('GET /api/auth/me - session expirée après logout', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', csrfCookie);

    expect(res.statusCode).toBe(401);
  });
});

// ✅ Fermeture propre de la DB après les tests
afterAll((done) => {
  db.closeConnection(done);
});
