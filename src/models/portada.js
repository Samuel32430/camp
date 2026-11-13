import * as THREE from 'three';

/**
 * Portada pionera de troncos con amarres sin pozos y cerco SOLO en el frontis
 * para el terreno de 20.00m de ancho en Z = +8.95m.
 *
 * COLORES CLUB ORIÓN: Azul #1a3a8f | Verde #1a7a3f | Amarillo #f5c518 | Blanco #ffffff
 * ALTURA MÁXIMA PORTADA: 3.00 m
 */

// ── Paleta Club Orión ────────────────────────────────────────────────────────
export const ORION_COLORS = {
  azul:     0x1a3a8f,
  verde:    0x1a7a3f,
  amarillo: 0xf5c518,
  blanco:   0xffffff,
};

// ── Especificaciones técnicas (editables para la presentación) ───────────────
export const PORTADA_SPECS = {
  // Trípodes
  palosTripodesLargo:   '3.60 m',
  palosTripodesD:       'Ø 10–12 cm',
  cantTripodesTotal:    9,            // 3 trípodes × 3 palos

  // Travesaño
  travesañoLargo:       '5.80 m',
  travesañoD:           'Ø 10–12 cm',
  cantTravesaño:        1,

  // Cerco frontal (estacas)
  estacasLargo:         '1.20 m',
  estacasD:             'Ø 3–4 cm',
  cantEstacas:          12,

  // Driza portada (amarres de trípodes y travesaño)
  drizaPortadaTotal:    '≈ 25 m',
  drizaPortadaD:        'Ø 6–8 mm',

  // Driza cerco (3 niveles × 2 tramos)
  drizaCercoTotal:      '≈ 50 m',
  drizaCercoD:          'Ø 4–6 mm',

  // Medidas generales
  anchoPortada:         '5.20 m',
  alturaPortada:        '3.00 m',
  anchoCerco:           '7.20 m (cada lado)',
};

