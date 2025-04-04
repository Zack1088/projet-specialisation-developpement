const api = 'http://localhost:5000/api';
let csrfToken = '';
let user = null;

// 🔐 Récupère le token CSRF
function fetchCSRF() {
  return fetch(`${api}/csrf-token`, { credentials: 'include' })
    .then((res) => res.json())
    .then((data) => (csrfToken = data.csrfToken));
}

// 👤 Récupère la session utilisateur via /me puis /profile/:id
async function fetchUserSession() {
  try {
    const meRes = await fetch(`${api}/auth/me`, {
      credentials: 'include',
    });

    if (meRes.status === 401) {
      // Visiteur non connecté = pas une erreur bloquante
      user = null;
      updateNav();
      return;
    }

    if (!meRes.ok) throw new Error('Erreur lors de /me');

    const { id } = await meRes.json();

    const profileRes = await fetch(`${api}/auth/profile/${id}`, {
      credentials: 'include',
    });

    if (!profileRes.ok) throw new Error('Erreur lors de /profile');

    user = await profileRes.json();
  } catch (err) {
    user = null;

    if (!['Erreur lors de /me', 'Erreur lors de /profile'].includes(err.message)) {
      // silence les 401 (visiteur), affiche les vraies erreurs
      console.warn('[fetchUserSession] ❌', err.message);
    }
  }

  updateNav();
}
// 🔄 Met à jour la navigation selon connexion
function updateNav() {
  const navLinks = document.getElementById('navLinks');
  const navUser = document.getElementById('navUser');
  const navUsername = document.getElementById('navUsername');

  if (user) {
    navLinks?.classList.add('hidden');
    navUser?.classList.remove('hidden');
    navUsername.textContent = `Bonjour ${user.username ?? user.name ?? 'Utilisateur'}`;
  } else {
    navLinks?.classList.remove('hidden');
    navUser?.classList.add('hidden');
    navUsername.textContent = '';
  }
}

// 🚪 Déconnexion
function setupLogout() {
  const btn = document.getElementById('logoutBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      fetch(`${api}/auth/logout`, { credentials: 'include' })
        .then(() => {
          user = null;
          updateNav();
          fetchCart(); // recharge panier visiteur
        });
    });
  }
}

// 📦 Récupère les produits
function fetchProducts() {
  return fetch(`${api}/products`, { credentials: 'include' })
    .then((res) => {
      if (!res.ok) throw new Error('Non autorisé');
      return res.json();
    })
    .then(renderProducts)
    .catch((err) => {
      console.error('Erreur produits :', err);
      alert('Connexion requise pour voir les produits.');
    });
}

// 💬 Affiche les produits avec bouton
function renderProducts(products) {
  const searchInput = document.getElementById('search');
  const container = document.getElementById('products');

  function display(filtered) {
    container.innerHTML = '';
    filtered.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'product bg-white p-4 rounded shadow';
      card.innerHTML = `
        <h3 class="font-bold text-lg">${p.name}</h3>
        <p class="text-sm text-gray-600">${p.description}</p>
        <p class="text-blue-600 font-semibold mt-2">${p.price} €</p>
        <button class="bg-blue-600 text-white px-3 py-1 mt-3 rounded hover:bg-blue-700 transition" data-id="${p.id}">
          Ajouter
        </button>
      `;
      container.appendChild(card);
    });
  }

  display(products);

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    display(products.filter((p) => p.name.toLowerCase().includes(q)));
  });

  container.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const id = parseInt(e.target.getAttribute('data-id'), 10);
      addToCart(id);
    }
  });
}

// ➕ Ajoute au panier
function addToCart(productId) {
  const isConnected = !!user;
  const route = isConnected ? '/cart' : '/cart/session';

  return fetch(`${api}${route}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify({
      ...(isConnected && { user_id: user.id }),
      product_id: productId,
      quantity: 1
    })
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erreur lors de l’ajout au panier");
      return res.json();
    })
    .then(() => fetchCart())
    .catch((err) => {
      console.error('Ajout panier échoué :', err);
      alert("Impossible d'ajouter au panier.");
    });
}

// 🧾 Affiche le panier
function fetchCart() {
  const route = user ? `/cart/${user.id}` : '/cart/session';

  return fetch(`${api}${route}`, { credentials: 'include' })
    .then((res) => {
      if (!res.ok) throw new Error('Erreur panier');
      return res.json();
    })
    .then(({ items, total }) => {
      const ul = document.getElementById('cart');
      ul.innerHTML = '';
      items.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${item.name} x ${item.quantity} - ${item.price} €
          <button class="ml-2 text-red-600 hover:underline text-sm" data-id="${item.product_id}">Supprimer</button>
        `;
        ul.appendChild(li);
      });

      // 🎯 Supprimer un produit au clic sur "Supprimer"
      ul.querySelectorAll('button[data-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          removeFromCart(id);
        });
      });

      document.getElementById('total').textContent = total.toFixed(2);
    })
    .catch((err) => {
      console.error('Erreur panier :', err);
    });
}

// ❌ Supprime un produit du panier
function removeFromCart(productId) {
  const route = user ? `/cart/${user.id}/${productId}` : `/cart/session/${productId}`;

  return fetch(`${api}${route}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': csrfToken
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error('Suppression échouée');
      return fetchCart();
    })
    .catch((err) => {
      console.error('Erreur suppression :', err);
    });
}

// 🟢 Init page
fetchCSRF()
  .then(fetchUserSession)
  .then(() => {
    fetchProducts();
    fetchCart();
    setupLogout();
  });
