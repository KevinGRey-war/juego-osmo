const ANIMAL_CATALOG = [
  {
    id: 'leon', code: 'ANIMAL-LEON', nombre: 'León', emoji: '🦁', puntos: 10,
    adivinanza: 'Tengo una gran melena, soy fuerte y mi rugido se escucha desde muy lejos.',
    introduccion: 'El león es un gran felino africano que vive en manadas y se comunica mediante potentes rugidos.',
    tipo: 'Mamífero', habitat: 'Sabanas y pastizales', alimentacion: 'Carnívoro', region: 'África',
    descripcion: 'El león es un mamífero y uno de los felinos más grandes del mundo. Tiene patas fuertes, dientes afilados y, en muchos machos, una gran melena alrededor de la cabeza. La mayoría vive en las sabanas de África, en grupos familiares llamados manadas. Es carnívoro y se comunica con rugidos que pueden escucharse desde muy lejos. Los cachorros aprenden a correr, acechar y convivir mientras juegan con los demás miembros de la manada.',
    habilidad: 'Su poderoso rugido le permite comunicarse con la manada a varios kilómetros de distancia.',
    videoId: 'OMkEVX23BdM', videoInicio: 12, videoFin: 52, videoFuente: 'Nat Geo Animals', videoTitulo: 'Lions 101 | Nat Geo Wild',
    datosCuriosos: ['Su rugido puede escucharse a varios kilómetros.', 'Los leones viven en grupos llamados manadas.', 'Descansan muchas horas para conservar energía.']
  },
  {
    id: 'elefante', code: 'ANIMAL-ELEFANTE', nombre: 'Elefante', emoji: '🐘', puntos: 10,
    adivinanza: 'Soy enorme, tengo orejas grandes y una larga trompa para beber agua.',
    introduccion: 'El elefante es un mamífero muy inteligente y sociable que utiliza su trompa como una herramienta extraordinaria.',
    tipo: 'Mamífero', habitat: 'Sabanas, bosques y humedales', alimentacion: 'Herbívoro', region: 'África y Asia',
    descripcion: 'El elefante es el animal terrestre más grande del planeta. Su trompa funciona como nariz y como mano: le sirve para respirar, beber agua, oler y levantar objetos. Come hierba, hojas, frutos y corteza, por eso es herbívoro. Vive en familias que se cuidan entre sí y suelen estar guiadas por una hembra adulta. Sus grandes orejas le ayudan a refrescarse y sus sonidos graves le permiten comunicarse con otros elefantes a gran distancia.',
    habilidad: 'Su trompa es una herramienta extraordinaria que usa para beber, respirar, oler, tocar y levantar objetos.',
    videoId: 'Aw6GkiCvcWs', videoInicio: 10, videoFin: 50, videoFuente: 'Nat Geo Animals', videoTitulo: 'Elephants 101 | Nat Geo Wild',
    datosCuriosos: ['Es el animal terrestre más grande.', 'Usa su trompa para respirar, beber y tomar objetos.', 'Los elefantes se comunican con sonidos muy graves.']
  },
  {
    id: 'jirafa', code: 'ANIMAL-JIRAFA', nombre: 'Jirafa', emoji: '🦒', puntos: 10, genero: 'f',
    adivinanza: 'Mi cuello es muy largo y alcanzo las hojas que están en lo alto de los árboles.',
    introduccion: 'La jirafa es un mamífero africano de gran altura que se alimenta principalmente de hojas de los árboles.',
    tipo: 'Mamífero', habitat: 'Sabanas arboladas', alimentacion: 'Herbívoro', region: 'África',
    descripcion: 'La jirafa es el animal más alto del mundo y puede mirar por encima de muchos árboles. Su cuello largo y su lengua resistente le permiten alcanzar y arrancar hojas de las ramas más altas. Es herbívora y vive en las sabanas arboladas de África. Cada jirafa tiene un dibujo de manchas diferente, parecido a una huella digital. Sus crías nacen muy altas y, poco después de nacer, ya pueden ponerse de pie y caminar junto a su madre.',
    habilidad: 'Su cuello y su larga lengua le permiten comer hojas que están fuera del alcance de otros animales.',
    videoId: 'P_ckAbOr0r4', videoInicio: 8, videoFin: 48, videoFuente: 'Nat Geo Animals', videoTitulo: 'Giraffes 101 | Nat Geo Wild',
    datosCuriosos: ['Es el animal más alto del mundo.', 'Su lengua puede medir cerca de medio metro.', 'Cada jirafa tiene un patrón de manchas diferente.']
  },
  {
    id: 'mono', code: 'ANIMAL-MONO', nombre: 'Mono', emoji: '🐒', puntos: 10,
    adivinanza: 'Me gusta saltar entre las ramas, soy curioso y puedo usar mis manos para comer.',
    introduccion: 'El mono es un animal ágil, curioso y social que suele vivir en grupos y desplazarse entre los árboles.',
    tipo: 'Mamífero primate', habitat: 'Bosques y selvas', alimentacion: 'Omnívoro', region: 'África, Asia y América',
    descripcion: 'Los monos son mamíferos primates muy curiosos que viven en distintas selvas y bosques del mundo. Sus manos pueden sujetar ramas y alimentos, y muchas especies usan la cola para mantener el equilibrio. Suelen vivir en grupos y se comunican mediante sonidos, gestos y expresiones del rostro. Según la especie, comen frutas, hojas, semillas, huevos o insectos. Algunos monos incluso aprenden a utilizar piedras o ramas como herramientas sencillas.',
    habilidad: 'Aprende observando a sus compañeros y algunas especies pueden utilizar herramientas sencillas.',
    videoId: 'aXSWlwT8sew', videoInicio: 0, videoFin: 40, videoFuente: 'BBC Earth', videoTitulo: 'Madre chimpancé enseña a su bebé a cazar termitas', videoRepetir: true,
    datosCuriosos: ['Muchos monos viven en grupos sociales.', 'Usan sonidos y gestos para comunicarse.', 'Algunas especies utilizan herramientas.']
  },
  {
    id: 'tigre', code: 'ANIMAL-TIGRE', nombre: 'Tigre', emoji: '🐯', puntos: 10,
    adivinanza: 'Soy un gran felino de color naranja y llevo rayas negras por todo el cuerpo.',
    introduccion: 'El tigre es un poderoso felino asiático que vive principalmente en bosques y reconoce su territorio con gran precisión.',
    tipo: 'Mamífero', habitat: 'Bosques, manglares y pastizales', alimentacion: 'Carnívoro', region: 'Asia',
    descripcion: 'El tigre es el felino más grande del mundo y vive en varias regiones de Asia. Su pelaje naranja con rayas negras lo ayuda a esconderse entre la hierba y las sombras del bosque. Es carnívoro, tiene patas muy fuertes y suele acercarse a su presa caminando en silencio. Aunque pertenece a la familia de los gatos, es un excelente nadador y disfruta entrar al agua. Las rayas de cada tigre son únicas, y proteger sus bosques es muy importante para que pueda seguir viviendo en libertad.',
    habilidad: 'Sus rayas funcionan como camuflaje y lo ayudan a moverse sin ser visto entre la vegetación.',
    videoId: 'FK3dav4bA4s', videoInicio: 10, videoFin: 50, videoFuente: 'National Geographic', videoTitulo: 'Tigres 101 | National Geographic',
    datosCuriosos: ['Cada tigre tiene rayas únicas.', 'Es un excelente nadador.', 'Puede ver mejor que las personas durante la noche.']
  },
  {
    id: 'cebra', code: 'ANIMAL-CEBRA', nombre: 'Cebra', emoji: '🦓', puntos: 10, genero: 'f',
    adivinanza: 'Me parezco a un caballo, pero visto un traje de rayas blancas y negras.',
    introduccion: 'La cebra es un herbívoro africano que vive en manadas y se distingue por su singular pelaje de rayas.',
    tipo: 'Mamífero', habitat: 'Sabanas y pastizales', alimentacion: 'Herbívoro', region: 'África',
    descripcion: 'La cebra es un mamífero de la familia de los caballos que vive en las sabanas de África. Se alimenta principalmente de hierba, por eso es herbívora. Sus rayas blancas y negras son diferentes en cada individuo y le sirven para reconocerse dentro de la manada. Las cebras viven en grupos para vigilar el peligro y proteger mejor a sus crías. También se comunican con sonidos, movimientos de las orejas y distintas posiciones del cuerpo.',
    habilidad: 'Su dibujo de rayas es único y permite que las demás cebras la reconozcan dentro de la manada.',
    videoId: 'U1Ysr2DKHFI', videoInicio: 10, videoFin: 50, videoFuente: 'BBC Earth', videoTitulo: 'El viaje de una cebra por la naturaleza salvaje',
    datosCuriosos: ['Ninguna cebra tiene exactamente las mismas rayas.', 'Viven y se protegen en manadas.', 'Pueden correr poco después de nacer.']
  },
  {
    id: 'oso', code: 'ANIMAL-OSO', nombre: 'Oso', emoji: '🐻', puntos: 10,
    adivinanza: 'Tengo mucho pelo, patas fuertes y un olfato excelente para encontrar alimento.',
    introduccion: 'El oso es un mamífero fuerte y de abundante pelaje que habita bosques, montañas y regiones frías.',
    tipo: 'Mamífero', habitat: 'Bosques, montañas y tundra', alimentacion: 'Omnívoro', region: 'América, Europa y Asia',
    descripcion: 'Los osos son mamíferos grandes y fuertes, cubiertos por un pelaje que los protege del frío. Tienen garras, patas poderosas y un olfato mucho mejor que el de las personas. Según la especie, pueden comer frutos, raíces, insectos, peces y otros animales. Algunos osos descansan durante gran parte del invierno para ahorrar energía cuando hay poco alimento. Las madres protegen y enseñan a sus oseznos hasta que pueden buscar comida por sí mismos.',
    habilidad: 'Su extraordinario olfato le ayuda a encontrar comida aunque esté muy lejos o escondida.',
    videoId: 'aAfXsxLSblM', videoInicio: 12, videoFin: 52, videoFuente: 'BBC Earth', videoTitulo: 'En el mundo de los osos | BBC Earth',
    datosCuriosos: ['Su olfato es extraordinariamente sensible.', 'Muchos osos son buenos nadadores.', 'Su alimentación cambia según la especie y el lugar.']
  },
  {
    id: 'pinguino', code: 'ANIMAL-PINGUINO', nombre: 'Pingüino', emoji: '🐧', puntos: 10,
    adivinanza: 'Llevo traje blanco y negro, camino balanceándome y nado aunque no puedo volar.',
    introduccion: 'El pingüino es un ave marina que no vuela, pero nada con enorme habilidad usando sus alas como aletas.',
    tipo: 'Ave marina', habitat: 'Costas e islas frías', alimentacion: 'Carnívoro', region: 'Hemisferio sur',
    descripcion: 'El pingüino es un ave marina que no puede volar por el aire, pero nada con gran rapidez. Sus alas tienen forma de aletas y le ayudan a perseguir peces, calamares y pequeños animales llamados kril. Su plumaje impermeable y una capa de grasa mantienen su cuerpo caliente en el agua fría. Vive en el hemisferio sur y muchas especies forman colonias con miles de compañeros. Las madres y los padres colaboran para cuidar los huevos y alimentar a sus polluelos.',
    habilidad: 'Sus alas funcionan como aletas y lo convierten en un nadador rápido y ágil bajo el agua.',
    videoId: 'q3uXXh1sHcI', videoInicio: 0, videoFin: 40, videoFuente: 'BBC Earth', videoTitulo: 'Pingüino bebé intenta hacer amigos', videoRepetir: true,
    datosCuriosos: ['Sus alas funcionan como aletas bajo el agua.', 'Vive en colonias con muchos compañeros.', 'Su plumaje lo protege del agua fría.']
  },
  {
    id: 'panda', code: 'ANIMAL-PANDA', nombre: 'Panda', emoji: '🐼', puntos: 10,
    adivinanza: 'Soy blanco y negro, tengo orejas redondas y mi comida favorita es el bambú.',
    introduccion: 'El panda gigante es un oso originario de China, conocido por su pelaje blanco y negro y su gusto por el bambú.',
    tipo: 'Mamífero', habitat: 'Bosques de bambú', alimentacion: 'Herbívoro', region: 'China',
    descripcion: 'El panda gigante es un oso de pelaje blanco y negro que vive en los bosques montañosos de China. Casi toda su alimentación está formada por bambú, así que pasa muchas horas del día comiendo tallos y hojas. Tiene un hueso especial en la pata que funciona como un pulgar y le ayuda a sujetar el bambú. También puede trepar árboles y descansar sobre las ramas. Cuidar los bosques donde crece el bambú es esencial para que los pandas puedan vivir y criar a sus pequeños en libertad.',
    habilidad: 'Posee un hueso especial parecido a un pulgar con el que sostiene firmemente los tallos de bambú.',
    videoId: 'W95eN5gXUfs', videoInicio: 10, videoFin: 50, videoFuente: 'Bestias Bichos y Anfibios', videoTitulo: 'La Vida de los Osos Panda (Mini Documental)',
    datosCuriosos: ['Pasa gran parte del día comiendo bambú.', 'Tiene un hueso especial que funciona como pulgar.', 'Al nacer es muy pequeño y de color rosado.']
  },
  {
    id: 'cocodrilo', code: 'ANIMAL-COCODRILO', nombre: 'Cocodrilo', emoji: '🐊', puntos: 10,
    adivinanza: 'Tengo piel de escamas, una cola larga y una boca grande llena de dientes.',
    introduccion: 'El cocodrilo es un gran reptil semiacuático que vive cerca de ríos y utiliza su poderosa cola para nadar.',
    tipo: 'Reptil', habitat: 'Ríos, lagos y humedales', alimentacion: 'Carnívoro', region: 'Regiones tropicales',
    descripcion: 'El cocodrilo es un reptil de gran tamaño cubierto por escamas duras y resistentes. Vive cerca de ríos, lagos y humedales, y utiliza su larga y poderosa cola para nadar. Es carnívoro y puede esperar casi inmóvil hasta que una presa se acerca. Sus ojos y fosas nasales están en la parte superior de la cabeza, por eso puede mirar y respirar mientras casi todo su cuerpo permanece bajo el agua. Las madres construyen nidos, vigilan los huevos y ayudan a proteger a sus pequeñas crías.',
    habilidad: 'Puede mirar y respirar mientras mantiene casi todo el cuerpo escondido bajo el agua.',
    videoId: '_bVZeOt7bCw', videoInicio: 8, videoFin: 48, videoFuente: 'BBC', videoTitulo: 'Sneaky croc camera captures incredible footage | Spy in the Wild',
    datosCuriosos: ['Puede permanecer casi inmóvil mientras espera.', 'Sus ojos y fosas nasales están sobre la cabeza.', 'Cuida sus huevos y protege a sus crías.']
  }
];