export function createPortadaYCercado() {
  const group = new THREE.Group();
  group.name = 'PortadaYCercado';

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.85,
    metalness: 0.05
  });

  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    roughness: 0.9
  });

  // ==============================================================
  // 1. PORTADA (Centro frontal: X = -2.6 a +2.6, Z = +8.95)
  //    Altura máxima: 3.00 m
  // ==============================================================
  const portadaGroup = new THREE.Group();
  portadaGroup.position.set(0, 0, 8.95);

  // Altura ajustada al máximo de 3.00 m
  const tripodH = 2.80;   // altura útil del trípode (viga queda en ~3.00 m)
  const logR    = 0.07;

  function createPioneerTripod(xOffset) {
    const tGroup = new THREE.Group();
    tGroup.position.x = xOffset;

    const legLen  = tripodH + 0.3;
    const legGeo  = new THREE.CylinderGeometry(logR, logR * 1.1, legLen, 8);
    const spreadZ = 0.55;
    const spreadX = 0.40;

    const leg1 = new THREE.Mesh(legGeo, woodMat);
    leg1.position.set(-spreadX, legLen / 2, spreadZ);
    leg1.rotation.set(0.18, 0, -0.14);
    leg1.castShadow = true;
    tGroup.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, woodMat);
    leg2.position.set(spreadX, legLen / 2, spreadZ);
    leg2.rotation.set(0.18, 0, 0.14);
    leg2.castShadow = true;
    tGroup.add(leg2);

    const leg3 = new THREE.Mesh(legGeo, woodMat);
    leg3.position.set(0, legLen / 2, -spreadZ);
    leg3.rotation.set(-0.24, 0, 0);
    leg3.castShadow = true;
    tGroup.add(leg3);

    // Amarre superior (nudo)
    const knot = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 8, 16), ropeMat);
    knot.position.set(0, tripodH - 0.05, 0);
    knot.rotation.x = Math.PI / 2;
    tGroup.add(knot);

    return tGroup;
  }

  // 3 Trípodes: Izquierdo, Central, Derecho
  portadaGroup.add(createPioneerTripod(-2.6));
  portadaGroup.add(createPioneerTripod(0));
  portadaGroup.add(createPioneerTripod(2.6));

  // Viga travesaño horizontal superior (5.8 m de largo)
  const beamGeo = new THREE.CylinderGeometry(logR * 0.9, logR * 0.9, 5.8, 8);
  const beam = new THREE.Mesh(beamGeo, woodMat);
  beam.rotation.z = Math.PI / 2;
  beam.position.set(0, tripodH - 0.15, 0);
  beam.castShadow = true;
  portadaGroup.add(beam);

  // Amarres en cada trípode sobre la viga
  for (const bx of [-2.6, 0, 2.6]) {
    const k = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.18, 8), ropeMat);
    k.rotation.z = Math.PI / 2;
    k.position.set(bx, tripodH - 0.15, 0);
    portadaGroup.add(k);
  }

  // ── Telas decorativas laterales (colores Club Orión) ──────────────────────
  // Tela izquierda: azul con franja verde
  const telaIzqMat = new THREE.MeshStandardMaterial({
    color: ORION_COLORS.azul,
    side: THREE.DoubleSide,
    roughness: 0.85
  });
  const telaIzq = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.6), telaIzqMat);
  telaIzq.position.set(-3.35, tripodH - 1.1, 0.05);
  telaIzq.castShadow = false;
  portadaGroup.add(telaIzq);

  // Franja verde en tela izquierda
  const franjaIzqMat = new THREE.MeshStandardMaterial({
    color: ORION_COLORS.verde,
    side: THREE.DoubleSide,
    roughness: 0.85
  });
  const franjaIzq = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 1.6), franjaIzqMat);
  franjaIzq.position.set(-2.95, tripodH - 1.1, 0.06);
  portadaGroup.add(franjaIzq);

  // Tela derecha: verde con franja azul
  const telaDerMat = new THREE.MeshStandardMaterial({
    color: ORION_COLORS.verde,
    side: THREE.DoubleSide,
    roughness: 0.85
  });
  const telaDer = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.6), telaDerMat);
  telaDer.position.set(3.35, tripodH - 1.1, 0.05);
  portadaGroup.add(telaDer);

  // Franja azul en tela derecha
  const franjaDerMat = new THREE.MeshStandardMaterial({
    color: ORION_COLORS.azul,
    side: THREE.DoubleSide,
    roughness: 0.85
  });
  const franjaDer = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 1.6), franjaDerMat);
  franjaDer.position.set(2.95, tripodH - 1.1, 0.06);
  portadaGroup.add(franjaDer);

  // ── Letreros de madera pirograbada ────────────────────────────────────────
  const signWoodMat = new THREE.MeshStandardMaterial({ color: 0x3b1f0a, roughness: 0.9 });

  function createCarvedSign(text, width, height, bgColor = '#3b1f0a', textColor = '#f5c518') {
    const sGroup = new THREE.Group();
    const board = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.05), signWoodMat);
    board.castShadow = true;
    sGroup.add(board);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 128);

    // Borde decorativo en verde
    ctx.strokeStyle = '#1a7a3f';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 116);

    ctx.fillStyle = textColor;
    ctx.font = 'bold 40px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const tex = new THREE.CanvasTexture(canvas);
    const frontPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.96, height * 0.88),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    frontPlane.position.z = 0.028;
    sGroup.add(frontPlane);
    return sGroup;
  }

  // Letrero "ENTRADA VARONES"
  const signVarones = createCarvedSign('ENTRADA VARONES', 2.0, 0.38);
  signVarones.position.set(-1.3, tripodH - 0.75, 0);
  portadaGroup.add(signVarones);

  // Letrero "ENTRADA MUJERES"
  const signMujeres = createCarvedSign('ENTRADA MUJERES', 2.0, 0.38);
  signMujeres.position.set(1.3, tripodH - 0.75, 0);
  portadaGroup.add(signMujeres);

  // ── Letrero principal "CLUB ORIÓN" con logo en canvas ─────────────────────
  function createClubOrionSign() {
    const sGroup = new THREE.Group();
    const width = 3.0;
    const height = 0.65;

    // Tablón de madera oscura
    const board = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.07), signWoodMat);
    board.castShadow = true;
    sGroup.add(board);

    // Canvas con logo + texto
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');

    // Fondo azul Club Orión
    ctx.fillStyle = '#1a3a8f';
    ctx.fillRect(0, 0, 768, 192);

    // Borde amarillo
    ctx.strokeStyle = '#f5c518';
    ctx.lineWidth = 8;
    ctx.strokeRect(5, 5, 758, 182);

    // Borde verde interior
    ctx.strokeStyle = '#1a7a3f';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, 736, 160);

    // ── Logo Orión procedural (estrella + constelación) ──────────────────
    // Estrella de 5 puntas amarilla (simplificada)
    function drawStar(cx, cy, r, ctx5) {
      ctx5.save();
      ctx5.translate(cx, cy);
      ctx5.beginPath();
      for (let i = 0; i < 5; i++) {
        const outer = { x: Math.cos((-Math.PI / 2) + (i * 2 * Math.PI / 5)) * r,
                        y: Math.sin((-Math.PI / 2) + (i * 2 * Math.PI / 5)) * r };
        const inner = { x: Math.cos((-Math.PI / 2) + ((i + 0.5) * 2 * Math.PI / 5)) * (r * 0.42),
                        y: Math.sin((-Math.PI / 2) + ((i + 0.5) * 2 * Math.PI / 5)) * (r * 0.42) };
        if (i === 0) ctx5.moveTo(outer.x, outer.y);
        else ctx5.lineTo(outer.x, outer.y);
        ctx5.lineTo(inner.x, inner.y);
      }
      ctx5.closePath();
      ctx5.fillStyle = '#f5c518';
      ctx5.fill();
      ctx5.strokeStyle = '#c8a000';
      ctx5.lineWidth = 2;
      ctx5.stroke();
      ctx5.restore();
    }

    drawStar(72, 96, 52, ctx);

    // Constelación de Orión sobre la estrella (puntos blancos)
    const orionStars = [
      [60, 54], [84, 50],          // hombros
      [72, 70],                    // cabeza (Bellatrix aprox)
      [56, 92], [72, 95], [88, 92], // cinturón (las 3 Marías)
      [60, 118], [84, 120],        // pies
    ];
    ctx.fillStyle = '#ffffff';
    orionStars.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Líneas de constelación
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1.5;
    const lines = [[0,2],[2,1],[1,3],[3,4],[4,5],[3,6],[5,7]];
    lines.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(orionStars[a][0], orionStars[a][1]);
      ctx.lineTo(orionStars[b][0], orionStars[b][1]);
      ctx.stroke();
    });

    // Texto "CLUB ORIÓN"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CLUB ORIÓN', 148, 100);

    // Línea verde decorativa inferior
    ctx.fillStyle = '#1a7a3f';
    ctx.fillRect(148, 148, 590, 8);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;

    // Carga del logo oficial del Club Orión
    const imgLogo = new Image();
    imgLogo.crossOrigin = 'anonymous';
    imgLogo.src = '/logo-orion.png';
    imgLogo.onload = () => {
      // Limpiar área del logo con fondo azul
      ctx.fillStyle = '#1a3a8f';
      ctx.fillRect(20, 20, 115, 150);
      // Dibujar logo oficial
      ctx.drawImage(imgLogo, 20, 22, 115, 146);
      tex.needsUpdate = true;
    };

    const frontPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.97, height * 0.90),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    frontPlane.position.z = 0.038;
    sGroup.add(frontPlane);
    return sGroup;
  }

  const mainSign = createClubOrionSign();
  mainSign.position.set(0, tripodH + 0.25, 0);
  portadaGroup.add(mainSign);

  // ── Cotas 3D sobre la portada ─────────────────────────────────────────────
  const cotaMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 2 });

  function makeLabel3D(text, color = '#fbbf24') {
    const c = document.createElement('canvas');
    c.width = 320; c.height = 80;
    const cx = c.getContext('2d');
    cx.fillStyle = 'rgba(10,14,30,0.85)';
    cx.strokeStyle = color;
    cx.lineWidth = 3;
    cx.beginPath(); cx.roundRect(4, 4, 312, 72, 12); cx.fill(); cx.stroke();
    cx.fillStyle = '#ffffff';
    cx.font = 'bold 32px "JetBrains Mono", monospace';
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(text, 160, 40);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sp.scale.set(1.6, 0.4, 1);
    return sp;
  }

  // Cota de ANCHO (5.20 m)
  const cotaAnchoLine = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-2.6, tripodH + 0.55, 0),
    new THREE.Vector3( 2.6, tripodH + 0.55, 0),
  ]);
  portadaGroup.add(new THREE.Line(cotaAnchoLine, cotaMat));
  // ticks
  for (const sx of [-2.6, 2.6]) {
    const t = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(sx, tripodH + 0.45, 0),
      new THREE.Vector3(sx, tripodH + 0.65, 0),
    ]);
    portadaGroup.add(new THREE.Line(t, cotaMat));
  }
  const labelAncho = makeLabel3D('↔ 5.20 m');
  labelAncho.position.set(0, tripodH + 0.80, 0);
  portadaGroup.add(labelAncho);

  // Cota de ALTURA (3.00 m)
  const cotaAltLine = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(3.3, 0, 0),
    new THREE.Vector3(3.3, tripodH, 0),
  ]);
  portadaGroup.add(new THREE.Line(cotaAltLine, cotaMat));
  for (const sy of [0, tripodH]) {
    const t = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(3.1, sy, 0),
      new THREE.Vector3(3.5, sy, 0),
    ]);
    portadaGroup.add(new THREE.Line(t, cotaMat));
  }
  const labelAltura = makeLabel3D('↕ 3.00 m');
  labelAltura.position.set(4.2, tripodH / 2, 0);
  portadaGroup.add(labelAltura);

  // ── userData para el Inspector (clic en portada) ──────────────────────────
  portadaGroup.userData = {
    title: 'Portada Club Orión',
    category: 'Ingreso Principal',
    desc: '3 trípodes pioneros con travesaño de 5.80 m. Altura máxima 3.00 m. Colores institucionales del Club Orión.',
    specs: [
      { label: 'Ancho frontal',          val: PORTADA_SPECS.anchoPortada },
      { label: 'Altura máxima',          val: PORTADA_SPECS.alturaPortada },
      { label: 'Palos trípode (c/u)',    val: `${PORTADA_SPECS.palosTripodesLargo} · ${PORTADA_SPECS.palosTripodesD}` },
      { label: 'Palos trípode (total)',  val: `${PORTADA_SPECS.cantTripodesTotal} palos` },
      { label: 'Travesaño',             val: `${PORTADA_SPECS.travesañoLargo} · ${PORTADA_SPECS.travesañoD}` },
      { label: 'Driza portada',          val: `${PORTADA_SPECS.drizaPortadaTotal} · ${PORTADA_SPECS.drizaPortadaD}` },
      { label: 'Estacas cerco (c/u)',    val: `${PORTADA_SPECS.estacasLargo} · ${PORTADA_SPECS.estacasD}` },
      { label: 'Estacas cerco (total)',  val: `${PORTADA_SPECS.cantEstacas} estacas` },
      { label: 'Driza cerco',            val: `${PORTADA_SPECS.drizaCercoTotal} · ${PORTADA_SPECS.drizaCercoD}` },
    ]
  };

  group.add(portadaGroup);

  // ==============================================================
  // 2. CERCO PERIMÉTRICO (ÚNICAMENTE EN EL FRONTIS Z = +9.0m)
  // ==============================================================
  const fenceGroup = new THREE.Group();
  fenceGroup.name = 'FrontFenceGroup';

  const stakeGeo = new THREE.CylinderGeometry(0.025, 0.030, 1.20, 8);
  const stakeMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.9 });
  const drizaMat = new THREE.LineBasicMaterial({ color: ORION_COLORS.amarillo });

  const zFront = 8.98;

  for (let x = -10.0; x <= -2.8; x += 1.4) {
    const stake = new THREE.Mesh(stakeGeo, stakeMat);
    stake.position.set(x, 0.60, zFront);
    stake.castShadow = true;
    fenceGroup.add(stake);
  }

  for (let x = 2.8; x <= 10.0; x += 1.4) {
    const stake = new THREE.Mesh(stakeGeo, stakeMat);
    stake.position.set(x, 0.60, zFront);
    stake.castShadow = true;
    fenceGroup.add(stake);
  }

  // 3 niveles de driza tensada
  for (const h of [0.30, 0.65, 1.00]) {
    const lineGeoIzq = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10.0, h, zFront),
      new THREE.Vector3(-2.8,  h, zFront)
    ]);
    fenceGroup.add(new THREE.Line(lineGeoIzq, drizaMat));

    const lineGeoDer = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2.8,  h, zFront),
      new THREE.Vector3(10.0, h, zFront)
    ]);
    fenceGroup.add(new THREE.Line(lineGeoDer, drizaMat));
  }

  // userData del cerco
  fenceGroup.userData = {
    title: 'Cerco Frontal',
    category: 'Límite Perimetral',
    specs: [
      { label: 'Largo cerco (c/lado)', val: PORTADA_SPECS.anchoCerco },
      { label: 'Estacas',              val: `${PORTADA_SPECS.cantEstacas} · ${PORTADA_SPECS.estacasLargo} · ${PORTADA_SPECS.estacasD}` },
      { label: 'Driza (3 niveles)',    val: `${PORTADA_SPECS.drizaCercoTotal} · ${PORTADA_SPECS.drizaCercoD}` },
      { label: 'Altura niveles',       val: '30 cm / 65 cm / 100 cm' },
    ]
  };

  group.add(fenceGroup);
  return group;
}
