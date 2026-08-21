(function () {
  'use strict';

  const ORGANS = [
    { id:'brain', name:'Cerebro', icon:'🧠', x:50, y:10, location:'Dentro del cráneo', description:'El cerebro está protegido por el cráneo y dirige los pensamientos, los recuerdos, los sentidos, las emociones y los movimientos del cuerpo.', importance:'Es el centro de control del organismo. Recibe información, toma decisiones y envía mensajes por los nervios para coordinar casi todo lo que hacemos.', fact:'Aunque pesa cerca de un kilo y medio en una persona adulta, utiliza mucha energía para trabajar sin descanso.' },
    { id:'lungs', name:'Pulmones', icon:'🫁', x:50, y:32, location:'A ambos lados del tórax', description:'Los pulmones son dos órganos esponjosos ubicados dentro del pecho. Al inhalar reciben aire y pasan oxígeno a la sangre; al exhalar eliminan dióxido de carbono.', importance:'El oxígeno que incorporan permite que las células produzcan energía. Sin ese intercambio de gases, los músculos y el cerebro no podrían funcionar.', fact:'El pulmón derecho suele ser un poco más grande que el izquierdo, porque el corazón ocupa espacio hacia el lado izquierdo.' },
    { id:'heart', name:'Corazón', icon:'🫀', x:54, y:36.5, location:'Centro del tórax, un poco a la izquierda', description:'El corazón es un músculo hueco situado entre los pulmones y ligeramente hacia el lado izquierdo de la persona. Se contrae para impulsar la sangre.', importance:'Mantiene la circulación: lleva oxígeno y nutrientes a todo el cuerpo y recoge sustancias que deben ser eliminadas.', fact:'Tiene aproximadamente el tamaño del puño de la persona y late durante todo el día, incluso mientras duerme.' },
    { id:'liver', name:'Hígado', icon:'🟤', x:43, y:44, location:'Parte superior derecha del abdomen', description:'El hígado se encuentra debajo de las costillas del lado derecho de la persona, que aparece a tu izquierda cuando la miras de frente.', importance:'Procesa nutrientes, almacena energía, fabrica sustancias necesarias para la digestión y ayuda a limpiar la sangre de compuestos dañinos.', fact:'Es el órgano interno sólido más grande y puede recuperar parte de su tamaño después de una lesión.' },
    { id:'stomach', name:'Estómago', icon:'◒', x:59, y:46, location:'Parte superior izquierda del abdomen', description:'El estómago es una bolsa muscular situada debajo de las costillas izquierdas. Recibe la comida del esófago y la mezcla con jugos digestivos.', importance:'Inicia una parte importante de la digestión, desarmando los alimentos para que luego el intestino pueda absorber sus nutrientes.', fact:'Sus paredes se mueven y mezclan la comida hasta transformarla en una sustancia semilíquida.' },
    { id:'kidneys', name:'Riñones', icon:'🫘', x:50, y:50.5, location:'Zona posterior alta del abdomen', description:'Los riñones son dos órganos con forma de frijol. Están a ambos lados de la columna, detrás de otros órganos abdominales; en este mapa frontal se muestran juntos.', importance:'Filtran la sangre, eliminan desechos mediante la orina y ayudan a mantener el equilibrio de agua, sales y presión arterial.', fact:'Cada riñón contiene muchísimos filtros microscópicos llamados nefronas.' },
    { id:'small-intestine', name:'Intestino delgado', icon:'〰', x:52, y:58, location:'Centro y parte baja del abdomen', description:'El intestino delgado es un tubo largo y enrollado que continúa después del estómago. Ocupa gran parte del centro del abdomen.', importance:'Aquí se absorbe la mayor parte de las vitaminas, minerales, proteínas, grasas y azúcares que el cuerpo obtiene de los alimentos.', fact:'Su interior tiene pliegues y pequeñas vellosidades que aumentan mucho la superficie para absorber nutrientes.' },
    { id:'large-intestine', name:'Intestino grueso', icon:'▣', x:43, y:60, location:'Rodea al intestino delgado', description:'El intestino grueso forma un marco alrededor del intestino delgado y termina en el recto. Recibe los restos que el cuerpo ya no necesita.', importance:'Absorbe agua y algunas sales, alberga microorganismos útiles y forma los desechos sólidos para poder eliminarlos.', fact:'Es más corto que el intestino delgado, pero se llama grueso porque su diámetro es mayor.' }
  ];

  const bodyBoard = document.getElementById('bodyBoard');
  const organTitle = document.getElementById('organTitle');
  const organIcon = document.getElementById('organIcon');
  const organLocation = document.getElementById('organLocation');
  const organDescription = document.getElementById('organDescription');
  const organImportance = document.getElementById('organImportance');
  const organFact = document.getElementById('organFact');
  const organList = document.getElementById('organList');
  const listenButton = document.getElementById('listenButton');
  const voiceButton = document.getElementById('voiceButton');
  const discoveredCount = document.getElementById('discoveredCount');
  const progressFill = document.getElementById('progressFill');
  const selectionStatus = document.getElementById('selectionStatus');
  const video = document.getElementById('video');
  const canvas = document.getElementById('handCanvas');
  const context = canvas.getContext('2d');
  const cameraStage = document.querySelector('.camera-stage');
  const cameraButton = document.getElementById('cameraButton');
  const cameraFeedback = document.getElementById('cameraFeedback');
  const virtualPointer = document.getElementById('virtualPointer');

  let selectedOrgan = null;
  let discovered = new Set();
  let voiceEnabled = true;
  let handsModel = null;
  let camera = null;
  let cameraRunning = false;
  let hoverOrganId = null;
  let hoverStartedAt = 0;
  let lastCameraSelection = 0;
  let celebrationShown = false;
  const BODY_REFERENCE_RATIO = 1122 / 1402;

  function speakOrgan(organ) {
    if (!voiceEnabled || !organ) return;
    window.OsmoVoice?.speak(`${organ.name}. ${organ.location}. ${organ.description} Es importante porque ${organ.importance}`, { rate: 0.88 });
  }

  function updateProgress() {
    discoveredCount.textContent = `${discovered.size}/${ORGANS.length}`;
    progressFill.style.width = `${(discovered.size / ORGANS.length) * 100}%`;
  }

  function celebrateAllOrgans() {
    if (celebrationShown || discovered.size < ORGANS.length) return;
    celebrationShown = true;
    selectionStatus.textContent = '¡Todos los órganos descubiertos!';
    window.setTimeout(() => {
      if (cameraRunning) stopCamera();
      window.AppCelebration?.show({
        activity: 'Descubre el Cuerpo Humano',
        icon: '♥',
        message: `Descubriste los ${ORGANS.length} órganos y aprendiste por qué cada uno es importante.`,
        speak: false
      });
    }, 650);
  }

  function selectOrgan(organId, announce = true) {
    const organ = ORGANS.find(item => item.id === organId);
    if (!organ) return;
    selectedOrgan = organ;
    discovered.add(organ.id);
    organIcon.textContent = organ.icon;
    organTitle.textContent = organ.name;
    organLocation.textContent = organ.location;
    organDescription.textContent = organ.description;
    organImportance.textContent = organ.importance;
    organFact.textContent = organ.fact;
    listenButton.disabled = false;
    selectionStatus.textContent = `${organ.name} seleccionado`;
    document.querySelectorAll('[data-organ]').forEach(element => {
      element.classList.toggle('active', element.dataset.organ === organ.id);
      element.classList.toggle('discovered', discovered.has(element.dataset.organ));
    });
    updateProgress();
    if (announce) speakOrgan(organ);
    celebrateAllOrgans();
  }

  function renderOrganList() {
    organList.innerHTML = ORGANS.map(organ => `<button type="button" data-organ="${organ.id}"><span>${organ.icon}</span>${organ.name}</button>`).join('');
    document.querySelectorAll('[data-organ]').forEach(button => button.addEventListener('click', () => selectOrgan(button.dataset.organ, true)));
  }

  function nearestOrgan(xPercent, yPercent) {
    let nearest = null;
    let nearestDistance = Infinity;
    ORGANS.forEach(organ => {
      const distance = Math.hypot(xPercent - organ.x, yPercent - organ.y);
      if (distance < nearestDistance) {
        nearest = organ;
        nearestDistance = distance;
      }
    });
    return nearestDistance <= 8 ? nearest : null;
  }

  function cameraGuideBounds(width, height) {
    const guideWidth = Math.min(width, height * BODY_REFERENCE_RATIO);
    const guideHeight = guideWidth / BODY_REFERENCE_RATIO;
    return {
      left: (width - guideWidth) / 2,
      top: (height - guideHeight) / 2,
      width: guideWidth,
      height: guideHeight
    };
  }

  function drawCameraTargets(width, height, activeOrganId = null) {
    const guide = cameraGuideBounds(width, height);
    ORGANS.forEach(organ => {
      const x = guide.left + organ.x * guide.width / 100;
      const y = guide.top + organ.y * guide.height / 100;
      const active = organ.id === activeOrganId;
      const radius = active ? 21 : 16;

      context.beginPath();
      context.arc(x, y, radius + 4, 0, Math.PI * 2);
      context.strokeStyle = 'rgba(255,255,255,.96)';
      context.lineWidth = 7;
      context.stroke();

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = active ? 'rgba(239,101,75,.72)' : 'rgba(23,107,67,.38)';
      context.fill();
      context.strokeStyle = active ? '#ef654b' : '#f7c844';
      context.lineWidth = active ? 5 : 3;
      context.stroke();

      context.fillStyle = '#ffffff';
      context.font = `700 ${active ? 20 : 17}px "Segoe UI", Arial, sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(organ.icon, x, y + 1);
    });
  }

  function drawHandTracking(landmarks, width) {
    if (typeof window.drawConnectors !== 'function') return;
    context.save();
    context.translate(width, 0);
    context.scale(-1, 1);
    window.drawConnectors(context, landmarks, window.HAND_CONNECTIONS, { color:'#f7c844', lineWidth:5 });
    window.drawLandmarks(context, landmarks, { color:'#ef654b', lineWidth:2, radius:5 });
    context.restore();
  }

  function drawFingerPointer(x, y) {
    context.beginPath();
    context.arc(x, y, 13, 0, Math.PI * 2);
    context.fillStyle = '#ef654b';
    context.fill();
    context.strokeStyle = '#ffffff';
    context.lineWidth = 5;
    context.stroke();
  }

  function onHandResults(results) {
    if (!cameraRunning) return;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    context.clearRect(0, 0, width, height);
    const landmarks = results.multiHandLandmarks?.[0];
    if (!landmarks) {
      drawCameraTargets(width, height);
      virtualPointer.style.display = 'none';
      hoverOrganId = null;
      cameraFeedback.textContent = 'No veo una mano. Muestra el dedo índice frente a la cámara.';
      return;
    }
    const tip = landmarks[8];
    const fingerX = (1 - tip.x) * width;
    const fingerY = tip.y * height;
    const guide = cameraGuideBounds(width, height);
    const xPercent = (fingerX - guide.left) * 100 / guide.width;
    const yPercent = (fingerY - guide.top) * 100 / guide.height;
    const nearby = nearestOrgan(xPercent, yPercent);
    drawCameraTargets(width, height, nearby?.id);
    drawHandTracking(landmarks, width);
    drawFingerPointer(fingerX, fingerY);
    virtualPointer.style.display = 'block';
    virtualPointer.style.left = `${Math.max(0, Math.min(100, xPercent))}%`;
    virtualPointer.style.top = `${Math.max(0, Math.min(100, yPercent))}%`;
    if (!nearby) {
      hoverOrganId = null;
      cameraFeedback.textContent = 'Mueve el índice hasta uno de los órganos del mapa.';
      return;
    }
    cameraFeedback.textContent = `Mantén el dedo sobre ${nearby.name}.`;
    if (hoverOrganId !== nearby.id) {
      hoverOrganId = nearby.id;
      hoverStartedAt = Date.now();
      return;
    }
    if (Date.now() - hoverStartedAt >= 850 && Date.now() - lastCameraSelection >= 1800) {
      lastCameraSelection = Date.now();
      selectOrgan(nearby.id, true);
    }
  }

  async function toggleCamera() {
    if (cameraRunning) {
      stopCamera();
      return;
    }
    if (typeof window.Hands !== 'function' || typeof window.Camera !== 'function') {
      cameraFeedback.textContent = 'No se pudo cargar el detector de manos. Revisa la conexión y recarga.';
      return;
    }
    try {
      handsModel = new window.Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      handsModel.setOptions({ maxNumHands:1, modelComplexity:1, minDetectionConfidence:.55, minTrackingConfidence:.5 });
      handsModel.onResults(onHandResults);
      await handsModel.initialize();
      cameraRunning = true;
      camera = new window.Camera(video, { width:640, height:480, onFrame:async () => cameraRunning && handsModel && handsModel.send({ image:video }) });
      await camera.start();
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      drawCameraTargets(canvas.width, canvas.height);
      cameraStage.classList.add('streaming');
      cameraButton.textContent = '■ Detener cámara';
      cameraFeedback.textContent = 'Ubícate con la silueta translúcida y mueve el índice hasta uno de los círculos.';
    } catch (error) {
      cameraRunning = false;
      cameraFeedback.textContent = 'No se pudo abrir la cámara. Revisa el permiso e inténtalo otra vez.';
    }
  }

  function stopCamera() {
    cameraRunning = false;
    if (camera) camera.stop();
    camera = null;
    if (handsModel) handsModel.close();
    handsModel = null;
    video.srcObject = null;
    context.clearRect(0,0,canvas.width,canvas.height);
    cameraStage.classList.remove('streaming');
    cameraButton.textContent = '▶ Activar cámara';
    virtualPointer.style.display = 'none';
  }

  listenButton.addEventListener('click', () => speakOrgan(selectedOrgan));
  voiceButton.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    voiceButton.setAttribute('aria-pressed', String(voiceEnabled));
    voiceButton.textContent = voiceEnabled ? '🔊 Voz activada' : '🔇 Voz silenciada';
    if (!voiceEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  });
  cameraButton.addEventListener('click', toggleCamera);
  window.addEventListener('beforeunload', stopCamera);
  renderOrganList();
  updateProgress();
}());
