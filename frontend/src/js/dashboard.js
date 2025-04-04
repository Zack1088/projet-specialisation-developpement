const api = 'http://localhost:5000/api';
let csrfToken = '';
let user = null;

// 🔐 Récupère le token CSRF
async function fetchCSRF() {
  const res = await fetch(`${api}/csrf-token`, { credentials: 'include' });
  const data = await res.json();
  csrfToken = data.csrfToken;
}

// 🔐 Récupère l'utilisateur connecté via /me puis /profile/:id
async function fetchUser() {
  try {
    const meRes = await fetch(`${api}/auth/me`, {
      credentials: 'include',
    });
    if (!meRes.ok) throw new Error('Non connecté');

    const { id } = await meRes.json();

    const profileRes = await fetch(`${api}/auth/profile/${id}`, {
      credentials: 'include',
    });
    if (!profileRes.ok) throw new Error('Profil introuvable');

    user = await profileRes.json();
    console.log('👤 Utilisateur connecté :', user);
    return user;
  } catch (err) {
    window.location.href = '/login.html';
    return null;
  }
}

// 🧾 Met à jour l'entête
function updateHeader() {
  const welcome = document.getElementById('welcomeUser');
  const shopBtn = document.getElementById('goShopBtn');

  if (user) {
    const displayName = user.username || user.name || 'Utilisateur';
    welcome.textContent = `Bienvenue, ${displayName} 👋`;
    shopBtn?.classList.remove('hidden');
  } else {
    welcome.textContent = '';
    shopBtn?.classList.add('hidden');
  }
}

// 📦 Récupère les produits
function fetchProducts() {
  return fetch(`${api}/products`, { credentials: 'include' })
    .then(res => res.json())
    .then(renderProductList)
    .catch(err => console.error('Erreur chargement produits :', err));
}

// 🎨 Affiche les produits
function renderProductList(products) {
  const container = document.getElementById('productList');
  if (!container) return;
  container.innerHTML = '';

  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';
    div.innerHTML = `
      <h3 class="text-lg font-bold">${p.name}</h3>
      <p>${p.description}</p>
      <p class="font-semibold text-blue-600">${p.price} €</p>
      <p class="text-sm text-gray-600">${p.category}</p>
      <div class="mt-2 space-x-2">
        <button data-id="${p.id}" class="edit bg-yellow-400 text-white px-2 py-1 rounded">Modifier</button>
        <button data-id="${p.id}" class="delete bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// ✅ Formulaire de produits
const productForm = document.getElementById('productForm');
if (productForm) {
  productForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const body = {
      name: document.getElementById('name').value,
      description: document.getElementById('description').value,
      price: parseFloat(document.getElementById('price').value),
      category: document.getElementById('category').value,
      images: [],
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${api}/products/${id}` : `${api}/products`;

    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      e.target.reset();
      document.getElementById('productId').value = '';
      await fetchProducts();
    } else {
      alert('❌ Erreur lors de l\'enregistrement');
    }
  });
}

// 🎯 Modifier / Supprimer
const productList = document.getElementById('productList');
if (productList) {
  productList.addEventListener('click', async function (e) {
    const id = e.target.getAttribute('data-id');
    if (!id) return;

    if (e.target.classList.contains('edit')) {
      const res = await fetch(`${api}/products/${id}`, { credentials: 'include' });
      const p = await res.json();
      document.getElementById('productId').value = p.id;
      document.getElementById('name').value = p.name;
      document.getElementById('description').value = p.description;
      document.getElementById('price').value = p.price;
      document.getElementById('category').value = p.category;
    }

    if (e.target.classList.contains('delete') && confirm('Confirmer la suppression ?')) {
      const res = await fetch(`${api}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'X-CSRF-Token': csrfToken },
      });
      if (res.ok) {
        await fetchProducts();
      } else {
        alert('❌ Suppression échouée');
      }
    }
  });
}

// 🔓 Déconnexion
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await fetch(`${api}/auth/logout`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'X-CSRF-Token': csrfToken },
  });
  window.location.href = '/';
});

// 🚀 INIT
(async function initDashboard() {
  await fetchCSRF();
  user = await fetchUser(); // ⚠️ Redirection ici si pas connecté
  if (!user) return;

  updateHeader();
  await fetchProducts();
})();