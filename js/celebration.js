(function () {
  'use strict';

  if (window.location.protocol === 'file:') {
    const fileName = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
    window.location.replace(`http://localhost:8081/${encodeURI(fileName)}${window.location.search}${window.location.hash}`);
    return;
  }

  const TITLES = [
    '¡Felicidades!',
    '¡Reto superado!',
    '¡Trabajo increíble!',
    '¡Lo lograste!'
  ];
  const MESSAGES = [
    'Completaste la actividad con mucha atención y constancia.',
    'Cada acierto muestra todo lo que aprendiste durante este reto.',
    'Terminaste el desafío. Tu esfuerzo merece una gran celebración.',
    'Aprendiste jugando y llegaste hasta el final. ¡Excelente trabajo!'
  ];
  const BALLOON_COLORS = ['#ef654b', '#f7c844', '#168b98', '#7b55c7', '#2d8a52', '#ef4d8b', '#f08a24'];
  let celebrationRoot = null;
  let previousFocus = null;
  let continueAction = null;
  let pausedMedia = [];

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function pausePageMedia() {
    pausedMedia = Array.from(document.querySelectorAll('video, audio')).filter(media => !media.paused);
    pausedMedia.forEach(media => media.pause());
  }

  function resumePageMedia() {
    const mediaToResume = pausedMedia;
    pausedMedia = [];
    mediaToResume.forEach(media => media.play().catch(() => {}));
  }

  function close(runContinueAction = false) {
    if (!celebrationRoot) return;
    const action = continueAction;
    celebrationRoot.remove();
    celebrationRoot = null;
    continueAction = null;
    resumePageMedia();
    previousFocus?.focus?.();
    if (runContinueAction && action) action();
  }

  function createBalloons(container) {
    for (let index = 0; index < 20; index += 1) {
      const balloon = document.createElement('span');
      balloon.className = 'app-celebration__balloon';
      balloon.style.setProperty('--balloon-color', BALLOON_COLORS[index % BALLOON_COLORS.length]);
      balloon.style.setProperty('--balloon-left', `${2 + Math.random() * 94}%`);
      balloon.style.setProperty('--balloon-size', `${42 + Math.random() * 34}px`);
      balloon.style.setProperty('--balloon-delay', `${-Math.random() * 6}s`);
      balloon.style.setProperty('--balloon-duration', `${6.2 + Math.random() * 3}s`);
      container.appendChild(balloon);
    }
  }

  function speak(message) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1.08;
    window.speechSynthesis.speak(utterance);
  }

  function show(options = {}) {
    close(false);
    previousFocus = document.activeElement;
    continueAction = typeof options.onContinue === 'function' ? options.onContinue : null;
    pausePageMedia();
    const title = options.title || pick(TITLES);
    const message = options.message || pick(MESSAGES);
    const activity = options.activity || 'Actividad completada';
    const root = document.createElement('section');
    root.className = 'app-celebration';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'appCelebrationTitle');
    root.innerHTML = `
      <div class="app-celebration__balloons" aria-hidden="true"></div>
      <div class="app-celebration__panel">
        <button class="app-celebration__close" type="button" aria-label="Cerrar felicitación">×</button>
        <div class="app-celebration__icon" aria-hidden="true">${options.icon || '✓'}</div>
        <p class="app-celebration__eyebrow">${activity}</p>
        <h2 class="app-celebration__title" id="appCelebrationTitle">${title}</h2>
        <p class="app-celebration__message">${message}</p>
        <div class="app-celebration__actions">
          <button class="app-celebration__button app-celebration__button--primary" type="button" data-celebration-close>${options.continueLabel || 'Continuar'}</button>
          <a class="app-celebration__button" href="menu-jugador.html">Volver al menú</a>
        </div>
      </div>`;
    celebrationRoot = root;
    createBalloons(root.querySelector('.app-celebration__balloons'));
    root.querySelector('.app-celebration__close').addEventListener('click', () => close(true));
    root.querySelector('[data-celebration-close]').addEventListener('click', () => close(true));
    root.addEventListener('click', event => {
      if (event.target === root) close(true);
    });
    root.addEventListener('keydown', event => {
      if (event.key === 'Escape') close(true);
    });
    document.body.appendChild(root);
    root.querySelector('[data-celebration-close]').focus();
    if (options.speak !== false) speak(`${title} ${message}`);
  }

  window.AppCelebration = { show, close };
}());
