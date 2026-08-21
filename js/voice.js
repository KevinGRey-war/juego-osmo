(function () {
  'use strict';

  const synthesis = window.speechSynthesis;
  const MALE_HINTS = [
    'male', 'hombre', 'masculino', 'jorge', 'pablo', 'raul', 'raúl',
    'carlos', 'diego', 'miguel', 'enrique', 'antonio', 'alberto',
    'luis', 'juan'
  ];
  const FEMALE_HINTS = [
    'female', 'mujer', 'femenino', 'sabina', 'helena', 'laura',
    'monica', 'mónica', 'dalia', 'paulina'
  ];

  let cachedVoice = null;
  let speechRequest = 0;

  function normalize(value) {
    return String(value || '').toLocaleLowerCase('es');
  }

  function scoreVoice(voice) {
    const name = normalize(voice.name);
    const lang = normalize(voice.lang);
    let score = 0;

    if (lang === 'es-es') score += 80;
    else if (lang.startsWith('es-')) score += 65;
    else if (lang === 'es') score += 55;
    else if (lang.startsWith('es')) score += 45;

    if (MALE_HINTS.some(hint => name.includes(hint))) score += 35;
    if (FEMALE_HINTS.some(hint => name.includes(hint))) score -= 30;
    if (voice.localService) score += 12;
    if (voice.default) score += 4;

    return score;
  }

  function chooseVoice(voices) {
    if (!Array.isArray(voices) || voices.length === 0) return null;

    return voices
      .map((voice, index) => ({ voice, index, score: scoreVoice(voice) }))
      .sort((a, b) => b.score - a.score || a.index - b.index)[0].voice;
  }

  function loadVoices(timeout = 800) {
    if (!synthesis) return Promise.resolve([]);

    const available = synthesis.getVoices();
    if (available.length) return Promise.resolve(available);

    return new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        synthesis.removeEventListener?.('voiceschanged', finish);
        resolve(synthesis.getVoices());
      };

      synthesis.addEventListener?.('voiceschanged', finish, { once: true });
      window.setTimeout(finish, timeout);
    });
  }

  async function getVoice() {
    if (cachedVoice) return cachedVoice;
    cachedVoice = chooseVoice(await loadVoices());
    return cachedVoice;
  }

  async function speak(text, options = {}) {
    if (!synthesis || !window.SpeechSynthesisUtterance || !text) return false;

    try {
      const requestId = ++speechRequest;
      if (options.cancel !== false) synthesis.cancel();
      const voice = await getVoice();
      if (options.cancel !== false && requestId !== speechRequest) return false;
      const utterance = new SpeechSynthesisUtterance(String(text));
      utterance.lang = voice?.lang || options.lang || 'es-ES';
      utterance.rate = options.rate ?? 0.9;
      utterance.pitch = options.pitch ?? 1;
      if (voice) utterance.voice = voice;
      synthesis.speak(utterance);
      return true;
    } catch (error) {
      console.warn('No fue posible reproducir la voz local.', error);
      return false;
    }
  }

  async function getSelection() {
    const voice = await getVoice();
    return voice ? { name: voice.name, lang: voice.lang, localService: voice.localService } : null;
  }

  if (synthesis) {
    synthesis.addEventListener?.('voiceschanged', () => {
      cachedVoice = chooseVoice(synthesis.getVoices());
    });
  }

  window.OsmoVoice = { speak, getSelection, scoreVoice };
}());
