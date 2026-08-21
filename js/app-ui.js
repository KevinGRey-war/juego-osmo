(function () {
  const standalonePages = new Set([
    'cuerpohumano.html',
    'dibujar.html',
    'formas.html',
    'identificacioncolores.html',
    'juegoletras.html',
    'juegonumeros2.html',
    'manos2.html',
    'zoologico.html'
  ]);

  const page = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

  if (!standalonePages.has(page) || document.querySelector('.activity-topbar, .app-back, [data-app-back]')) {
    return;
  }

  const backLink = document.createElement('a');
  backLink.className = 'app-back';
  backLink.href = 'menu-jugador.html';
  backLink.textContent = 'Menú';
  backLink.setAttribute('aria-label', 'Volver al menú de juegos');

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(backLink);
  });
}());
