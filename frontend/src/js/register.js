// Attendre que le DOM soit prêt et connecter le gestionnaire de formulaire
document.addEventListener('DOMContentLoaded', function () {
    getForm()?.addEventListener('submit', handleSubmit);
  });
  
  // Raccourci pour getElementById
  function query(id) {
    return document.getElementById(id);
  }
  
  // Raccourci pour récupérer le formulaire
  function getForm() {
    return query('registerForm');
  }
  
  // Masquer tous les messages d’erreur
  function hideErrors() {
    ['usernameError', 'emailError', 'passwordError', 'confirmError']
      .map(query)
      .filter(Boolean)
      .forEach(function (el) {
        el.classList.add('hidden');
      });
  }
  
  // Afficher un message d’erreur sous un champ
  function showError(id, message) {
    const el = query(id);
    if (el) {
      el.textContent = message;
      el.classList.remove('hidden');
    }
  }
  
  // Extraire les valeurs du formulaire sous forme d'objet
  function getValues() {
    return {
      username: query('username')?.value.trim(),
      email: query('email')?.value.trim(),
      password: query('password')?.value.trim(),
      confirm: query('confirmPassword')?.value.trim(),
    };
  }
  
  // Vérifie les champs du formulaire et retourne une liste d'erreurs
  function validate(values) {
    return [
      !values.username && ['usernameError', 'Nom requis'],
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) && ['emailError', 'Email invalide'],
      !values.password && ['passwordError', 'Mot de passe requis'],
      values.password !== values.confirm && ['confirmError', 'Les mots de passe ne correspondent pas'],
    ].filter(Boolean);
  }
  
  // Appelle fetch avec gestion automatique des erreurs
  function fetchJson(url, options) {
    return fetch(url, options).then(function (res) {
      return res.json().then(function (data) {
        return res.ok
          ? data
          : Promise.reject(new Error(data.error || 'Erreur'));
      });
    });
  }
  
  // Récupère le token CSRF depuis l’API
  function getCsrfToken() {
    return fetchJson('http://localhost:5000/api/csrf-token', {
      credentials: 'include',
    }).then(function (data) {
      return data.csrfToken;
    });
  }
  
  // Envoie les données d'inscription avec le token CSRF
  function registerUser(body, csrfToken) {
    return fetchJson('http://localhost:5000/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      body: JSON.stringify(body),
    });
  }
  
  // Gère la soumission du formulaire
  function handleSubmit(e) {
    e.preventDefault();
    hideErrors();
  
    const values = getValues();
    const errors = validate(values);
  
    if (errors.length > 0) {
      errors.forEach(function ([id, msg]) {
        showError(id, msg);
      });
      return;
    }
  
    getCsrfToken()
      .then(function (token) {
        return registerUser(
          {
            username: values.username,
            email: values.email,
            password: values.password,
          },
          token
        );
      })
      .then(function () {
        alert('Inscription réussie !');
        e.target.reset();
        window.location.href = '/login.html';
      })
      .catch(function (err) {
        alert(err.message);
        console.error(err);
      });
  }
  