const firebaseConfig = {
  apiKey: 'AIzaSyBTMXFziXEvWyh17t4wEoAenUqwCKdjGGE',
  authDomain: 'chatmiguel-dab9b.firebaseapp.com',
  databaseURL: 'https://chatmiguel-dab9b-default-rtdb.firebaseio.com',
  projectId: 'chatmiguel-dab9b',
  storageBucket: 'chatmiguel-dab9b.appspot.com',
  messagingSenderId: '419114138497',
  appId: '1:419114138497:web:f563f02300c7904cd8c680',
  measurementId: 'G-2E0ZP0EC1X'
};

let db = null;
let auth = null;
let currentUser = null;
let currentAnimal = null;
let mediaStream = null;
let scannerRunning = false;
let processingCode = false;
let lastCode = null;
let usedFacts = {};
let riddleQueue = [];
let currentTarget = null;
let questionIndex = 0;
let gameStarted = false;
let gameComplete = false;
let awaitingNext = false;
let revealedHintCount = 0;
let sessionScore = 0;
let correctCount = 0;
let incorrectCount = 0;
let streak = 0;
let totalAttempts = 0;
let videoPlaybackTimer = null;
const discoveredAnimals = new Set();

const userNameElement = document.getElementById('userName');
const userPointsElement = document.getElementById('userPoints');
const animalImage = document.getElementById('animalImage');
const animalEmoji = document.getElementById('animalEmoji');
const animalName = document.getElementById('animalName');
const animalIntro = document.getElementById('animalIntro');
const animalDetails = document.getElementById('animalDetails');
const animalType = document.getElementById('animalType');
const animalHabitat = document.getElementById('animalHabitat');
const animalDiet = document.getElementById('animalDiet');
const animalRegion = document.getElementById('animalRegion');
const animalDescription = document.getElementById('animalDescription');
const animalAbility = document.getElementById('animalAbility');
const animalFact = document.getElementById('animalFact');
const feedback = document.getElementById('feedback');
const animalSound = document.getElementById('animalSound');
const animalPanel = document.querySelector('.animal-panel');
const videoElement = document.getElementById('qrVideo');
const canvasElement = document.getElementById('qrCanvas');
const canvasContext = canvasElement.getContext('2d', { willReadFrequently: true });
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const scannerStatus = document.getElementById('scannerStatus');
const scannerMessage = document.getElementById('scannerMessage');
const startScannerBtn = document.getElementById('startScannerBtn');
const stopScannerBtn = document.getElementById('stopScannerBtn');
const repeatRiddleBtn = document.getElementById('repeatRiddleBtn');
const extraHintBtn = document.getElementById('extraHintBtn');
const nextRiddleBtn = document.getElementById('nextRiddleBtn');
const soundBtn = document.getElementById('soundBtn');
const hintBtn = document.getElementById('hintBtn');
const animalGuide = document.getElementById('animalGuide');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const sessionPoints = document.getElementById('sessionPoints');
const statCorrect = document.getElementById('statCorrect');
const statIncorrect = document.getElementById('statIncorrect');
const statStreak = document.getElementById('statStreak');
const statAccuracy = document.getElementById('statAccuracy');
const questionCounter = document.getElementById('questionCounter');
const headerQuestionCounter = document.getElementById('headerQuestionCounter');
const resetZooBtn = document.getElementById('resetZooBtn');
const riddleText = document.getElementById('riddleText');
const riddlePrompt = document.getElementById('riddlePrompt');
const riddleExtra = document.getElementById('riddleExtra');
const animalVideoModal = document.getElementById('animalVideoModal');
const animalVideoFrame = document.getElementById('animalVideoFrame');
const videoAnimalTitle = document.getElementById('videoAnimalTitle');
const videoAnimalDescription = document.getElementById('videoAnimalDescription');
const videoAnimalHabitat = document.getElementById('videoAnimalHabitat');
const videoAnimalDiet = document.getElementById('videoAnimalDiet');
const videoAnimalAbility = document.getElementById('videoAnimalAbility');
const videoDuration = document.getElementById('videoDuration');
const videoSourceLink = document.getElementById('videoSourceLink');
const videoReferenceTitle = document.getElementById('videoReferenceTitle');
const videoFinished = document.getElementById('videoFinished');
const animalVideoBackdrop = document.getElementById('animalVideoBackdrop');
const closeAnimalVideoBtn = document.getElementById('closeAnimalVideoBtn');
const videoModalContinueBtn = document.getElementById('videoModalContinueBtn');

