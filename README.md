# Juego OSMO

Juego educativo con ocho actividades interactivas:

- Letras con QR
- Números con video local y QR
- Zoológico lógico
- Identificación de colores
- Reto de formas
- Figuras con las manos
- Cuerpo humano
- Dibujo con el índice

## Ejecutar localmente

Desde esta carpeta, inicia un servidor web:

```bash
python -m http.server 8002 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8002/menu-jugador.html` en un navegador moderno. Las actividades que usan cámara requieren aceptar el permiso del navegador.

Los PDF pedagógicos se encuentran en `output/pdf/` y el video local de Números en `videos/`.
