
const api = 'http://localhost:5000/api';
let csrfToken = '';

function fetchCSRF() {
  return fetch(`${api}/csrf-token`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => (csrfToken = data.csrfToken));
}

function fetchProducts() {
  return fetch(`${api}/products`, { credentials: 'include' })
    .then(res => res.json())
    .then(renderProductList)
    .catch(err => console.error('Erreur chargement produits :', err));
}

function renderProductList(products) {
  const container = document.getElementById('productList');
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

document.getElementById('productForm').addEventListener('submit', function (e) {
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

  fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(() => {
      e.target.reset();
      document.getElementById('productId').value = '';
      fetchProducts();
    });
});

document.getElementById('productList').addEventListener('click', function (e) {
  if (e.target.classList.contains('edit')) {
    const id = e.target.getAttribute('data-id');
    fetch(`${api}/products/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(p => {
        document.getElementById('productId').value = p.id;
        document.getElementById('name').value = p.name;
        document.getElementById('description').value = p.description;
        document.getElementById('price').value = p.price;
        document.getElementById('category').value = p.category;
      });
  }

  if (e.target.classList.contains('delete')) {
    const id = e.target.getAttribute('data-id');
    if (confirm('Confirmer la suppression ?')) {
      fetch(`${api}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'X-CSRF-Token': csrfToken },
      })
        .then(res => res.json())
        .then(() => fetchProducts());
    }
  }
});

fetchCSRF().then(fetchProducts);