function initializeFirebase() {
  if (typeof firebase === 'undefined') {
    setFeedback('Modo local activo. Los QR de animales siguen disponibles.', 'neutral');
    return;
  }

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  auth = firebase.auth();
  auth.onAuthStateChanged(user => {
    currentUser = user || null;
    if (user) {
      loadUserData(user.uid);
    } else {
      userNameElement.textContent = 'Jugador';
      setFeedback('Puedes descubrir animales. Inicia sesión para guardar tus puntos.', 'neutral');
    }
  });
}

function renderAnimalGuide() {
  animalGuide.innerHTML = '';
  ANIMAL_CATALOG.forEach(animal => {
    const item = document.createElement('div');
    item.className = 'guide-animal';
    item.dataset.animalId = animal.id;
    item.innerHTML = `<span aria-hidden="true">${animal.emoji}</span><strong>${animal.nombre}</strong>`;
    animalGuide.appendChild(item);
  });
  updateProgress();
}

function loadUserData(userId) {
  db.ref(`usuarios/${userId}`).on('value', snapshot => {
    const userData = snapshot.val() || {};
    userNameElement.textContent = userData.nombre || currentUser.email || 'Jugador';
    userPointsElement.textContent = `${sessionScore} puntos`;

  });
}

function updateProgress() {
  const completed = discoveredAnimals.size;
  progressText.textContent = `${completed}/${ANIMAL_CATALOG.length} descubiertos`;
  progressFill.style.width = `${(completed / ANIMAL_CATALOG.length) * 100}%`;
  document.querySelectorAll('.guide-animal').forEach(item => {
    item.classList.toggle('discovered', discoveredAnimals.has(item.dataset.animalId));
  });
}

