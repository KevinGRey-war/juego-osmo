 // Variables globales
        let scanActive = false;
        let player;
        let isCameraReady = false;
        let lastCheckpointNotified = -1;
        let scanInterval;
        let currentQR = null;
        let lastDetectedQR = null;
        let qrDetectionCooldown = false;
        let score = 0;

        const videoElement = document.getElementById('webcam');
        const scoreValueElement = document.getElementById('scoreValue');
        const progressFillElement = document.getElementById('progressFill');
        const progressTextElement = document.getElementById('progressText');

        const checkpoints = [
            { time: 48, letter: 'A' }, { time: 72, letter: 'B' }, { time: 96, letter: 'C' },
            { time: 122, letter: 'D' }, { time: 148, letter: 'E' }, { time: 174, letter: 'F' },
            { time: 198, letter: 'G' }, { time: 223, letter: 'H' }, { time: 249, letter: 'I' },
            { time: 273, letter: 'J' }, { time: 297, letter: 'K' }, { time: 323, letter: 'L' },
            { time: 346, letter: 'M' }, { time: 372, letter: 'N' }, { time: 397, letter: 'O' },
            { time: 422, letter: 'P' }, { time: 447, letter: 'Q' }, { time: 472, letter: 'R' },
            { time: 497, letter: 'S' }, { time: 521, letter: 'T' }, { time: 546, letter: 'U' },
            { time: 571, letter: 'V' }, { time: 595, letter: 'W' }, { time: 620, letter: 'X' },
            { time: 645, letter: 'Y' }, { time: 665, letter: 'Z' }
        ];
        let currentCheckpoint = 0;

        // Sistema de puntuación
        function updateScore(points) {
            score += points;
            scoreValueElement.textContent = score;
            
            // Efecto visual al actualizar puntuación
            scoreValueElement.classList.add('score-updated');
            setTimeout(() => {
                scoreValueElement.classList.remove('score-updated');
            }, 500);
        }

        // Actualizar barra de progreso
        function updateProgress() {
            const progress = (currentCheckpoint / checkpoints.length) * 100;
            progressFillElement.style.width = `${progress}%`;
            progressTextElement.textContent = `${currentCheckpoint}/${checkpoints.length} letras completadas`;
        }

        // Función de voz
        function speak(text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                utterance.lang = 'es-ES';
                const voices = window.speechSynthesis.getVoices();
                const loudVoice = voices.find(v => (v.lang === 'es-ES' && v.name.includes('Loud')) || voices.find(v => v.lang === 'es-ES'));
                if (loudVoice) utterance.voice = loudVoice;
                window.speechSynthesis.speak(utterance);
            }
        }

        // Inicializar cámara para QR
        async function initCamera() {
            try {
                document.getElementById('scanStatus').textContent = "Activando cámara...";
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
                });
                videoElement.srcObject = stream;
                videoElement.onplaying = () => {
                    isCameraReady = true;
                    document.getElementById('scanStatus').textContent = "Cámara lista - Escanea el código QR";
                };
            } catch (err) {
                console.error("Error al acceder a la cámara:", err);
                document.getElementById('feedback').textContent = "Error: Permisos de cámara no otorgados.";
                document.getElementById('feedback').className = 'feedback-incorrect';
                speak("Por favor, permite el acceso a la cámara para jugar.");
            }
        }

        // Función de escaneo QR
        function startQRScan() {
            if (scanActive) return;
            scanActive = true;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            scanInterval = setInterval(() => {
                if (!isCameraReady || !scanActive) return;
                
                // Asegurarse de que el video esté listo
                if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    
                    try {
                        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
                        if (qrCode && qrCode.data !== lastDetectedQR) {
                            lastDetectedQR = qrCode.data;
                            const detectedLetter = qrCode.data.trim().toUpperCase();
                            const expectedLetter = checkpoints[currentCheckpoint].letter;
                            document.getElementById('scanStatus').textContent = `Detectado: ${detectedLetter}`;
                            
                            if (detectedLetter === expectedLetter) {
                                handleCorrectQR();
                            } else {
                                handleIncorrectQR(detectedLetter);
                            }
                            
                            qrDetectionCooldown = true;
                            setTimeout(() => {
                                qrDetectionCooldown = false;
                                lastDetectedQR = null;
                            }, 2000);
                        }
                    } catch (error) {
                        console.error("Error en el escaneo QR:", error);
                    }
                }
            }, 500);
        }

        function handleCorrectQR() {
            scanActive = false;
            clearInterval(scanInterval);
            const expectedLetter = checkpoints[currentCheckpoint].letter;
            document.getElementById('feedback').textContent = "¡Correcto! +10 puntos";
            document.getElementById('feedback').className = 'feedback-correct';
            updateScore(10);
            speak("Correcto");
            document.getElementById('cameraView').style.display = 'none';
            document.getElementById('scanStatus').textContent = "Preparado para siguiente letra";
            currentCheckpoint++;
            updateProgress();
            
            if (currentCheckpoint < checkpoints.length) {
                player.playVideo();
            } else {
                // Juego completado
                updateScore(50); // Bono por completar todas las letras
                speak("¡Felicidades! Completaste todas las letras.");
                document.getElementById('feedback').textContent = "¡Juego completado! +50 puntos";
                document.getElementById('scanStatus').textContent = "Actividad finalizada";
            }
        }

        function handleIncorrectQR(detectedLetter) {
            const expectedLetter = checkpoints[currentCheckpoint].letter;
            document.getElementById('feedback').textContent = `QR incorrecto. Esperaba: ${expectedLetter}`;
            document.getElementById('feedback').className = 'feedback-incorrect';
            updateScore(-5); // Penalización por QR incorrecto
            speak(`Incorrecto. Busca la letra ${expectedLetter}.`);
            setTimeout(() => {
                if (document.getElementById('cameraView').style.display === 'block') {
                    document.getElementById('feedback').textContent = "";
                    document.getElementById('feedback').className = '';
                }
            }, 2000);
        }

        // YouTube Player API
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('youtubePlayer', {
                height: '360',
                width: '640',
                videoId: 'yxI-Ek7PIDk',
                playerVars: {
                    'playsinline': 1,
                    'modestbranding': 1,
                    'rel': 0
                },
                events: {
                    'onReady': (event) => {
                        event.target.playVideo();
                        startQRScan();
                        updateProgress(); // Inicializar barra de progreso
                    },
                    'onStateChange': (event) => {
                        if (event.data === YT.PlayerState.PLAYING) {
                            checkTime();
                        }
                    }
                }
            });
        }

        function checkTime() {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                if (currentCheckpoint < checkpoints.length) {
                    const checkpoint = checkpoints[currentCheckpoint];
                    const currentTime = player.getCurrentTime();
                    if (currentTime >= checkpoint.time && lastCheckpointNotified !== currentCheckpoint) {
                        player.pauseVideo();
                        document.getElementById('cameraView').style.display = 'block';
                        document.getElementById('expectedLetterText').textContent = checkpoint.letter;
                        document.getElementById('feedback').textContent = "";
                        document.getElementById('feedback').className = '';
                        document.getElementById('scanStatus').textContent = "Escaneando...";
                        speak(`Escanea la letra ${checkpoint.letter}`);
                        lastCheckpointNotified = currentCheckpoint;
                        lastDetectedQR = null;
                        startQRScan();
                    }
                }
                requestAnimationFrame(checkTime);
            }
        }

        // Cargar YouTube API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        // Inicializar la aplicación cuando la página cargue
        window.onload = function() {
            initCamera();
        };