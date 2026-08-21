(function () {
  'use strict';

  const MATERIAL_COLORS = ['#176b43', '#ef654b', '#1f6387', '#8245a8', '#c18000'];
  const ANALYSIS_SIZE = 192;
  const TEMPLATE_SIZE = 64;
  const ROUND_SIZE = 10;
  const SHAPES = [
    ['circle', 'círculo'], ['square', 'cuadrado'], ['triangle', 'triángulo'],
    ['rectangle', 'rectángulo'], ['oval', 'óvalo'], ['diamond', 'rombo'],
    ['pentagon', 'pentágono'], ['hexagon', 'hexágono'], ['heptagon', 'heptágono'],
    ['octagon', 'octágono'], ['nonagon', 'eneágono'], ['decagon', 'decágono'],
    ['star', 'estrella'], ['heart', 'corazón'], ['semicircle', 'semicírculo'],
    ['trapezoid', 'trapecio'], ['parallelogram', 'paralelogramo'], ['cross', 'cruz'],
    ['arrow', 'flecha'], ['kite', 'cometa'], ['right-triangle', 'triángulo rectángulo'],
    ['isosceles', 'triángulo isósceles'], ['scalene', 'triángulo escaleno'],
    ['crescent', 'media luna'], ['ring', 'anillo']
  ].map(([id, name], index) => ({
    id,
    name,
    color: MATERIAL_COLORS[index % MATERIAL_COLORS.length],
    hue: hexHue(MATERIAL_COLORS[index % MATERIAL_COLORS.length])
  }));

  const video = document.getElementById('video');
  const analysisCanvas = document.getElementById('analysisCanvas');
  analysisCanvas.width = ANALYSIS_SIZE;
  analysisCanvas.height = ANALYSIS_SIZE;
  const analysisContext = analysisCanvas.getContext('2d', { willReadFrequently: true });
  const cameraStage = document.querySelector('.camera-stage');
  const cameraButton = document.getElementById('cameraButton');
  const cameraStatus = document.getElementById('cameraStatus');
  const detectedLabel = document.getElementById('detectedLabel');
  const voiceButton = document.getElementById('voiceButton');
  const repeatButton = document.getElementById('repeatButton');
  const newRoundButton = document.getElementById('newRoundButton');
  const targetShape = document.getElementById('targetShape');
  const targetName = document.getElementById('targetName');
  const targetInstruction = document.getElementById('targetInstruction');
  const progressFill = document.getElementById('progressFill');
  const roundPosition = document.getElementById('roundPosition');
  const feedback = document.getElementById('feedback');
  const scoreDisplay = document.getElementById('score');
  const correctDisplay = document.getElementById('correctCount');
  const incorrectDisplay = document.getElementById('incorrectCount');
  const remainingDisplay = document.getElementById('remainingCount');
  const accuracyDisplay = document.getElementById('accuracy');
  const catalog = document.getElementById('shapeCatalog');

  let templates = [];
  let round = [];
  let roundIndex = 0;
  let score = 0;
  let correct = 0;
  let incorrect = 0;
  let stream = null;
  let scanning = false;
  let locked = false;
  let voiceEnabled = true;
  let analysisTimer = null;
  let transitionTimer = null;
  let stableShapeId = '';
  let stableFrames = 0;
  let noDetectionFrames = 0;
  let lastEvaluatedId = '';

  function hexHue(hex) {
    const value = hex.replace('#', '');
    return rgbHue(
      parseInt(value.slice(0, 2), 16),
      parseInt(value.slice(2, 4), 16),
      parseInt(value.slice(4, 6), 16)
    );
  }

  function rgbHue(red, green, blue) {
    const r = red / 255;
    const g = green / 255;
    const b = blue / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    if (!delta) return 0;
    let hue;
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * (((b - r) / delta) + 2);
    else hue = 60 * (((r - g) / delta) + 4);
    return hue < 0 ? hue + 360 : hue;
  }

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  }

  function shapeMarkup(shape) {
    return `<span class="shape-outline" aria-hidden="true"><span class="shape-art shape-${shape.id}" style="--shape-color:${shape.color}"></span></span>`;
  }

  function renderCatalog() {
    catalog.innerHTML = SHAPES.map(shape => `<div class="shape-token">${shapeMarkup(shape)}<small>${shape.name}</small></div>`).join('');
  }

  function speak(text) {
    if (!voiceEnabled) return;
    window.OsmoVoice?.speak(text, { rate: 0.9 });
  }

  function updateStats() {
    const attempts = correct + incorrect;
    const total = round.length || ROUND_SIZE;
    scoreDisplay.textContent = score;
    correctDisplay.textContent = correct;
    incorrectDisplay.textContent = incorrect;
    remainingDisplay.textContent = Math.max(0, total - roundIndex);
    accuracyDisplay.textContent = `${attempts ? Math.round((correct / attempts) * 100) : 0}%`;
    roundPosition.textContent = `${Math.min(roundIndex, total)}/${total}`;
    progressFill.style.width = `${(Math.min(roundIndex, total) / total) * 100}%`;
  }

  function setFeedback(message, type = 'neutral') {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
  }

  function showTarget(announce = false) {
    const shape = round[roundIndex];
    if (!shape) return;
    targetShape.innerHTML = shapeMarkup(shape);
    targetName.textContent = shape.name;
    targetInstruction.textContent = `Muestra ${shape.name} dentro del marco de la cámara.`;
    stableShapeId = '';
    stableFrames = 0;
    if (announce) speak(`Busca y muestra la figura ${shape.name} frente a la cámara.`);
  }

  function newRound(announce = false) {
    window.clearTimeout(transitionTimer);
    round = shuffle(SHAPES).slice(0, ROUND_SIZE);
    roundIndex = 0;
    score = 0;
    correct = 0;
    incorrect = 0;
    locked = false;
    stableShapeId = '';
    stableFrames = 0;
    noDetectionFrames = 0;
    lastEvaluatedId = '';
    updateStats();
    showTarget(announce);
    setFeedback(stream ? 'Ronda nueva: muestra la figura solicitada dentro del marco.' : 'Ronda preparada: enciende la cámara para comenzar.', 'neutral');
  }

  function finishRound() {
    locked = true;
    targetShape.innerHTML = '<span class="finish-mark">✓</span>';
    targetName.textContent = 'Ronda completada';
    targetInstruction.textContent = `Terminaste con ${correct} aciertos y ${incorrect} errores.`;
    detectedLabel.textContent = 'Ronda completada';
    setFeedback('¡Excelente! La cámara reconoció las 10 figuras de esta ronda.', 'success');
    speak(`¡Excelente! Completaste las diez figuras con ${correct} aciertos y ${incorrect} errores.`);
    stopCamera(true);
    window.AppCelebration?.show({
      activity: 'Reto de Formas',
      icon: '◆',
      message: 'Reconociste 10 figuras elegidas al azar entre las 25 disponibles. ¡Excelente observación!'
    });
  }

  function evaluateShape(shapeId) {
    if (locked || !round[roundIndex]) return;
    const detected = SHAPES.find(shape => shape.id === shapeId);
    if (!detected) return;
    const target = round[roundIndex];
    lastEvaluatedId = detected.id;

    if (detected.id !== target.id) {
      incorrect += 1;
      score = Math.max(0, score - 2);
      updateStats();
      setFeedback(`La cámara reconoció ${detected.name}. Busca ${target.name} y vuelve a mostrarla.`, 'error');
      speak(`Esa figura es ${detected.name}. Busca ${target.name}.`);
      return;
    }

    locked = true;
    correct += 1;
    score += 10;
    roundIndex += 1;
    updateStats();
    setFeedback(`¡Correcto! La cámara reconoció ${detected.name}.`, 'success');
    speak(`¡Correcto! Es ${detected.name}.`);
    if (roundIndex >= round.length) {
      transitionTimer = window.setTimeout(finishRound, 1000);
      return;
    }
    transitionTimer = window.setTimeout(() => {
      locked = false;
      showTarget(true);
      setFeedback(`Ahora muestra ${round[roundIndex].name}. Retira la figura anterior antes de continuar.`, 'neutral');
    }, 1500);
  }

  function drawPolygon(context, points) {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(point => context.lineTo(point[0], point[1]));
    context.closePath();
    context.fill();
  }

  function regularPolygonPoints(cx, cy, radius, sides, rotation = -Math.PI / 2) {
    return Array.from({ length: sides }, (_, index) => {
      const angle = rotation + (2 * Math.PI * index / sides);
      return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
    });
  }

  function drawTemplateShape(context, shapeId, variant = {}) {
    const cx = 110;
    const cy = 110;
    const radius = 76;
    context.fillStyle = '#ffffff';
    context.strokeStyle = '#ffffff';
    context.lineWidth = 28;
    context.lineJoin = 'round';

    if (shapeId === 'circle') {
      context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2); context.fill();
    } else if (shapeId === 'square') {
      context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    } else if (shapeId === 'triangle') {
      drawPolygon(context, [[cx, cy - radius], [cx + radius, cy + radius], [cx - radius, cy + radius]]);
    } else if (shapeId === 'rectangle') {
      context.fillRect(cx - radius, cy - 48, radius * 2, 96);
    } else if (shapeId === 'oval') {
      context.beginPath(); context.ellipse(cx, cy, radius, 52, 0, 0, Math.PI * 2); context.fill();
    } else if (shapeId === 'diamond') {
      drawPolygon(context, [[cx, cy - radius], [cx + radius, cy], [cx, cy + radius], [cx - radius, cy]]);
    } else if (shapeId === 'kite') {
      drawPolygon(context, [[cx, cy - radius], [cx + 61, cy - 18], [cx, cy + radius], [cx - 61, cy - 18]]);
    } else if (['pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon'].includes(shapeId)) {
      const sides = { pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8, nonagon: 9, decagon: 10 }[shapeId];
      drawPolygon(context, regularPolygonPoints(cx, cy, radius, sides, -Math.PI / 2 + (variant.rotation || 0)));
    } else if (shapeId === 'star') {
      drawPolygon(context, Array.from({ length: 10 }, (_, index) => {
        const pointRadius = index % 2 === 0 ? radius : radius * 0.43;
        const angle = -Math.PI / 2 + index * Math.PI / 5;
        return [cx + Math.cos(angle) * pointRadius, cy + Math.sin(angle) * pointRadius];
      }));
    } else if (shapeId === 'heart') {
      context.beginPath();
      context.moveTo(cx, cy + radius);
      context.bezierCurveTo(cx - 96, cy + 18, cx - 82, cy - 61, cx - 37, cy - 65);
      context.bezierCurveTo(cx - 12, cy - 68, cx, cy - 47, cx, cy - 35);
      context.bezierCurveTo(cx, cy - 47, cx + 12, cy - 68, cx + 37, cy - 65);
      context.bezierCurveTo(cx + 82, cy - 61, cx + 96, cy + 18, cx, cy + radius);
      context.fill();
    } else if (shapeId === 'semicircle') {
      context.beginPath(); context.arc(cx, cy + 24, radius, Math.PI, Math.PI * 2); context.lineTo(cx - radius, cy + 24); context.closePath(); context.fill();
    } else if (shapeId === 'trapezoid') {
      drawPolygon(context, [[cx - 43, cy - radius], [cx + 43, cy - radius], [cx + radius, cy + radius], [cx - radius, cy + radius]]);
    } else if (shapeId === 'parallelogram') {
      drawPolygon(context, [[cx - 42, cy - radius], [cx + radius, cy - radius], [cx + 42, cy + radius], [cx - radius, cy + radius]]);
    } else if (shapeId === 'cross') {
      const unit = 26;
      drawPolygon(context, [[cx-unit,cy-radius],[cx+unit,cy-radius],[cx+unit,cy-unit],[cx+radius,cy-unit],[cx+radius,cy+unit],[cx+unit,cy+unit],[cx+unit,cy+radius],[cx-unit,cy+radius],[cx-unit,cy+unit],[cx-radius,cy+unit],[cx-radius,cy-unit],[cx-unit,cy-unit]]);
    } else if (shapeId === 'arrow') {
      drawPolygon(context, [[cx-radius,cy-25],[cx+13,cy-25],[cx+13,cy-62],[cx+radius,cy],[cx+13,cy+62],[cx+13,cy+25],[cx-radius,cy+25]]);
    } else if (shapeId === 'right-triangle') {
      drawPolygon(context, [[cx-radius,cy-radius],[cx-radius,cy+radius],[cx+radius,cy+radius]]);
    } else if (shapeId === 'isosceles') {
      drawPolygon(context, [[cx,cy-radius],[cx+56,cy+radius],[cx-56,cy+radius]]);
    } else if (shapeId === 'scalene') {
      drawPolygon(context, [[cx+30,cy-radius],[cx+radius,cy+radius],[cx-radius,cy+radius]]);
    } else if (shapeId === 'crescent') {
      context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2); context.fill();
      context.fillStyle = '#000000';
      context.beginPath();
      context.arc(cx + (variant.offsetX || 35), cy + (variant.offsetY ?? -9), radius * (variant.cutScale || 0.88), 0, Math.PI * 2);
      context.fill();
    } else if (shapeId === 'ring') {
      context.beginPath(); context.arc(cx, cy, radius - 10, 0, Math.PI * 2); context.stroke();
    }
  }

  function normalizePixels(pixels, bounds, sourceWidth) {
    const sourceHeight = bounds.maxY - bounds.minY + 1;
    const cropWidth = bounds.maxX - bounds.minX + 1;
    const crop = new Uint8Array(cropWidth * sourceHeight);
    pixels.forEach(index => {
      const x = index % sourceWidth;
      const y = Math.floor(index / sourceWidth);
      crop[(y - bounds.minY) * cropWidth + (x - bounds.minX)] = 1;
    });
    const scale = Math.min(54 / cropWidth, 54 / sourceHeight);
    const drawWidth = Math.max(2, Math.round(cropWidth * scale));
    const drawHeight = Math.max(2, Math.round(sourceHeight * scale));
    const offsetX = Math.floor((TEMPLATE_SIZE - drawWidth) / 2);
    const offsetY = Math.floor((TEMPLATE_SIZE - drawHeight) / 2);
    const normalized = new Uint8Array(TEMPLATE_SIZE * TEMPLATE_SIZE);
    for (let y = 0; y < drawHeight; y += 1) {
      const sourceY = Math.min(sourceHeight - 1, Math.floor(y * sourceHeight / drawHeight));
      for (let x = 0; x < drawWidth; x += 1) {
        const sourceX = Math.min(cropWidth - 1, Math.floor(x * cropWidth / drawWidth));
        if (crop[sourceY * cropWidth + sourceX]) normalized[(offsetY + y) * TEMPLATE_SIZE + offsetX + x] = 1;
      }
    }
    return normalized;
  }

  function countHoles(mask) {
    const visited = new Uint8Array(mask.length);
    const queue = new Int32Array(mask.length);
    const flood = start => {
      let head = 0;
      let tail = 0;
      let area = 0;
      queue[tail++] = start;
      visited[start] = 1;
      while (head < tail) {
        const index = queue[head++];
        area += 1;
        const x = index % TEMPLATE_SIZE;
        const y = Math.floor(index / TEMPLATE_SIZE);
        const neighbors = [index - 1, index + 1, index - TEMPLATE_SIZE, index + TEMPLATE_SIZE];
        neighbors.forEach((next, direction) => {
          const horizontalWrap = (direction === 0 && x === 0) || (direction === 1 && x === TEMPLATE_SIZE - 1);
          if (!horizontalWrap && next >= 0 && next < mask.length && !mask[next] && !visited[next]) {
            visited[next] = 1;
            queue[tail++] = next;
          }
        });
      }
      return area;
    };
    for (let index = 0; index < mask.length; index += 1) {
      const x = index % TEMPLATE_SIZE;
      const y = Math.floor(index / TEMPLATE_SIZE);
      if ((x === 0 || y === 0 || x === TEMPLATE_SIZE - 1 || y === TEMPLATE_SIZE - 1) && !mask[index] && !visited[index]) flood(index);
    }
    let holes = 0;
    for (let index = 0; index < mask.length; index += 1) {
      if (!mask[index] && !visited[index] && flood(index) > 8) holes += 1;
    }
    return holes;
  }

  function huMoments(mask) {
    let m00 = 0; let m10 = 0; let m01 = 0;
    for (let index = 0; index < mask.length; index += 1) {
      if (!mask[index]) continue;
      const x = index % TEMPLATE_SIZE;
      const y = Math.floor(index / TEMPLATE_SIZE);
      m00 += 1; m10 += x; m01 += y;
    }
    if (!m00) return Array(7).fill(0);
    const cx = m10 / m00;
    const cy = m01 / m00;
    const mu = { 20:0, 2:0, 11:0, 30:0, 3:0, 12:0, 21:0 };
    for (let index = 0; index < mask.length; index += 1) {
      if (!mask[index]) continue;
      const dx = (index % TEMPLATE_SIZE) - cx;
      const dy = Math.floor(index / TEMPLATE_SIZE) - cy;
      mu[20] += dx * dx; mu[2] += dy * dy; mu[11] += dx * dy;
      mu[30] += dx * dx * dx; mu[3] += dy * dy * dy;
      mu[12] += dx * dy * dy; mu[21] += dx * dx * dy;
    }
    const eta = (value, order) => value / Math.pow(m00, 1 + order / 2);
    const n20 = eta(mu[20], 2); const n02 = eta(mu[2], 2); const n11 = eta(mu[11], 2);
    const n30 = eta(mu[30], 3); const n03 = eta(mu[3], 3); const n12 = eta(mu[12], 3); const n21 = eta(mu[21], 3);
    const hu = [
      n20 + n02,
      (n20 - n02) ** 2 + 4 * n11 ** 2,
      (n30 - 3*n12) ** 2 + (3*n21 - n03) ** 2,
      (n30 + n12) ** 2 + (n21 + n03) ** 2,
      (n30 - 3*n12) * (n30 + n12) * ((n30 + n12) ** 2 - 3*(n21 + n03) ** 2) + (3*n21 - n03) * (n21 + n03) * (3*(n30 + n12) ** 2 - (n21 + n03) ** 2),
      (n20 - n02) * ((n30 + n12) ** 2 - (n21 + n03) ** 2) + 4*n11*(n30 + n12)*(n21 + n03),
      (3*n21 - n03) * (n30 + n12) * ((n30 + n12) ** 2 - 3*(n21 + n03) ** 2) - (n30 - 3*n12) * (n21 + n03) * (3*(n30 + n12) ** 2 - (n21 + n03) ** 2)
    ];
    return hu.map(value => value ? -Math.sign(value) * Math.log10(Math.abs(value)) : 0);
  }

  function maskFeatures(mask) {
    let area = 0; let perimeter = 0;
    let minX = TEMPLATE_SIZE; let maxX = 0; let minY = TEMPLATE_SIZE; let maxY = 0;
    const projections = new Float32Array(TEMPLATE_SIZE * 2);
    for (let index = 0; index < mask.length; index += 1) {
      if (!mask[index]) continue;
      const x = index % TEMPLATE_SIZE;
      const y = Math.floor(index / TEMPLATE_SIZE);
      area += 1;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      projections[x] += 1 / TEMPLATE_SIZE;
      projections[TEMPLATE_SIZE + y] += 1 / TEMPLATE_SIZE;
      if (x === 0 || !mask[index - 1]) perimeter += 1;
      if (x === TEMPLATE_SIZE - 1 || !mask[index + 1]) perimeter += 1;
      if (y === 0 || !mask[index - TEMPLATE_SIZE]) perimeter += 1;
      if (y === TEMPLATE_SIZE - 1 || !mask[index + TEMPLATE_SIZE]) perimeter += 1;
    }
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    return {
      mask,
      hu: huMoments(mask),
      projections,
      aspect: width / Math.max(1, height),
      fill: area / Math.max(1, width * height),
      circularity: 4 * Math.PI * area / Math.max(1, perimeter * perimeter),
      holes: countHoles(mask)
    };
  }

  function shiftedMaskDistance(first, second) {
    let bestIoU = 0;
    [-2, 0, 2].forEach(shiftY => {
      [-2, 0, 2].forEach(shiftX => {
        let intersection = 0;
        let union = 0;
        for (let y = 0; y < TEMPLATE_SIZE; y += 1) {
          for (let x = 0; x < TEMPLATE_SIZE; x += 1) {
            const a = first[y * TEMPLATE_SIZE + x];
            const bx = x - shiftX;
            const by = y - shiftY;
            const b = bx >= 0 && by >= 0 && bx < TEMPLATE_SIZE && by < TEMPLATE_SIZE ? second[by * TEMPLATE_SIZE + bx] : 0;
            if (a && b) intersection += 1;
            if (a || b) union += 1;
          }
        }
        if (union) bestIoU = Math.max(bestIoU, intersection / union);
      });
    });
    return 1 - bestIoU;
  }

  function featureDistanceForVariant(detected, templateFeatures, hue, template) {
    const mask = shiftedMaskDistance(detected.mask, templateFeatures.mask);
    let projection = 0;
    for (let index = 0; index < detected.projections.length; index += 1) projection += Math.abs(detected.projections[index] - templateFeatures.projections[index]);
    projection /= detected.projections.length;
    let hu = 0;
    for (let index = 0; index < detected.hu.length; index += 1) hu += Math.min(1, Math.abs(detected.hu[index] - templateFeatures.hu[index]) / 6);
    hu /= detected.hu.length;
    const aspect = Math.min(1, Math.abs(Math.log(detected.aspect / templateFeatures.aspect)) / 0.75);
    const fill = Math.min(1, Math.abs(detected.fill - templateFeatures.fill) / 0.5);
    const circularity = Math.min(1, Math.abs(detected.circularity - templateFeatures.circularity) / 0.45);
    const rawHue = Math.abs(hue - template.hue);
    const hueDistance = Math.min(rawHue, 360 - rawHue) / 180;
    const holes = detected.holes === templateFeatures.holes ? 0 : (template.id === 'ring' ? 0.38 : 0.22);
    return mask * 0.47 + projection * 0.14 + hu * 0.08 + aspect * 0.08 + fill * 0.05 + circularity * 0.05 + hueDistance * 0.13 + holes;
  }

  function featureDistance(detected, template, hue) {
    return Math.min(...template.variants.map(variant => featureDistanceForVariant(detected, variant, hue, template)));
  }

  function classifyFeatures(features, hue, requestedId = '') {
    const results = templates.map(template => ({
      id: template.id,
      name: template.name,
      score: featureDistance(features, template, hue)
    })).sort((first, second) => first.score - second.score);
    let best = results[0] || null;
    if (!best) return null;
    const requested = requestedId ? results.find(result => result.id === requestedId) : null;
    if (requested && requested.score <= 0.5 && requested.score <= best.score + 0.075) best = requested;
    best.confidence = Math.max(35, Math.min(99, Math.round(100 - best.score * 115)));
    best.accepted = best.score <= 0.5 && best.confidence >= 42;
    return best;
  }

  function templateVariants(shapeId) {
    if (shapeId === 'hexagon') return [{}, { rotation: Math.PI / 6 }, { rotation: -Math.PI / 6 }];
    if (shapeId === 'octagon') return [{}, { rotation: Math.PI / 8 }, { rotation: -Math.PI / 8 }];
    if (shapeId === 'crescent') return [
      {},
      { offsetX: 28, offsetY: -6, cutScale: 0.84 },
      { offsetX: 42, offsetY: -10, cutScale: 0.92 }
    ];
    return [{}];
  }

  function buildTemplates() {
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 220;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    templates = SHAPES.map(shape => {
      const variants = templateVariants(shape.id).map(variant => {
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawTemplateShape(context, shape.id, variant);
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const pixels = [];
        const bounds = { minX: canvas.width, maxX: 0, minY: canvas.height, maxY: 0 };
        for (let index = 0; index < canvas.width * canvas.height; index += 1) {
          if (data[index * 4] < 128) continue;
          const x = index % canvas.width;
          const y = Math.floor(index / canvas.width);
          pixels.push(index);
          bounds.minX = Math.min(bounds.minX, x); bounds.maxX = Math.max(bounds.maxX, x);
          bounds.minY = Math.min(bounds.minY, y); bounds.maxY = Math.max(bounds.maxY, y);
        }
        return maskFeatures(normalizePixels(pixels, bounds, canvas.width));
      });
      return { ...shape, variants };
    });
    const passed = templates.filter(template => template.variants.every(variant => classifyFeatures(variant, template.hue)?.id === template.id)).length;
    cameraStatus.dataset.visionSelfTest = `${passed}/${templates.length}`;
    cameraStatus.textContent = passed === templates.length ? 'Preparado' : 'Detector ajustado';
  }

  function refineBinary(binary) {
    const refined = new Uint8Array(binary.length);
    for (let y = 1; y < ANALYSIS_SIZE - 1; y += 1) {
      for (let x = 1; x < ANALYSIS_SIZE - 1; x += 1) {
        let neighbors = 0;
        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) neighbors += binary[(y + offsetY) * ANALYSIS_SIZE + x + offsetX];
        }
        if (neighbors >= 4) refined[y * ANALYSIS_SIZE + x] = 1;
      }
    }
    return refined;
  }

  function findVisualComponent(binary, hues, hueWeights) {
    const visited = new Uint8Array(binary.length);
    const queue = new Int32Array(binary.length);
    let best = null;
    for (let start = 0; start < binary.length; start += 1) {
      if (!binary[start] || visited[start]) continue;
      let head = 0;
      let tail = 0;
      let sumX = 0;
      let sumY = 0;
      let hueX = 0;
      let hueY = 0;
      let hueSamples = 0;
      const pixels = [];
      const bounds = { minX: ANALYSIS_SIZE, maxX: 0, minY: ANALYSIS_SIZE, maxY: 0 };
      queue[tail++] = start;
      visited[start] = 1;
      while (head < tail) {
        const index = queue[head++];
        const x = index % ANALYSIS_SIZE;
        const y = Math.floor(index / ANALYSIS_SIZE);
        pixels.push(index);
        sumX += x; sumY += y;
        if (hueWeights[index]) {
          hueX += Math.cos(hues[index] * Math.PI / 180);
          hueY += Math.sin(hues[index] * Math.PI / 180);
          hueSamples += 1;
        }
        bounds.minX = Math.min(bounds.minX, x); bounds.maxX = Math.max(bounds.maxX, x);
        bounds.minY = Math.min(bounds.minY, y); bounds.maxY = Math.max(bounds.maxY, y);
        const neighbors = [index - 1, index + 1, index - ANALYSIS_SIZE, index + ANALYSIS_SIZE];
        neighbors.forEach((next, direction) => {
          const wraps = (direction === 0 && x === 0) || (direction === 1 && x === ANALYSIS_SIZE - 1);
          if (!wraps && next >= 0 && next < binary.length && binary[next] && !visited[next]) {
            visited[next] = 1;
            queue[tail++] = next;
          }
        });
      }
      const areaRatio = pixels.length / binary.length;
      const width = bounds.maxX - bounds.minX + 1;
      const height = bounds.maxY - bounds.minY + 1;
      const aspect = width / Math.max(1, height);
      const centerX = sumX / pixels.length;
      const centerY = sumY / pixels.length;
      const distance = Math.hypot(centerX - ANALYSIS_SIZE / 2, centerY - ANALYSIS_SIZE / 2) / (ANALYSIS_SIZE * 0.71);
      const touchesEdge = bounds.minX < 3 || bounds.minY < 3 || bounds.maxX > ANALYSIS_SIZE - 4 || bounds.maxY > ANALYSIS_SIZE - 4;
      const valid = areaRatio > 0.018 && areaRatio < 0.62 && aspect > 0.25 && aspect < 3.7 && !touchesEdge;
      const candidateScore = areaRatio * 2.2 - distance * 0.72;
      if (valid && (!best || candidateScore > best.score)) {
        let hue = null;
        if (hueSamples) {
          hue = Math.atan2(hueY, hueX) * 180 / Math.PI;
          if (hue < 0) hue += 360;
        }
        best = { pixels, bounds, hue, score: candidateScore };
      }
    }
    return best;
  }

  function detectShapeInFrame() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return null;
    const cropSize = Math.min(width, height) * 0.72;
    analysisContext.drawImage(video, (width - cropSize) / 2, (height - cropSize) / 2, cropSize, cropSize, 0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE);
    const frame = analysisContext.getImageData(0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE).data;
    const binary = new Uint8Array(ANALYSIS_SIZE * ANALYSIS_SIZE);
    const hues = new Float32Array(binary.length);
    const hueWeights = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      const red = frame[index * 4];
      const green = frame[index * 4 + 1];
      const blue = frame[index * 4 + 2];
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const saturation = max ? (max - min) / max : 0;
      const brightness = max / 255;
      hues[index] = rgbHue(red, green, blue);
      const coloredInterior = saturation > 0.16 && brightness > 0.1 && brightness < 0.985;
      const darkOutline = brightness < 0.3;
      if (coloredInterior || darkOutline) binary[index] = 1;
      if (coloredInterior) hueWeights[index] = 1;
    }
    const component = findVisualComponent(refineBinary(binary), hues, hueWeights);
    if (!component) return null;
    const normalized = normalizePixels(component.pixels, component.bounds, ANALYSIS_SIZE);
    return classifyFeatures(
      maskFeatures(normalized),
      component.hue ?? round[roundIndex]?.hue ?? 0,
      round[roundIndex]?.id || ''
    );
  }

  function scheduleAnalysis() {
    window.clearTimeout(analysisTimer);
    if (scanning) analysisTimer = window.setTimeout(processFrame, 180);
  }

  function processFrame() {
    if (!scanning) return;
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      scheduleAnalysis();
      return;
    }
    try {
      const result = detectShapeInFrame();
      if (!result || !result.accepted) {
        noDetectionFrames += 1;
        stableShapeId = '';
        stableFrames = 0;
        cameraStatus.textContent = 'Analizando';
        cameraStage.classList.remove('detected');
        detectedLabel.textContent = result ? `Ajusta la figura: posible ${result.name}` : 'Buscando una figura...';
        if (noDetectionFrames >= 3) lastEvaluatedId = '';
        scheduleAnalysis();
        return;
      }
      noDetectionFrames = 0;
      cameraStage.classList.add('detected');
      detectedLabel.textContent = `Detectado: ${result.name} · ${result.confidence}%`;
      cameraStatus.textContent = 'Reconociendo';
      if (stableShapeId === result.id) stableFrames += 1;
      else { stableShapeId = result.id; stableFrames = 1; }
      if (!locked && stableFrames >= 4 && lastEvaluatedId !== result.id) {
        stableFrames = 0;
        evaluateShape(result.id);
      }
    } catch (error) {
      cameraStatus.textContent = 'Reintentando';
      detectedLabel.textContent = 'Ajusta la luz y centra la figura';
    }
    scheduleAnalysis();
  }

  async function toggleCamera() {
    if (stream) {
      stopCamera();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setFeedback('Este navegador no permite utilizar la cámara.', 'error');
      return;
    }
    try {
      cameraStatus.textContent = 'Abriendo';
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      video.srcObject = stream;
      await video.play();
      scanning = true;
      cameraStage.classList.add('streaming');
      cameraStatus.textContent = 'Analizando';
      cameraStatus.classList.add('active');
      cameraButton.textContent = '■ Detener cámara';
      detectedLabel.textContent = 'Buscando una figura...';
      setFeedback(`Centra ${round[roundIndex].name} dentro del marco y mantenla quieta.`, 'neutral');
      speak(`Cámara lista. Muestra la figura ${round[roundIndex].name}.`);
      scheduleAnalysis();
    } catch (error) {
      setFeedback('No se pudo abrir la cámara. Revisa el permiso e inténtalo otra vez.', 'error');
      cameraStatus.textContent = 'Sin acceso';
    }
  }

  function stopCamera(preserveFeedback = false) {
    scanning = false;
    window.clearTimeout(analysisTimer);
    if (stream) stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    cameraStage.classList.remove('streaming', 'detected');
    cameraStatus.textContent = 'Preparado';
    cameraStatus.classList.remove('active');
    cameraButton.textContent = '▶ Iniciar cámara';
    detectedLabel.textContent = 'Buscando figura...';
    if (!preserveFeedback) setFeedback('Cámara detenida. Puedes iniciarla cuando estés listo.', 'neutral');
  }

  cameraButton.addEventListener('click', toggleCamera);
  repeatButton.addEventListener('click', () => round[roundIndex] && speak(`Busca y muestra la figura ${round[roundIndex].name} frente a la cámara.`));
  newRoundButton.addEventListener('click', () => newRound(Boolean(stream)));
  voiceButton.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    voiceButton.setAttribute('aria-pressed', String(voiceEnabled));
    voiceButton.textContent = voiceEnabled ? '🔊 Voz activada' : '🔇 Voz silenciada';
    if (!voiceEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  });
  window.addEventListener('beforeunload', () => stopCamera(true));

  renderCatalog();
  buildTemplates();
  newRound(false);
}());