function updateSessionStats() {
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
  userPointsElement.textContent = `${sessionScore} puntos`;
  sessionPoints.textContent = sessionScore;
  statCorrect.textContent = correctCount;
  statIncorrect.textContent = incorrectCount;
  statStreak.textContent = streak;
  statAccuracy.textContent = `${accuracy}%`;
}

function setQuestionCounter(value) {
  questionCounter.textContent = value;
  headerQuestionCounter.textContent = value;
}

function registerCorrectAttempt(points = 10) {
  correctCount += 1;
  streak += 1;
  totalAttempts += 1;
  sessionScore += points;
  updateSessionStats();
}

function registerIncorrectAttempt() {
  incorrectCount += 1;
  streak = 0;
  totalAttempts += 1;
  sessionScore = Math.max(0, sessionScore - 5);
  updateSessionStats();
}

function setFeedback(message, type = 'neutral') {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

function setScannerState(state, message) {
  scannerStatus.textContent = state;
  scannerStatus.classList.toggle('active', state === 'Escaneando');
  scannerMessage.textContent = message;
}

function openAnimalVideo(animalData) {
  if (!animalData?.videoId) return;

  const start = animalData.videoInicio || 0;
  const end = animalData.videoFin || start + 25;
  const duration = Math.max(1, end - start);
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    cc_load_policy: '1',
    cc_lang_pref: 'es',
    start: String(start),
    end: String(end)
  });

  if (animalData.videoRepetir) {
    params.set('loop', '1');
    params.set('playlist', animalData.videoId);
  }

  videoAnimalTitle.textContent = `¡Descubriste ${animalLabel(animalData)}!`;
  videoAnimalDescription.textContent = animalData.descripcion;
  videoAnimalHabitat.textContent = animalData.habitat;
  videoAnimalDiet.textContent = animalData.alimentacion;
  videoAnimalAbility.textContent = animalData.habilidad;
  videoDuration.textContent = `Video real enfocado · ${duration} segundos · Descripción narrada`;
  videoSourceLink.textContent = `Canal: ${animalData.videoFuente}`;
  videoSourceLink.href = `https://www.youtube.com/watch?v=${animalData.videoId}`;
  videoReferenceTitle.textContent = animalData.videoTitulo || `Video original de ${animalData.nombre}`;
  animalVideoFrame.title = `Video breve del ${animalData.nombre}`;
  animalVideoFrame.hidden = false;
  videoFinished.hidden = true;
  animalVideoFrame.src = `https://www.youtube-nocookie.com/embed/${animalData.videoId}?${params.toString()}`;
  window.clearTimeout(videoPlaybackTimer);
  videoPlaybackTimer = window.setTimeout(() => {
    animalVideoFrame.src = 'about:blank';
    animalVideoFrame.hidden = true;
    videoFinished.hidden = false;
    videoDuration.textContent = `40 segundos completados · Descripción disponible`;
  }, duration * 1000);
  animalVideoModal.hidden = false;
  document.body.classList.add('modal-open');
  closeAnimalVideoBtn.focus();
}

