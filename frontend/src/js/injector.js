// src/js/injector.js pour tester le nonce CSP et la violation CSP sur l'index.html 
const nonce = document
  .querySelector('meta[name="csp-nonce"]')
  ?.getAttribute('content');

if (nonce) {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = '/src/js/main.js';
  script.setAttribute('nonce', nonce);
  document.body.appendChild(script);
} else {
  console.warn('❌ Nonce introuvable');
}
const test = document.createElement('script');
test.textContent = `alert("Violation CSP test")`; 
document.body.appendChild(test);