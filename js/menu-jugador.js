document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const menuItems = document.querySelectorAll('.menu-item');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!mainContent) {
        console.error("No se encontró el contenedor mainContent");
        return;
    }

    // Toggle del menú en móviles
    if (menuToggle) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    // Eventos para los items del menú
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const contentFile = this.getAttribute('data-content');
            const href = this.getAttribute('href');

            if (!contentFile && href && href !== '#') {
                return;
            }

            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            if (contentFile) loadContent(contentFile);

            if (window.innerWidth <= 768) sidebar.classList.remove('active');
        });
    });

    // Evento cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                return;
            }

            try {
                const { auth, signOut } = await import('./firebase.js');
                await signOut(auth);
            } catch (error) {
                console.error('No se pudo cerrar la sesión en Firebase:', error);
            }

            window.location.href = 'index.html';
        });
    }

    // Función para cargar contenido
    async function loadContent(url) {
        // Mostrar loader
        mainContent.innerHTML = `
            <div class="loader">
                <div class="loader-spinner"></div>
            </div>
        `;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`No se pudo cargar ${url}`);
            
            const html = await response.text();
            mainContent.innerHTML = html;

            // Inicializar juegoletras si corresponde
            if (url === 'juegoletras.html') {
                // Llamar a initLetrasQR después de un pequeño delay
                // para asegurar que el DOM esté totalmente renderizado
                setTimeout(() => {
                    if (typeof initLetrasQR === 'function') {
                        initLetrasQR();
                    } else {
                        const script = document.createElement('script');
                        script.src = 'js/juegoletras.js'; // Ajusta la ruta según tu proyecto
                        script.onload = () => {
                            if (typeof initLetrasQR === 'function') initLetrasQR();
                        };
                        script.onerror = () => console.error('No se pudo cargar el script de juegoletras');
                        document.body.appendChild(script);
                    }
                }, 50); // 50ms es suficiente
            }

        } catch (err) {
            console.error('Error al cargar contenido:', err);
            mainContent.innerHTML = `
                <div class="content-section active">
                    <h2>Error al cargar el contenido</h2>
                    <p>No se pudo cargar el juego solicitado. Por favor, intenta nuevamente.</p>
                </div>
            `;
        }
    }
});