function closeAnimalVideo(restoreFocus = true) {
  if (animalVideoModal.hidden) return;
  window.clearTimeout(videoPlaybackTimer);
  videoPlaybackTimer = null;
  animalVideoFrame.src = 'about:blank';
  animalVideoFrame.hidden = false;
  videoFinished.hidden = true;
  animalVideoModal.hidden = true;
  document.body.classList.remove('modal-open');
  if (restoreFocus && !nextRiddleBtn.disabled) nextRiddleBtn.focus();
}

async function startQRScanner() {
  if (scannerRunning) return;

  if (typeof jsQR === 'undefined') {
    setFeedback('No se pudo cargar el lector QR. Revisa la conexión y recarga la página.', 'error');
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    setFeedback('Este navegador no permite utilizar la cámara.', 'error');
    return;
  }

  try {
    setScannerState('Abriendo', 'Preparando la cámara...');
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    videoElement.srcObject = mediaStream;
    await videoElement.play();
    scannerRunning = true;
    processingCode = awaitingNext;
    cameraPlaceholder.hidden = true;
    startScannerBtn.disabled = true;
    stopScannerBtn.disabled = false;
    setScannerState('Escaneando', 'Coloca un QR de animal dentro del recuadro amarillo.');
    requestAnimationFrame(tick);
    return true;
  } catch (error) {
    console.error('No se pudo acceder a la cámara:', error);
    setScannerState('Sin cámara', 'Revisa el permiso de cámara e inténtalo nuevamente.');
    setFeedback('No se pudo abrir la cámara.', 'error');
    return false;
  }
}

