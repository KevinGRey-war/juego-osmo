(function () {
  'use strict';

  const COLORS = [
    { name: 'rojo', hex: '#E53935' },
    { name: 'naranja', hex: '#FB8C00' },
    { name: 'amarillo', hex: '#FDD835' },
    { name: 'verde', hex: '#43A047' },
    { name: 'turquesa', hex: '#00ACC1' },
    { name: 'azul', hex: '#1E88E5' },
    { name: 'morado', hex: '#8E24AA' },
    { name: 'rosa', hex: '#EC407A' },
    { name: 'marrón', hex: '#795548' },
    { name: 'negro', hex: '#212121' },
    { name: 'gris', hex: '#757575' },
    { name: 'blanco', hex: '#F5F5F5' }
  ];

  const SEQUENCE_LENGTH = 10;
  const CORRECT_POINTS = 10;
  const COMPLETION_BONUS = 20;
  const ERROR_PENALTY = 2;
  const REQUIRED_STABLE_READS = 3;

  const video = document.getElementById('video');
  const canvas = document.getElementById('colorCanvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const cameraBtn = document.getElementById('cameraBtn');
  const voiceBtn = document.getElementById('voiceBtn');
  const newGameBtn = document.getElementById('newGameBtn');
  const repeatPromptBtn = document.getElementById('repeatPromptBtn');
  const cameraStatus = document.getElementById('cameraStatus');
  const cameraPlaceholder = document.getElementById('cameraPlaceholder');
  const feedback = document.getElementById('feedback');
  const detectedSwatch = document.getElementById('detectedSwatch');
  const detectedName = document.getElementById('detectedName');
  const detectedRgb = document.getElementById('detectedRgb');
  const targetSwatch = document.getElementById('targetSwatch');
  const targetTitle = document.getElementById('targetTitle');
  const targetPrompt = document.getElementById('targetPrompt');
  const sequenceList = document.getElementById('sequenceList');
  const sequencePosition = document.getElementById('sequencePosition');
  const sequenceProgressFill = document.getElementById('sequenceProgressFill');
  const miniPalette = document.getElementById('miniPalette');
  const scoreDisplay = document.getElementById('score');
  const correctDisplay = document.getElementById('correctCount');
  const incorrectDisplay = document.getElementById('incorrectCount');
  const completedDisplay = document.getElementById('completedCount');
  const accuracyDisplay = document.getElementById('accuracy');
  const sensitivity = document.getElementById('sensitivity');
  const sensitivityValue = document.getElementById('sensitivityValue');

  let stream = null;
  let detectionTimer = null;
  let audioEnabled = true;
  let gameActive = false;
  let sequence = [];
  let sequenceIndex = 0;
  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let completedCount = 0;
  let stableColorName = null;
  let stableReads = 0;
  let lastEvaluatedColor = null;
  let sequenceTransitionTimer = null;

  function colorByName(name) {
    return COLORS.find(color => color.name === name);
  }

  function renderMiniPalette() {
    miniPalette.innerHTML = '';
    COLORS.forEach(color => {
      const item = document.createElement('div');
      item.className = 'mini-color';
      item.title = color.name;
      item.innerHTML = `<span style="background:${color.hex}"></span><small>${color.name}</small>`;
      miniPalette.appendChild(item);
    });
  }

  function generateSequence() {
    const shuffledColors = [...COLORS];
    for (let index = shuffledColors.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledColors[index], shuffledColors[randomIndex]] = [shuffledColors[randomIndex], shuffledColors[index]];
    }
    return shuffledColors.slice(0, SEQUENCE_LENGTH);
  }

  function renderSequence() {
    sequenceList.innerHTML = '';
    sequence.forEach((color, index) => {
      const item = document.createElement('div');
      item.className = 'sequence-color';
      if (index < sequenceIndex) item.classList.add('done');
      if (index === sequenceIndex) item.classList.add('current');
      item.innerHTML = `<span class="swatch" style="background:${color.hex}"></span><strong>${index + 1}. ${color.name}</strong>`;
      sequenceList.appendChild(item);
    });
    sequencePosition.textContent = `${Math.min(sequenceIndex, SEQUENCE_LENGTH)}/${SEQUENCE_LENGTH}`;
    sequenceProgressFill.style.width = `${(Math.min(sequenceIndex, SEQUENCE_LENGTH) / SEQUENCE_LENGTH) * 100}%`;
  }

  function updateTarget(announce = false) {
    const target = sequence[sequenceIndex];
    if (!target) return;
    targetSwatch.style.background = target.hex;
    targetTitle.textContent = target.name;
    targetPrompt.textContent = `Busca la tarjeta ${target.name} y colócala dentro del recuadro.`;
    if (announce) speak(`Muéstrame el color ${target.name}.`);
  }

  function updateStats() {
    const attempts = correctCount + incorrectCount;
    const accuracy = attempts ? Math.round((correctCount / attempts) * 100) : 0;
    scoreDisplay.textContent = score;
    correctDisplay.textContent = correctCount;
    incorrectDisplay.textContent = incorrectCount;
    completedDisplay.textContent = completedCount;
    accuracyDisplay.textContent = `${accuracy}%`;
  }

  function setFeedback(message, type = 'neutral') {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
  }

  function setCameraState(label, active) {
    cameraStatus.textContent = label;
    cameraStatus.classList.toggle('active', active);
  }

  function speak(text) {
    if (!audioEnabled) return;
    window.OsmoVoice?.speak(text, { rate: 0.92 });
  }

  function resetGame(announce = false) {
    window.clearTimeout(sequenceTransitionTimer);
    sequence = generateSequence();
    sequenceIndex = 0;
    score = 0;
    correctCount = 0;
    incorrectCount = 0;
    completedCount = 0;
    stableColorName = null;
    stableReads = 0;
    lastEvaluatedColor = null;
    gameActive = true;
    renderSequence();
    updateTarget(announce && Boolean(stream));
    updateStats();
    setFeedback('Sigue la secuencia y muestra un color a la vez.', 'neutral');
  }

  async function startCamera() {
    if (stream) {
      stopCamera();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setFeedback('Este navegador no permite utilizar la cámara.', 'error');
      return;
    }

    try {
      setCameraState('Abriendo', false);
      setFeedback('Preparando la cámara...', 'neutral');
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      video.srcObject = stream;
      await video.play();
      cameraPlaceholder.hidden = true;
      cameraBtn.innerHTML = '<span aria-hidden="true">■</span> Detener cámara';
      setCameraState('Reconociendo', true);
      if (!gameActive) resetGame(false);
      setFeedback(`Busca el color ${sequence[sequenceIndex].name}.`, 'neutral');
      speak(`Cámara lista. Muéstrame el color ${sequence[sequenceIndex].name}.`);
      startDetection();
    } catch (error) {
      console.error('No se pudo abrir la cámara:', error);
      stream = null;
      cameraPlaceholder.hidden = false;
      setCameraState('Sin cámara', false);
      setFeedback('No se pudo abrir la cámara. Revisa el permiso e inténtalo otra vez.', 'error');
    }
  }

  function stopCamera() {
    window.clearInterval(detectionTimer);
    detectionTimer = null;
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    cameraPlaceholder.hidden = false;
    cameraBtn.innerHTML = '<span aria-hidden="true">▶</span> Iniciar cámara';
    setCameraState('Preparado', false);
    detectedName.textContent = 'Esperando cámara';
    detectedRgb.textContent = 'Centra una tarjeta dentro del recuadro';
    detectedSwatch.style.background = '#ffffff';
    stableColorName = null;
    stableReads = 0;
    lastEvaluatedColor = null;
    window.speechSynthesis?.cancel();
  }

  function startDetection() {
    window.clearInterval(detectionTimer);
    detectionTimer = window.setInterval(detectColor, 550);
  }

  function detectColor() {
    if (!stream || video.readyState < 2 || !gameActive) return;
    const rgb = sampleCenterColor();
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const recognized = classifyColor(hsl);
    if (!recognized) return;

    detectedSwatch.style.background = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    detectedName.textContent = recognized.name;
    detectedRgb.textContent = `Lectura RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;

    if (stableColorName === recognized.name) {
      stableReads += 1;
    } else {
      stableColorName = recognized.name;
      stableReads = 1;
      lastEvaluatedColor = null;
    }

    if (stableReads >= REQUIRED_STABLE_READS && lastEvaluatedColor !== recognized.name) {
      lastEvaluatedColor = recognized.name;
      evaluateColor(recognized);
    }
  }

  function sampleCenterColor() {
    const maxWidth = 480;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const sampleWidth = Math.max(24, Math.round(width * 0.2));
    const sampleHeight = Math.max(24, Math.round(height * 0.28));
    const startX = Math.round((width - sampleWidth) / 2);
    const startY = Math.round((height - sampleHeight) / 2);
    const pixels = context.getImageData(startX, startY, sampleWidth, sampleHeight).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let index = 0; index < pixels.length; index += 16) {
      r += pixels[index];
      g += pixels[index + 1];
      b += pixels[index + 2];
      count += 1;
    }
    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count)
    };
  }

  function rgbToHsl(r, g, b) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;
    let hue = 0;
    let saturationValueHsl = 0;

    if (max !== min) {
      const delta = max - min;
      saturationValueHsl = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
      if (max === green) hue = (blue - red) / delta + 2;
      if (max === blue) hue = (red - green) / delta + 4;
      hue /= 6;
    }

    return { h: hue * 360, s: saturationValueHsl * 100, l: lightness * 100 };
  }

  function classifyColor({ h, s, l }) {
    const tolerance = Number(sensitivity.value);
    const achromaticLimit = Math.max(12, 38 - tolerance * 0.55);

    if (l <= 19) return colorByName('negro');
    if (s <= achromaticLimit) {
      if (l >= 79) return colorByName('blanco');
      return colorByName('gris');
    }
    if ((h >= 345 || h < 14)) return colorByName('rojo');
    if (h < 43) return l < 40 ? colorByName('marrón') : colorByName('naranja');
    if (h < 69) return colorByName('amarillo');
    if (h < 166) return colorByName('verde');
    if (h < 196) return colorByName('turquesa');
    if (h < 255) return colorByName('azul');
    if (h < 312) return colorByName('morado');
    return colorByName('rosa');
  }

  function evaluateColor(recognized) {
    const target = sequence[sequenceIndex];
    if (!target) return;

    if (recognized.name === target.name) {
      correctCount += 1;
      score += CORRECT_POINTS;
      sequenceIndex += 1;
      renderSequence();
      updateStats();

      if (sequenceIndex >= sequence.length) {
        completedCount += 1;
        score += COMPLETION_BONUS;
        gameActive = false;
        updateStats();
        setFeedback(`¡Secuencia completa! Ganaste ${COMPLETION_BONUS} puntos extra.`, 'success');
        stopCamera();
        setCameraState('Ronda completada', false);
        window.AppCelebration?.show({
          activity: 'Caza de Colores',
          icon: '●',
          message: 'Encontraste correctamente los 10 colores de la secuencia. ¡Tienes una mirada muy atenta!'
        });
        return;
      }

      const next = sequence[sequenceIndex];
      updateTarget(false);
      setFeedback(`¡Correcto! Viste ${recognized.name}. Ahora busca ${next.name}.`, 'success');
      speak(`Veo el color ${recognized.name}. Correcto. Ahora muéstrame el color ${next.name}.`);
      return;
    }

    incorrectCount += 1;
    score = Math.max(0, score - ERROR_PENALTY);
    updateStats();
    setFeedback(`Veo ${recognized.name}. La secuencia pide ${target.name}. Cambia la tarjeta.`, 'error');
    speak(`Veo el color ${recognized.name}. Ahora necesito el color ${target.name}.`);
  }

  cameraBtn.addEventListener('click', startCamera);
  newGameBtn.addEventListener('click', () => resetGame(Boolean(stream)));
  repeatPromptBtn.addEventListener('click', () => {
    const target = sequence[sequenceIndex];
    if (target) speak(`Muéstrame el color ${target.name}.`);
  });
  voiceBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    voiceBtn.setAttribute('aria-pressed', String(audioEnabled));
    voiceBtn.innerHTML = audioEnabled
      ? '<span aria-hidden="true">🔊</span> Voz activada'
      : '<span aria-hidden="true">🔇</span> Voz silenciada';
    if (audioEnabled) {
      const target = sequence[sequenceIndex];
      speak(`Voz activada. Muéstrame el color ${target.name}.`);
    } else {
      window.speechSynthesis?.cancel();
    }
  });
  sensitivity.addEventListener('input', () => {
    sensitivityValue.textContent = sensitivity.value;
  });
  window.addEventListener('beforeunload', stopCamera);

  renderMiniPalette();
  resetGame(false);
}());
