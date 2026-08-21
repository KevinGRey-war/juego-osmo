(function () {
  'use strict';

  const video = document.getElementById('video');
  const canvas = document.getElementById('handCanvas');
  const context = canvas.getContext('2d');
  const cameraStage = document.querySelector('.camera-stage');
  const cameraButton = document.getElementById('cameraButton');
  const cameraStatus = document.getElementById('cameraStatus');
  const voiceButton = document.getElementById('voiceButton');
  const repeatButton = document.getElementById('repeatButton');
  const newRoundButton = document.getElementById('newRoundButton');
  const targetNumber = document.getElementById('targetNumber');
  const targetTitle = document.getElementById('targetTitle');
  const targetHint = document.getElementById('targetHint');
  const numberSteps = document.getElementById('numberSteps');
  const progressFill = document.getElementById('progressFill');
  const roundPosition = document.getElementById('roundPosition');
  const handsDetected = document.getElementById('handsDetected');
  const fingersDetected = document.getElementById('fingersDetected');
  const leftFingers = document.getElementById('leftFingers');
  const rightFingers = document.getElementById('rightFingers');
  const feedback = document.getElementById('feedback');
  const scoreDisplay = document.getElementById('score');
  const correctDisplay = document.getElementById('correctCount');
  const incorrectDisplay = document.getElementById('incorrectCount');
  const streakDisplay = document.getElementById('streakCount');
  const accuracyDisplay = document.getElementById('accuracy');

  let handsModel = null;
  let camera = null;
  let running = false;
  let voiceEnabled = true;
  let sequence = [];
  let sequenceIndex = 0;
  let score = 0;
  let correct = 0;
  let incorrect = 0;
  let streak = 0;
  let stableValue = null;
  let stableFrames = 0;
  let lastEvaluatedValue = null;
  let evaluationLocked = false;
  let transitionTimer = null;
  const REQUIRED_STABLE_FRAMES = 11;

  function shuffledNumbers() {
    const values = Array.from({ length: 10 }, (_, index) => index + 1);
    for (let index = values.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
    }
    return values;
  }

  function speak(text) {
    if (!voiceEnabled) return;
    window.OsmoVoice?.speak(text, { rate: 0.9 });
  }

  function renderProgress() {
    numberSteps.innerHTML = sequence.map((number, index) => {
      const state = index < sequenceIndex ? 'done' : index === sequenceIndex ? 'current' : '';
      return `<span class="number-step ${state}">${number}</span>`;
    }).join('');
    roundPosition.textContent = `${Math.min(sequenceIndex, 10)}/10`;
    progressFill.style.width = `${Math.min(sequenceIndex, 10) * 10}%`;
  }

  function updateStats() {
    const attempts = correct + incorrect;
    scoreDisplay.textContent = score;
    correctDisplay.textContent = correct;
    incorrectDisplay.textContent = incorrect;
    streakDisplay.textContent = streak;
    accuracyDisplay.textContent = `${attempts ? Math.round((correct / attempts) * 100) : 0}%`;
  }

  function updateTarget(announce = false) {
    const target = sequence[sequenceIndex];
    if (!target) return;
    targetNumber.textContent = target;
    targetTitle.textContent = `Muestra ${target} ${target === 1 ? 'dedo' : 'dedos'}`;
    targetHint.textContent = target <= 5 ? 'Puedes usar una mano.' : 'Usa las dos manos para llegar a este número.';
    if (announce) speak(`Muestra ${target} ${target === 1 ? 'dedo' : 'dedos'}.`);
  }

  function setFeedback(message, type = 'neutral') {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
  }

  function resetRound(announce = false) {
    window.clearTimeout(transitionTimer);
    sequence = shuffledNumbers();
    sequenceIndex = 0;
    score = 0;
    correct = 0;
    incorrect = 0;
    streak = 0;
    stableValue = null;
    stableFrames = 0;
    lastEvaluatedValue = null;
    evaluationLocked = false;
    renderProgress();
    updateStats();
    updateTarget(announce && running);
    setFeedback('Ronda preparada. Completa los números del 1 al 10.', 'neutral');
  }

  function distance(pointA, pointB) {
    return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y, (pointA.z || 0) - (pointB.z || 0));
  }

  function jointAngle(pointA, vertex, pointC) {
    const vectorA = { x: pointA.x - vertex.x, y: pointA.y - vertex.y, z: (pointA.z || 0) - (vertex.z || 0) };
    const vectorC = { x: pointC.x - vertex.x, y: pointC.y - vertex.y, z: (pointC.z || 0) - (vertex.z || 0) };
    const dot = vectorA.x * vectorC.x + vectorA.y * vectorC.y + vectorA.z * vectorC.z;
    const magnitude = Math.hypot(vectorA.x, vectorA.y, vectorA.z) * Math.hypot(vectorC.x, vectorC.y, vectorC.z);
    return magnitude ? Math.acos(Math.max(-1, Math.min(1, dot / magnitude))) * 180 / Math.PI : 0;
  }

  function countHandFingers(landmarks) {
    const wrist = landmarks[0];
    const palmWidth = distance(landmarks[5], landmarks[17]);
    const thumbExtended = (
      jointAngle(landmarks[1], landmarks[2], landmarks[3]) > 145 &&
      jointAngle(landmarks[2], landmarks[3], landmarks[4]) > 150 &&
      distance(landmarks[4], landmarks[5]) > palmWidth * 0.52
    );
    let count = thumbExtended ? 1 : 0;
    [[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]].forEach(([mcp,pip,dip,tip]) => {
      const extended = (
        jointAngle(landmarks[mcp], landmarks[pip], landmarks[dip]) > 158 &&
        jointAngle(landmarks[pip], landmarks[dip], landmarks[tip]) > 155 &&
        distance(landmarks[tip], wrist) > distance(landmarks[pip], wrist) * 1.1 &&
        distance(landmarks[tip], landmarks[mcp]) > distance(landmarks[dip], landmarks[mcp]) * 1.07
      );
      if (extended) count += 1;
    });
    return count;
  }

  function evaluateCount(value) {
    if (evaluationLocked || value <= 0 || value === lastEvaluatedValue) return;
    lastEvaluatedValue = value;
    const target = sequence[sequenceIndex];
    if (value !== target) {
      incorrect += 1;
      streak = 0;
      score = Math.max(0, score - 2);
      updateStats();
      setFeedback(`Veo ${value}. El reto pide ${target}. Cambia el gesto.`, 'error');
      speak(`Veo ${value} dedos. Intenta mostrar ${target}.`);
      return;
    }

    evaluationLocked = true;
    correct += 1;
    streak += 1;
    score += 10;
    sequenceIndex += 1;
    renderProgress();
    updateStats();
    setFeedback(`¡Correcto! Mostraste ${value}.`, 'success');
    speak(`¡Correcto! Mostraste ${value}.`);
    if (sequenceIndex >= sequence.length) {
      transitionTimer = window.setTimeout(() => {
        targetNumber.textContent = '✓';
        targetTitle.textContent = 'Ronda completada';
        targetHint.textContent = `Terminaste con ${correct} aciertos y ${incorrect} errores.`;
        setFeedback('¡Muy bien! Completaste los diez números.', 'success');
        speak(`¡Muy bien! Completaste los números del uno al diez con ${correct} aciertos y ${incorrect} errores.`);
        window.AppCelebration?.show({
          activity: 'Cuenta con tus Manos',
          icon: '10',
          message: 'Mostraste con tus manos los 10 números de la ronda. ¡Gran coordinación!'
        });
      }, 900);
      return;
    }
    transitionTimer = window.setTimeout(() => {
      evaluationLocked = false;
      lastEvaluatedValue = null;
      stableValue = null;
      stableFrames = 0;
      updateTarget(true);
      setFeedback(`Ahora muestra ${sequence[sequenceIndex]}.`, 'neutral');
    }, 1400);
  }

  function onResults(results) {
    if (!running) return;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    context.clearRect(0, 0, width, height);
    const landmarksList = results.multiHandLandmarks || [];
    const handednessList = results.multiHandedness || [];
    handsDetected.textContent = landmarksList.length;
    let total = 0;
    let leftTotal = 0;
    let rightTotal = 0;
    landmarksList.forEach((landmarks, index) => {
      const rawHandedness = handednessList[index]?.label || 'Left';
      const displayedHand = rawHandedness === 'Left' ? 'Right' : 'Left';
      const handCount = countHandFingers(landmarks);
      total += handCount;
      if (displayedHand === 'Left') leftTotal += handCount;
      else rightTotal += handCount;
      if (typeof window.drawConnectors === 'function') {
        window.drawConnectors(context, landmarks, window.HAND_CONNECTIONS, { color: '#f7c844', lineWidth: 4 });
        window.drawLandmarks(context, landmarks, { color: '#ef654b', lineWidth: 1, radius: 4 });
      }
    });
    leftFingers.textContent = leftTotal;
    rightFingers.textContent = rightTotal;
    fingersDetected.textContent = total;
    if (!landmarksList.length) {
      stableValue = null;
      stableFrames = 0;
      lastEvaluatedValue = null;
      return;
    }
    if (stableValue === total) stableFrames += 1;
    else {
      stableValue = total;
      stableFrames = 1;
      lastEvaluatedValue = null;
    }
    if (stableFrames >= REQUIRED_STABLE_FRAMES) evaluateCount(total);
  }

  async function startCamera() {
    if (running) {
      stopCamera();
      return;
    }
    if (typeof window.Hands !== 'function' || typeof window.Camera !== 'function') {
      setFeedback('No se pudo cargar el detector de manos. Revisa la conexión y recarga.', 'error');
      return;
    }
    try {
      cameraStatus.textContent = 'Cargando';
      handsModel = new window.Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      handsModel.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.68, minTrackingConfidence: 0.64 });
      handsModel.onResults(onResults);
      await handsModel.initialize();
      running = true;
      camera = new window.Camera(video, { width: 960, height: 720, onFrame: async () => running && handsModel && handsModel.send({ image: video }) });
      await camera.start();
      cameraStage.classList.add('streaming');
      cameraStatus.textContent = 'Detectando';
      cameraStatus.classList.add('active');
      cameraButton.textContent = '■ Detener cámara';
      setFeedback(`Muestra ${sequence[sequenceIndex]} con tus dedos.`, 'neutral');
      speak(`Cámara lista. Muestra ${sequence[sequenceIndex]} con tus dedos.`);
    } catch (error) {
      running = false;
      cameraStatus.textContent = 'Sin acceso';
      setFeedback('No se pudo abrir la cámara. Revisa el permiso e inténtalo otra vez.', 'error');
    }
  }

  function stopCamera() {
    running = false;
    if (camera) camera.stop();
    camera = null;
    if (handsModel) handsModel.close();
    handsModel = null;
    video.srcObject = null;
    context.clearRect(0, 0, canvas.width, canvas.height);
    cameraStage.classList.remove('streaming');
    cameraStatus.textContent = 'Preparado';
    cameraStatus.classList.remove('active');
    cameraButton.textContent = '▶ Iniciar cámara';
    handsDetected.textContent = '0';
    fingersDetected.textContent = '0';
    leftFingers.textContent = '0';
    rightFingers.textContent = '0';
  }

  cameraButton.addEventListener('click', startCamera);
  repeatButton.addEventListener('click', () => sequence[sequenceIndex] && speak(`Muestra ${sequence[sequenceIndex]} con tus dedos.`));
  newRoundButton.addEventListener('click', () => resetRound(running));
  voiceButton.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    voiceButton.setAttribute('aria-pressed', String(voiceEnabled));
    voiceButton.textContent = voiceEnabled ? '🔊 Voz activada' : '🔇 Voz silenciada';
    if (!voiceEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  });
  window.addEventListener('beforeunload', stopCamera);
  resetRound(false);
}());