function stopQRScanner() {
  scannerRunning = false;
  processingCode = awaitingNext;
  lastCode = null;
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  videoElement.srcObject = null;
  cameraPlaceholder.hidden = false;
  startScannerBtn.disabled = false;
  stopScannerBtn.disabled = true;
  updateStartButton();
  setScannerState('Preparado', 'La cámara está detenida.');
}

async function startRiddleGame() {
  if (!gameStarted || gameComplete) resetRiddleGame();
  const cameraReady = await startQRScanner();
  if (cameraReady && !currentTarget) {
    startNextRiddle();
  } else if (cameraReady && awaitingNext) {
    playSound();
  } else if (cameraReady && currentTarget) {
    repeatRiddle();
  }
}

function resetRiddleGame() {
  closeAnimalVideo(false);
  discoveredAnimals.clear();
  usedFacts = {};
  currentAnimal = null;
  currentTarget = null;
  questionIndex = 0;
  gameStarted = true;
  gameComplete = false;
  awaitingNext = false;
  processingCode = false;
  revealedHintCount = 0;
  sessionScore = 0;
  correctCount = 0;
  incorrectCount = 0;
  streak = 0;
  totalAttempts = 0;
  riddleQueue = shuffleAnimals(ANIMAL_CATALOG);
  setQuestionCounter(`0/${ANIMAL_CATALOG.length}`);
  riddleText.textContent = 'Preparando la primera adivinanza...';
  riddlePrompt.textContent = '¿Qué animal soy?';
  riddleExtra.hidden = true;
  riddleExtra.textContent = '';
  extraHintBtn.disabled = true;
  resetAnimalPanel();
  updateProgress();
  updateSessionStats();
  updateStartButton();
}

