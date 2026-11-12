import * as THREE from 'three';

/**
 * Cotas técnicas y etiquetas flotantes nítidas para el terreno exacto de 20.00m x 18.00m (360 m²).
 */
export function createCotas(scene) {
  const cotasGroup = new THREE.Group();
  cotasGroup.name = 'CotasGroup';

  const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });

  function createTextSprite(text, subtext = '', color = '#38bdf8') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(11, 15, 23, 0.88)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 140, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 256, 75);

    if (subtext) {
      ctx.fillStyle = color;
      ctx.font = '600 28px "JetBrains Mono", monospace';
      ctx.fillText(subtext, 256, 120);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.4, 1.05, 1);
    return sprite;
  }

  function drawDimensionLine(start, end, label, sublabel = '') {
    const dGroup = new THREE.Group();

    const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
    const line = new THREE.Line(lineGeo, lineMat);
    dGroup.add(line);

    const dir = new THREE.Vector3().subVectors(end, start).normalize();
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(0.4);

    const tick1Geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3().addVectors(start, perp),
      new THREE.Vector3().subVectors(start, perp)
    ]);
    dGroup.add(new THREE.Line(tick1Geo, lineMat));

    const tick2Geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3().addVectors(end, perp),
      new THREE.Vector3().subVectors(end, perp)
    ]);
    dGroup.add(new THREE.Line(tick2Geo, lineMat));

    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const sprite = createTextSprite(label, sublabel);
    sprite.position.copy(midPoint);
    sprite.position.y += 0.8;
    dGroup.add(sprite);

    return dGroup;
  }

  // 1. COTA FRONTERA TOTAL (20.00 m en Z = +9.8m)
  const cotaFront = drawDimensionLine(
    new THREE.Vector3(-10, 0.2, 9.8),
    new THREE.Vector3(10, 0.2, 9.8),
    'FRONTERA: 20.00 m',
    'Ancho Total Calculado'
  );
  cotasGroup.add(cotaFront);

  // 2. COTA PROFUNDIDAD TOTAL (18.00 m en X = -10.8m)
  const cotaDepth = drawDimensionLine(
    new THREE.Vector3(-10.8, 0.2, 9.0),
    new THREE.Vector3(-10.8, 0.2, -9.0),
    'PROFUNDIDAD: 18.00 m',
    'Área: 360.00 m²'
  );
  cotasGroup.add(cotaDepth);

  // 3. ETIQUETA PASADIZO HORIZONTAL (1.50 m en Z = -5.8m)
  const pasadizoHoriz = drawDimensionLine(
    new THREE.Vector3(1.0, 0.2, -5.05),
    new THREE.Vector3(1.0, 0.2, -6.55),
    'PASADIZO: 1.50 m'
  );
  cotasGroup.add(pasadizoHoriz);

  // 4. ETIQUETA PATIO CENTRAL (6.80 m de ancho libre)
  const patioLabel = createTextSprite('PATIO FORMACIÓN', '6.80 m de ancho libre', '#10b981');
  patioLabel.position.set(0, 0.6, -0.5);
  patioLabel.scale.set(3.6, 1.15, 1);
  cotasGroup.add(patioLabel);

  // 5. COTA PASADIZO VERTICAL (1.50 m)
  const cotaPasilloVert = drawDimensionLine(
    new THREE.Vector3(-7.55, 0.2, 2.5),
    new THREE.Vector3(-6.05, 0.2, 2.5),
    'PASADIZO: 1.50 m'
  );
  cotasGroup.add(cotaPasilloVert);

  // 6. ETIQUETA MÓDULO CARPA (2.40m x 2.75m = 6.6 m²)
  const tentLabel = createTextSprite('MÓDULO CARPA: 6.6 m²', '2.40 m × 2.75 m (Cuerpo 2.25 × 2.40m)', '#f59e0b');
  tentLabel.position.set(-6.8, 0.5, -3.5);
  tentLabel.scale.set(4.0, 1.2, 1);
  cotasGroup.add(tentLabel);

  // 7. ETIQUETA FILA DEL FONDO (8 carpas)
  const fondoLabel = createTextSprite('FILA FONDO: 8 CARPAS', '4 Varones + 4 Mujeres (20m / 2.5m)', '#38bdf8');
  fondoLabel.position.set(0, 0.6, -8.6);
  fondoLabel.scale.set(4.2, 1.25, 1);
  cotasGroup.add(fondoLabel);

  scene.add(cotasGroup);
  return { cotasGroup };
}
