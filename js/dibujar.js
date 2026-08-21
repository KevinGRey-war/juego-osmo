(function () {
  'use strict';

  const video = document.getElementById('video');
  const drawingCanvas = document.getElementById('drawingCanvas');
  const drawingContext = drawingCanvas.getContext('2d');
  const trackingCanvas = document.getElementById('trackingCanvas');
  const trackingContext = trackingCanvas.getContext('2d');
  const cameraStage = document.querySelector('.camera-stage');
  const cameraButton = document.getElementById('cameraButton');
  const cameraStatus = document.getElementById('cameraStatus');
  const drawingStatus = document.getElementById('drawingStatus');
  const gestureBadge = document.getElementById('gestureBadge');
  const fingerCount = document.getElementById('fingerCount');
  const clearButton = document.getElementById('clearButton');
  const undoButton = document.getElementById('undoButton');
  const saveButton = document.getElementById('saveButton');
  const brushSize = document.getElementById('brushSize');
  const brushValue = document.getElementById('brushValue');
  const colorSwatches = document.querySelectorAll('.color-swatch');

  let handsModel = null;
  let camera = null;
  let running = false;
  let color = '#ef3e36';
  let lineWidth = 12;
  let lastPoint = null;
  let smoothedPoint = null;
  let gestureFrames = 0;
  let strokeOpen = false;
  let history = [];
  let drawingStartedAt = 0;
  let drawingTimer = null;
  let drawingHasContent = false;
  let saveReady = false;
  let drawingSaved = false;
  const REQUIRED_GESTURE_FRAMES = 1;
  const POSITION_SMOOTHING = 0.74;
  const SAVE_DELAY_MS = 60 * 1000;

  function formatTime(milliseconds) {
    const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function updateSaveState() {
    const elapsed = drawingStartedAt ? Date.now() - drawingStartedAt : 0;
    const remaining = Math.max(0, SAVE_DELAY_MS - elapsed);
    saveReady = drawingHasContent && remaining === 0;
    saveButton.dataset.saveReady = String(saveReady);

    if (drawingSaved) {
      saveButton.disabled = true;
      saveButton.textContent = '✓ Dibujo guardado';
      return;
    }

    saveButton.disabled = !saveReady;
    saveButton.textContent = saveReady
      ? '↓ Guardar dibujo'
      : `↓ Guardar en ${formatTime(remaining || SAVE_DELAY_MS)}`;

    if (saveReady && drawingTimer) {
      window.clearInterval(drawingTimer);
      drawingTimer = null;
    }
  }

  function startDrawingTimer() {
    if (drawingStartedAt) return;
    drawingStartedAt = Date.now();
    updateSaveState();
    drawingTimer = window.setInterval(updateSaveState, 250);
  }

  function resetDrawingTimer() {
    window.clearInterval(drawingTimer);
    drawingTimer = null;
    drawingStartedAt = 0;
    drawingHasContent = false;
    saveReady = false;
    drawingSaved = false;
    updateSaveState();
  }

  function setCanvasSize(width, height) {
    if (!width || !height || drawingCanvas.width === width && drawingCanvas.height === height) return;
    const previous = document.createElement('canvas');
    previous.width = drawingCanvas.width || width;
    previous.height = drawingCanvas.height || height;
    previous.getContext('2d').drawImage(drawingCanvas, 0, 0);
    drawingCanvas.width = width;
    drawingCanvas.height = height;
    trackingCanvas.width = width;
    trackingCanvas.height = height;
    drawingContext.lineCap = 'round';
    drawingContext.lineJoin = 'round';
    if (previous.width && previous.height) drawingContext.drawImage(previous, 0, 0, width, height);
    history = [];
    undoButton.disabled = true;
  }

  function distance(pointA, pointB) {
    return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y, (pointA.z || 0) - (pointB.z || 0));
  }

  function jointAngle(pointA, vertex, pointC) {
    const vectorA = { x:pointA.x - vertex.x, y:pointA.y - vertex.y, z:(pointA.z || 0) - (vertex.z || 0) };
    const vectorC = { x:pointC.x - vertex.x, y:pointC.y - vertex.y, z:(pointC.z || 0) - (vertex.z || 0) };
    const dot = vectorA.x * vectorC.x + vectorA.y * vectorC.y + vectorA.z * vectorC.z;
    const magnitude = Math.hypot(vectorA.x, vectorA.y, vectorA.z) * Math.hypot(vectorC.x, vectorC.y, vectorC.z);
    return magnitude ? Math.acos(Math.max(-1, Math.min(1, dot / magnitude))) * 180 / Math.PI : 0;
  }

  function fingerStates(landmarks) {
    const wrist = landmarks[0];
    const thumb = jointAngle(landmarks[2], landmarks[3], landmarks[4]) > 132 && distance(landmarks[4], wrist) > distance(landmarks[3], wrist) * 1.015;
    const fingers = [[5,6,8],[9,10,12],[13,14,16],[17,18,20]].map(([mcp,pip,tip]) => (
      jointAngle(landmarks[mcp], landmarks[pip], landmarks[tip]) > 135 &&
      distance(landmarks[tip], wrist) > distance(landmarks[pip], wrist) * 1.015
    ));
    return [thumb, ...fingers];
  }

  function updateGestureStatus(count, valid) {
    fingerCount.textContent = count;
    gestureBadge.classList.toggle('ready', valid);
    if (valid) {
      drawingStatus.className = 'drawing-status drawing';
      drawingStatus.innerHTML = '<span></span><strong>Dibujando</strong><small>Índice detectado.</small>';
      return;
    }
    drawingStatus.className = 'drawing-status waiting';
    drawingStatus.innerHTML = '<span></span><strong>Pincel bloqueado</strong><small>Levanta solo el índice y cierra los demás dedos.</small>';
  }

  function beginStroke() {
    if (strokeOpen) return;
    if (drawingCanvas.width && drawingCanvas.height) {
      history.push(drawingContext.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));
      if (history.length > 15) history.shift();
      undoButton.disabled = false;
    }
    strokeOpen = true;
  }

  function endStroke() {
    lastPoint = null;
    smoothedPoint = null;
    strokeOpen = false;
  }

  function drawAt(point) {
    beginStroke();
    smoothedPoint = smoothedPoint ? {
      x: smoothedPoint.x + (point.x - smoothedPoint.x) * POSITION_SMOOTHING,
      y: smoothedPoint.y + (point.y - smoothedPoint.y) * POSITION_SMOOTHING
    } : point;
    if (lastPoint) {
      if (!drawingHasContent) {
        drawingHasContent = true;
        startDrawingTimer();
      }
      if (drawingSaved) {
        drawingSaved = false;
        updateSaveState();
      }
      drawingContext.beginPath();
      drawingContext.moveTo(lastPoint.x, lastPoint.y);
      drawingContext.lineTo(smoothedPoint.x, smoothedPoint.y);
      drawingContext.strokeStyle = color;
      drawingContext.lineWidth = lineWidth;
      drawingContext.stroke();
    }
    lastPoint = { ...smoothedPoint };
  }

  function drawTracking(landmarks) {
    trackingContext.clearRect(0, 0, trackingCanvas.width, trackingCanvas.height);
    if (typeof window.drawConnectors !== 'function') return;
    trackingContext.save();
    trackingContext.translate(trackingCanvas.width, 0);
    trackingContext.scale(-1, 1);
    window.drawConnectors(trackingContext, landmarks, window.HAND_CONNECTIONS, { color:'#f7c844', lineWidth:4 });
    window.drawLandmarks(trackingContext, landmarks, { color:'#ef654b', lineWidth:1, radius:4 });
    trackingContext.restore();
  }

  function onResults(results) {
    if (!running) return;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    setCanvasSize(width, height);
    const landmarks = results.multiHandLandmarks?.[0];
    if (!landmarks) {
      trackingContext.clearRect(0,0,width,height);
      gestureFrames = 0;
      updateGestureStatus(0, false);
      endStroke();
      return;
    }
    drawTracking(landmarks);
    const states = fingerStates(landmarks);
    const count = states.filter(Boolean).length;
    const validGesture = count === 1 && states[1];
    gestureFrames = validGesture ? gestureFrames + 1 : 0;
    const readyToDraw = gestureFrames >= REQUIRED_GESTURE_FRAMES;
    updateGestureStatus(count, readyToDraw);
    if (!readyToDraw) {
      endStroke();
      return;
    }
    const indexTip = landmarks[8];
    drawAt({ x:(1 - indexTip.x) * width, y:indexTip.y * height });
  }

  async function toggleCamera() {
    if (running) {
      stopCamera();
      return;
    }
    if (typeof window.Hands !== 'function' || typeof window.Camera !== 'function') {
      drawingStatus.innerHTML = '<span></span><strong>Detector no disponible</strong><small>Revisa la conexión y recarga la página.</small>';
      return;
    }
    try {
      cameraStatus.textContent = 'Cargando';
      handsModel = new window.Hands({ locateFile:file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      handsModel.setOptions({ maxNumHands:1, modelComplexity:1, minDetectionConfidence:.48, minTrackingConfidence:.45 });
      handsModel.onResults(onResults);
      await handsModel.initialize();
      running = true;
      camera = new window.Camera(video, { width:960, height:720, onFrame:async () => running && handsModel && handsModel.send({ image:video }) });
      await camera.start();
      cameraStage.classList.add('streaming');
      cameraStatus.textContent = 'Detectando';
      cameraStatus.classList.add('active');
      cameraButton.textContent = '■ Detener cámara';
      drawingStatus.innerHTML = '<span></span><strong>Pincel bloqueado</strong><small>Levanta solo el índice y cierra los demás dedos.</small>';
    } catch (error) {
      running = false;
      cameraStatus.textContent = 'Sin acceso';
      drawingStatus.innerHTML = '<span></span><strong>No se pudo abrir la cámara</strong><small>Revisa el permiso e inténtalo otra vez.</small>';
    }
  }

  function stopCamera() {
    running = false;
    if (camera) camera.stop();
    camera = null;
    if (handsModel) handsModel.close();
    handsModel = null;
    video.srcObject = null;
    trackingContext.clearRect(0,0,trackingCanvas.width,trackingCanvas.height);
    cameraStage.classList.remove('streaming');
    cameraStatus.textContent = 'Preparado';
    cameraStatus.classList.remove('active');
    cameraButton.textContent = '▶ Iniciar cámara';
    fingerCount.textContent = '0';
    gestureBadge.classList.remove('ready');
    drawingStatus.className = 'drawing-status waiting';
    drawingStatus.innerHTML = '<span></span><strong>Esperando cámara</strong><small>El dibujo está bloqueado.</small>';
    endStroke();
  }

  function clearDrawing() {
    drawingContext.clearRect(0,0,drawingCanvas.width,drawingCanvas.height);
    history = [];
    undoButton.disabled = true;
    endStroke();
    resetDrawingTimer();
  }

  function undoStroke() {
    const snapshot = history.pop();
    if (!snapshot) return;
    drawingContext.putImageData(snapshot,0,0);
    undoButton.disabled = history.length === 0;
    endStroke();
  }

  function saveDrawing() {
    if (!drawingCanvas.width || !drawingCanvas.height || !saveReady || !drawingHasContent) return;
    const output = document.createElement('canvas');
    output.width = drawingCanvas.width;
    output.height = drawingCanvas.height;
    const outputContext = output.getContext('2d');
    outputContext.fillStyle = '#ffffff';
    outputContext.fillRect(0,0,output.width,output.height);
    outputContext.drawImage(drawingCanvas,0,0);
    const link = document.createElement('a');
    link.download = `dibujo-con-indice-${Date.now()}.png`;
    link.href = output.toDataURL('image/png');
    link.click();
    drawingSaved = true;
    updateSaveState();
    window.AppCelebration?.show({
      activity: 'Dibuja con el Índice',
      icon: '✎',
      message: 'Dibujaste durante un minuto y guardaste tu creación. ¡Tu imaginación quedó lista para compartir!'
    });
  }

  colorSwatches.forEach(swatch => swatch.addEventListener('click', () => {
    color = swatch.dataset.color;
    colorSwatches.forEach(item => item.classList.toggle('active', item === swatch));
  }));
  brushSize.addEventListener('input', () => { lineWidth = Number(brushSize.value); brushValue.textContent = `${lineWidth} px`; });
  cameraButton.addEventListener('click', toggleCamera);
  clearButton.addEventListener('click', clearDrawing);
  undoButton.addEventListener('click', undoStroke);
  saveButton.addEventListener('click', saveDrawing);
  window.addEventListener('beforeunload', stopCamera);
  updateSaveState();
}());
