// Dès que le DOM est entièrement chargé, on attache le submit listener
document.addEventListener('DOMContentLoaded', function () {
    const form = getElement('loginForm');
    if (form) form.addEventListener('submit', handleSubmit);
  });
  
  // Raccourci utilitaire pour récupérer un élément par son id
  function getElement(id) {
    return document.getElementById(id);
  }
  
  // Masque les messages d’erreur s’ils sont visibles
  function hideErrors() {
    getElement('emailError')?.classList.add('hidden');
    getElement('passwordError')?.classList.add('hidden');
  }
  
  // Affiche un message d’erreur pour un champ donné
  function showError(id, message) {
    const el = getElement(id);
    if (el) {
      el.textContent = message;
      el.classList.remove('hidden');
    }
  }
  
  // Effectue un appel fetch JSON avec gestion d'erreur centralisée
  function fetchJson(url, options) {
    return fetch(url, options).then(function (res) {
      return res.json().then(function (data) {
        return res.ok
          ? data
          : Promise.reject(new Error(data.error || 'Erreur inconnue'));
      });
    });
  }
  
  // Récupère un token CSRF auprès du backend
  function fetchCsrfToken() {
    return fetchJson('http://localhost:5000/api/csrf-token', {
      credentials: 'include', // nécessaire pour les cookies de session
    }).then(function (data) {
      return data.csrfToken;
    });
  }
  
  // Envoie les identifiants de connexion au backend avec le token CSRF
  function submitLogin(body, token) {
    return fetchJson('http://localhost:5000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': token,
      },
      body: JSON.stringify(body),
    });
  }
  
  // Gère la soumission du formulaire de login
  function handleSubmit(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    hideErrors(); // Cache les erreurs précédentes
  
    // On récupère les valeurs saisies dans les champs
    const email = getElement('email')?.value.trim();
    const password = getElement('password')?.value.trim();
  
    // Validation simple des champs
    if (!email) return showError('emailError', 'Veuillez entrer votre email');
    if (!password) return showError('passwordError', 'Veuillez entrer votre mot de passe');
  
    // Récupération du token CSRF et tentative de connexion
    fetchCsrfToken()
      .then(function (token) {
        return submitLogin({ email: email, password: password }, token);
      })
      .then(function (data) {
        console.log('✅ Connexion réussie :', data);
        alert('Connexion réussie !');
        window.location.href = '/dashboard.html'; // Redirection post-login
      })
      .catch(function (err) {
        console.error('Erreur de login :', err);
        alert(err.message);
      });
  }
  