function shuffleAnimals(animals) {
  const shuffled = [...animals];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function startNextRiddle() {
  if (questionIndex >= riddleQueue.length) {
    finishRiddleGame();
    return;
  }

  currentTarget = riddleQueue[questionIndex];
  currentAnimal = null;
  awaitingNext = false;
  processingCode = false;
  revealedHintCount = 0;
  setQuestionCounter(`${questionIndex + 1}/${riddleQueue.length}`);
  riddleText.textContent = currentTarget.adivinanza;
  riddlePrompt.textContent = '¿Qué animal soy? Escanea su QR.';
  riddleExtra.hidden = true;
  riddleExtra.textContent = '';
  extraHintBtn.disabled = false;
  extraHintBtn.innerHTML = '<span aria-hidden="true">＋</span> Otra pista';
  repeatRiddleBtn.disabled = false;
  resetAnimalPanel();
  setFeedback('Escucha la pista y busca el QR correcto.', 'neutral');
  if (scannerRunning) {
    setScannerState('Escaneando', 'Escanea el QR del animal que responde la adivinanza.');
  } else {
    setScannerState('Preparado', 'Pulsa Continuar adivinanza para activar la cámara.');
  }
  repeatRiddle();
}

function repeatRiddle() {
  if (!currentTarget) return;
  speak(`${currentTarget.adivinanza} ¿Qué animal soy?`);
}

function showExtraHint() {
  if (!currentTarget || awaitingNext || revealedHintCount >= 2) return;

  const hints = [
    `Vivo en ${currentTarget.habitat.toLowerCase()}.`,
    `Mi alimentación es ${currentTarget.alimentacion.toLowerCase()}.`
  ];
  const hint = `Pista ${revealedHintCount + 1}: ${hints[revealedHintCount]}`;
  riddleExtra.textContent = riddleExtra.hidden ? hint : `${riddleExtra.textContent} ${hint}`;
  riddleExtra.hidden = false;
  revealedHintCount += 1;
  speak(hint);

  if (revealedHintCount >= hints.length) {
    extraHintBtn.disabled = true;
    extraHintBtn.innerHTML = '<span aria-hidden="true">✓</span> Pistas completas';
  } else {
    extraHintBtn.innerHTML = '<span aria-hidden="true">＋</span> Última pista';
  }
}

function resetAnimalPanel() {
  animalEmoji.textContent = '❓';
  animalEmoji.hidden = false;
  animalImage.hidden = true;
  animalName.textContent = 'Resuelve la adivinanza';
  animalIntro.textContent = 'Cuando escanees el QR correcto, aquí aparecerá una breve presentación del animal.';
  animalDetails.hidden = true;
  animalType.textContent = '-';
  animalHabitat.textContent = '-';
  animalDiet.textContent = '-';
  animalRegion.textContent = '-';
  animalDescription.hidden = true;
  animalDescription.textContent = '';
  animalAbility.hidden = true;
  animalAbility.textContent = '';
  animalFact.textContent = 'También descubrirás un dato curioso.';
  soundBtn.disabled = true;
  hintBtn.disabled = true;
  nextRiddleBtn.disabled = true;
  nextRiddleBtn.innerHTML = '<span aria-hidden="true">→</span> Siguiente animal';
  animalPanel.classList.remove('revealed');
}

function finishRiddleGame() {
  closeAnimalVideo(false);
  gameComplete = true;
  awaitingNext = false;
  currentTarget = null;
  setQuestionCounter(`${ANIMAL_CATALOG.length}/${ANIMAL_CATALOG.length}`);
  riddleText.textContent = '¡Completaste todas las adivinanzas del zoológico!';
  riddlePrompt.textContent = 'Excelente trabajo.';
  repeatRiddleBtn.disabled = true;
  extraHintBtn.disabled = true;
  nextRiddleBtn.disabled = true;
  setFeedback(`¡Reto completado! Obtuviste ${sessionScore} puntos con ${correctCount} aciertos y ${incorrectCount} errores.`, 'success');
  speak('¡Felicidades! Completaste todas las adivinanzas del zoológico.');
  stopQRScanner();
  setScannerState('Completado', 'Terminaste el reto de animales.');
  updateStartButton();
  window.AppCelebration?.show({
    activity: 'Zoológico mágico',
    icon: '🐾',
    message: `Descubriste los ${ANIMAL_CATALOG.length} animales y completaste todas sus adivinanzas.`
  });
}

function updateStartButton() {
  if (gameComplete) {
    startScannerBtn.innerHTML = '<span aria-hidden="true">↻</span> Jugar de nuevo';
  } else if (gameStarted) {
    startScannerBtn.innerHTML = '<span aria-hidden="true">▶</span> Continuar adivinanza';
  } else {
    startScannerBtn.innerHTML = '<span aria-hidden="true">▶</span> Comenzar adivinanza';
  }
}

function tick() {
  if (!scannerRunning) return;

  if (!processingCode && !awaitingNext && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
    if (code?.data) handleQRCode(code.data);
  }

  requestAnimationFrame(tick);
}

function findLocalAnimal(rawCode) {
  const normalized = rawCode.trim().toUpperCase();
  return ANIMAL_CATALOG.find(animal => (
    animal.code === normalized ||
    animal.id.toUpperCase() === normalized ||
    animal.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase() === normalized
  ));
}

async function findAnimal(rawCode) {
  const localAnimal = findLocalAnimal(rawCode);
  if (localAnimal) return localAnimal;
  if (!db) return null;

  const snapshot = await db.ref(`animales/${rawCode.trim()}`).once('value');
  const remoteAnimal = snapshot.val();
  if (!remoteAnimal) return null;

  return {
    id: rawCode.trim(),
    code: rawCode.trim(),
    emoji: emojiForName(remoteAnimal.nombre),
    puntos: 10,
    datosCuriosos: [],
    ...remoteAnimal
  };
}

async function handleQRCode(rawCode) {
  const cleanCode = String(rawCode || '').trim();
  if (!cleanCode || processingCode || cleanCode === lastCode) return;

  if (!gameStarted || !currentTarget) {
    setFeedback('Comienza una adivinanza antes de escanear.', 'error');
    return;
  }

  processingCode = true;
  lastCode = cleanCode;
  setScannerState('Detectado', 'Identificando el animal...');
  let correctAnswer = false;

  try {
    const animalData = await findAnimal(cleanCode);
    if (!animalData) {
      registerIncorrectAttempt();
      setFeedback('Este QR no pertenece al zoológico. Perdiste 5 puntos.', 'error');
      speak('Respuesta incorrecta. Ese código no pertenece al zoológico. Perdiste 5 puntos.');
      return;
    }

    if (animalData.id !== currentTarget.id) {
      registerIncorrectAttempt();
      setFeedback('Ese no es el animal de la adivinanza. Perdiste 5 puntos.', 'error');
      speak('Respuesta incorrecta. Perdiste 5 puntos. Escucha la pista e inténtalo otra vez.');
      return;
    }

    correctAnswer = true;
    awaitingNext = true;
    currentAnimal = currentTarget;
    discoveredAnimals.add(currentTarget.id);
    registerCorrectAttempt(currentTarget.puntos || 10);
    updateAnimalUI(currentTarget);
    updateProgress();
    speak(`¡Correcto! Descubriste ${animalLabel(currentTarget)}. ${currentTarget.descripcion} Su habilidad especial: ${currentTarget.habilidad}`);
    questionIndex += 1;
    extraHintBtn.disabled = true;
    nextRiddleBtn.disabled = false;
    nextRiddleBtn.innerHTML = questionIndex >= riddleQueue.length
      ? '<span aria-hidden="true">✓</span> Finalizar reto'
      : '<span aria-hidden="true">→</span> Siguiente animal';
    setScannerState('Animal descubierto', 'Lee o escucha su ficha y luego pulsa Siguiente animal.');
    openAnimalVideo(currentTarget);

    if (currentUser && db) {
      updateUserData(currentTarget.id, currentTarget.puntos || 10).catch(error => {
        console.error('No se pudieron guardar los puntos:', error);
      });
    }
  } catch (error) {
    console.error('Error al leer QR:', error);
    setFeedback(error.message || 'Animal no reconocido.', 'error');
  } finally {
    if (!correctAnswer) {
      window.setTimeout(() => {
        processingCode = false;
        lastCode = null;
        if (scannerRunning) {
          setScannerState('Escaneando', 'Vuelve a intentar con el QR correcto.');
        }
      }, 1800);
    }
  }
}

function continueAfterDiscovery() {
  if (!awaitingNext || !currentAnimal) return;
  closeAnimalVideo(false);
  awaitingNext = false;
  processingCode = false;
  lastCode = null;
  nextRiddleBtn.disabled = true;
  startNextRiddle();
}

function updateAnimalUI(animalData) {
  animalEmoji.textContent = animalData.emoji || emojiForName(animalData.nombre);
  animalEmoji.hidden = false;
  animalImage.hidden = true;

  if (animalData.imagen) {
    animalImage.onload = () => {
      animalImage.hidden = false;
      animalEmoji.hidden = true;
    };
    animalImage.onerror = () => {
      animalImage.hidden = true;
      animalEmoji.hidden = false;
    };
    animalImage.src = animalData.imagen;
  }

  animalName.textContent = `¡Es ${animalLabel(animalData)}!`;
  animalIntro.textContent = animalData.introduccion || `El ${animalData.nombre} es uno de los animales de nuestro zoológico mágico.`;
  animalType.textContent = animalData.tipo || 'Animal';
  animalHabitat.textContent = animalData.habitat || 'Hábitat natural';
  animalDiet.textContent = animalData.alimentacion || 'Alimentación variada';
  animalRegion.textContent = animalData.region || 'Diversas regiones';
  animalDetails.hidden = false;
  animalDescription.textContent = animalData.descripcion || animalIntro.textContent;
  animalDescription.hidden = false;
  animalAbility.textContent = `Habilidad especial: ${animalData.habilidad || animalData.datosCuriosos?.[0] || 'Cada animal tiene capacidades sorprendentes.'}`;
  animalAbility.hidden = false;
  showRandomFact();
  setFeedback(`¡Correcto! Ganaste ${animalData.puntos || 10} puntos. Explora la ficha antes de continuar.`, 'success');
  soundBtn.disabled = false;
  hintBtn.disabled = false;
  animalPanel.classList.remove('revealed');
  void animalPanel.offsetWidth;
  animalPanel.classList.add('revealed');
}

function showRandomFact() {
  if (!currentAnimal) return;
  const facts = currentAnimal.datosCuriosos || [];
  if (!facts.length) {
    animalFact.textContent = `Observa al ${currentAnimal.nombre} y recuerda sus características.`;
    return;
  }

  if (!usedFacts[currentAnimal.id]) usedFacts[currentAnimal.id] = [];
  if (usedFacts[currentAnimal.id].length >= facts.length) usedFacts[currentAnimal.id] = [];
  const availableIndexes = facts.map((_, index) => index).filter(index => !usedFacts[currentAnimal.id].includes(index));
  const selectedIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  usedFacts[currentAnimal.id].push(selectedIndex);
  animalFact.textContent = facts[selectedIndex];
}

async function updateUserData(animalId, points) {
  const discoveredRef = db.ref(`usuarios/${currentUser.uid}/animalesDescubiertos/${animalId}`);
  await discoveredRef.set(true);
  await db.ref(`usuarios/${currentUser.uid}/puntosTotales`).transaction(value => (value || 0) + points);
}

function playSound() {
  if (!currentAnimal) return;
  speak(`${animalLabel(currentAnimal)}. ${currentAnimal.descripcion || currentAnimal.introduccion} Su habilidad especial: ${currentAnimal.habilidad || currentAnimal.datosCuriosos?.[0] || ''}`);
}

function speak(text) {
  window.OsmoVoice?.speak(text, { rate: 0.9 });
}

function emojiForName(name = '') {
  const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const match = ANIMAL_CATALOG.find(animal => normalized.includes(animal.id));
  return match?.emoji || '🐾';
}

function animalLabel(animal) {
  const article = animal?.genero === 'f' ? 'una' : 'un';
  const name = String(animal?.nombre || 'animal').toLocaleLowerCase('es');
  return `${article} ${name}`;
}

function resetZooGame() {
  if (!window.confirm('¿Reiniciar el juego? Se perderá el progreso actual.')) return;
  stopQRScanner();
  resetRiddleGame();
  gameStarted = false;
  currentTarget = null;
  riddleQueue = [];
  setQuestionCounter(`0/${ANIMAL_CATALOG.length}`);
  riddleText.textContent = 'Pulsa comenzar para escuchar la primera pista.';
  riddlePrompt.textContent = '¿Qué animal soy?';
  resetAnimalPanel();
  updateStartButton();
  setScannerState('Preparado', 'Pulsa comenzar para activar la cámara.');
  setFeedback('Juego reiniciado. Comienza una nueva aventura.', 'neutral');
}

startScannerBtn.addEventListener('click', startRiddleGame);
stopScannerBtn.addEventListener('click', stopQRScanner);
repeatRiddleBtn.addEventListener('click', repeatRiddle);
extraHintBtn.addEventListener('click', showExtraHint);
nextRiddleBtn.addEventListener('click', continueAfterDiscovery);
closeAnimalVideoBtn.addEventListener('click', () => closeAnimalVideo());
animalVideoBackdrop.addEventListener('click', () => closeAnimalVideo());
videoModalContinueBtn.addEventListener('click', () => closeAnimalVideo());
soundBtn.addEventListener('click', playSound);
hintBtn.addEventListener('click', showRandomFact);
resetZooBtn.addEventListener('click', resetZooGame);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !animalVideoModal.hidden) closeAnimalVideo();
});
window.addEventListener('beforeunload', stopQRScanner);

renderAnimalGuide();
initializeFirebase();
