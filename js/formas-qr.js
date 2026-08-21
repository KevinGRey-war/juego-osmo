(function () {
  'use strict';
  const SHAPES = [
    ['circle','Círculo'],['square','Cuadrado'],['triangle','Triángulo'],['rectangle','Rectángulo'],['oval','Óvalo'],
    ['diamond','Rombo'],['pentagon','Pentágono'],['hexagon','Hexágono'],['heptagon','Heptágono'],['octagon','Octágono'],
    ['nonagon','Eneágono'],['decagon','Decágono'],['star','Estrella'],['heart','Corazón'],['semicircle','Semicírculo'],
    ['trapezoid','Trapecio'],['parallelogram','Paralelogramo'],['cross','Cruz'],['arrow','Flecha'],['kite','Cometa'],
    ['right-triangle','Triángulo rectángulo'],['isosceles','Triángulo isósceles'],['scalene','Triángulo escaleno'],['crescent','Media luna'],['ring','Anillo']
  ];
  const COLORS = [['#176b43','#eaf5ed'],['#ef654b','#fff0ec'],['#1f6387','#e8f1f5'],['#8245a8','#f4ecf8'],['#c18000','#fff6d9']];
  const pages = document.getElementById('pages');

  function render() {
    const pageCount = Math.ceil(SHAPES.length / 6);
    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      const pageShapes = SHAPES.slice(pageIndex * 6, pageIndex * 6 + 6);
      const page = document.createElement('section');
      page.className = 'sheet-page';
      page.innerHTML = `<header class="sheet-header"><div><strong>25 FIGURAS GEOMÉTRICAS</strong><span>Observa cada figura y aprende su nombre</span></div><div class="page-number">${pageIndex + 1}/${pageCount}</div></header><div class="card-grid"></div><footer class="sheet-footer"><span>Reto de Formas</span><span>Material visual tamaño carta</span></footer>`;
      const grid = page.querySelector('.card-grid');
      pageShapes.forEach(([id, name], localIndex) => {
        const itemIndex = pageIndex * 6 + localIndex;
        const [color, soft] = COLORS[itemIndex % COLORS.length];
        const card = document.createElement('article');
        card.className = 'shape-card';
        card.style.setProperty('--card-color', color);
        card.style.setProperty('--card-soft', soft);
        card.innerHTML = `<span class="card-number">Figura ${itemIndex + 1} de ${SHAPES.length}</span><h2>${name}</h2><div class="shape-visual"><span class="shape-outline" aria-hidden="true"><span class="shape-art shape-${id}"></span></span></div><p>Observa su contorno y recuerda su nombre.</p>`;
        grid.appendChild(card);
      });
      pages.appendChild(page);
    }
  }

  document.getElementById('printButton').addEventListener('click', () => window.print());
  render();
}());
