import * as THREE from 'three';
import { createTendederoZapatero } from './tendederoZapatero.js';

export const CLASES_CONFIG = {
  compañero: {
    nombre: 'Compañero',
    colorHex: '#dc2626',
    mainColor: 0xdc2626, // Rojo oficial
    flyColor: 0xef4444,
  },
  explorador: {
    nombre: 'Explorador',
    colorHex: '#16a34a',
    mainColor: 0x15803d, // Verde oficial
    flyColor: 0x22c55e,
  },
  pionero: {
    nombre: 'Pionero',
    colorHex: '#94a3b8',
    mainColor: 0x64748b, // Plata / Gris metálico oficial
    flyColor: 0x94a3b8,
  },
  excursionista: {
    nombre: 'Excursionista',
    colorHex: '#9333ea',
    mainColor: 0x7e22ce, // Morado oficial
    flyColor: 0xa855f7,
  },
  guia: {
    nombre: 'Guía',
    colorHex: '#eab308',
    mainColor: 0xca8a04, // Amarillo oficial
    flyColor: 0xeab308,
  }
};

// ==========================================
// GEOMETRÍAS Y MATERIALES COMPARTIDOS (CACHÉ)
// Reduce más de 300 VBOs duplicados y cientos de draw calls
// ==========================================
let sharedTentGeo = null;
let sharedFlyGeo = null;
const sharedRollGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.85, 8);
const sharedRollMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
const sharedPoleGeo = new THREE.CylinderGeometry(0.022, 0.022, 1.45, 8);
const sharedPoleMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8 });
const sharedPegGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.15, 6);
const sharedPegMat = new THREE.MeshStandardMaterial({ color: 0x713f12 });
const sharedRopeMat = new THREE.LineBasicMaterial({ color: 0xfef08a });
const materialCache = new Map();

function getCachedCanvasMaterial(color, roughness = 0.75) {
  const key = `canvas_${color}_${roughness}`;
  if (!materialCache.has(key)) {
    materialCache.set(key, new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.05,
      side: THREE.DoubleSide
    }));
  }
  return materialCache.get(key);
}

function getSharedTentGeo() {
  if (!sharedTentGeo) {
    const width = 2.25;
    const length = 2.40;
    const height = 1.45;
    const hw = width / 2;
    const hl = length / 2;
    const tentGeo = new THREE.BufferGeometry();
    const positions = new Float32Array([
      // Techo Lado Izquierdo (-X)
      -hw, 0, hl,   0, height, hl,   0, height, -hl,
      -hw, 0, hl,   0, height, -hl,  -hw, 0, -hl,

      // Techo Lado Derecho (+X)
      0, height, hl,   hw, 0, hl,   hw, 0, -hl,
      0, height, hl,   hw, 0, -hl,  0, height, -hl,

      // Pared Trasera (-Z)
      -hw, 0, -hl,   0, height, -hl,   hw, 0, -hl,

      // Suelo impermeable (2.25m x 2.40m)
      -hw, 0.01, hl,   hw, 0.01, hl,   hw, 0.01, -hl,
      -hw, 0.01, hl,   hw, 0.01, -hl,  -hw, 0.01, -hl
    ]);
    tentGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    tentGeo.computeVertexNormals();
    sharedTentGeo = tentGeo;
  }
  return sharedTentGeo;
}

function getSharedFlyGeo() {
  if (!sharedFlyGeo) {
    const width = 2.25;
    const length = 2.40;
    const height = 1.45;
    const awningFront = 0.35;
    const hw = width / 2;
    const hl = length / 2;
    const flyExtra = 0.06;
    const fhw = hw + flyExtra;
    const fhl_front = hl + awningFront;
    const fhl_back = hl + flyExtra;
    const fh = height + flyExtra;

    const flyGeo = new THREE.BufferGeometry();
    const flyPositions = new Float32Array([
      -fhw, 0.1, fhl_front,   0, fh, fhl_front,   0, fh, -fhl_back,
      -fhw, 0.1, fhl_front,   0, fh, -fhl_back,  -fhw, 0.1, -fhl_back,

      0, fh, fhl_front,   fhw, 0.1, fhl_front,   fhw, 0.1, -fhl_back,
      0, fh, fhl_front,   fhw, 0.1, -fhl_back,  0, fh, -fhl_back
    ]);
    flyGeo.setAttribute('position', new THREE.BufferAttribute(flyPositions, 3));
    flyGeo.computeVertexNormals();
    sharedFlyGeo = flyGeo;
  }
  return sharedFlyGeo;
}

/**
 * Carpa de campaña con las medidas oficiales del plano (Módulo 6.6 m²):
 * - Ancho frontal: 2.25 m
 * - Largo cumbrera: 2.40 m
 * - Alero frontal (voladizo): 0.35 m
 * - Largo total del módulo: 2.75 m (2.40m + 0.35m)
 * - Área total del módulo: 6.60 m² (2.40m × 2.75m)
 * - Tendedero (1.0m × 0.5m) y Zapatero (0.8m × 0.4m) ubicados al lateral
 */
export function createCarpa({
  id = 1,
  type = 'varones',
  clase = null,
  position = [0, 0, 0],
  rotationY = 0,
  includeTendedero = true
} = {}) {
  const group = new THREE.Group();
  group.name = `Carpa_${type}_${clase || 'base'}_${id}`;
  group.position.set(...position);
  group.rotation.y = rotationY;

  const needsTendedero = includeTendedero && type !== 'directiva';

  let mainColor, flyColor, sectorName;
  if (type === 'varones') {
    mainColor = 0x1e40af; // Azul scout varones base
    flyColor = 0x3b82f6;
    sectorName = 'Sector Varones';
  } else if (type === 'mujeres') {
    mainColor = 0xbe185d; // Frambuesa scout mujeres base
    flyColor = 0xec4899;
    sectorName = 'Sector Mujeres';
  } else {
    mainColor = 0x3f6212; // Verde oliva directiva
    flyColor = 0x65a30d;
    sectorName = 'Directiva y Jefatura';
  }

  // Aplicar color de la Clase Scout si está designada
  let claseNombre = null;
  const claseKey = clase ? clase.toLowerCase().trim() : null;
  if (claseKey && CLASES_CONFIG[claseKey]) {
    const cfg = CLASES_CONFIG[claseKey];
    mainColor = cfg.mainColor;
    flyColor = cfg.flyColor;
    claseNombre = cfg.nombre;
  }

  const canvasMat = getCachedCanvasMaterial(mainColor, 0.75);
  const flyMat = getCachedCanvasMaterial(flyColor, 0.70);

  // 1. Cuerpo Principal de la Carpa (2.25m x 2.40m)
  const tentMesh = new THREE.Mesh(getSharedTentGeo(), canvasMat);
  tentMesh.castShadow = true;
  tentMesh.receiveShadow = true;
  group.add(tentMesh);

  // 2. Sobretecho con Alero Frontal de 0.35m (Largo total 2.75m)
  const flyMesh = new THREE.Mesh(getSharedFlyGeo(), flyMat);
  flyMesh.castShadow = true;
  flyMesh.receiveShadow = true;
  group.add(flyMesh);

  const width = 2.25;
  const length = 2.40;
  const height = 1.45;
  const awningFront = 0.35;
  const hw = width / 2;
  const hl = length / 2;
  const flyExtra = 0.06;
  const fhl_front = hl + awningFront;
  const fhl_back = hl + flyExtra;

  // 3. Puerta Abierta Enrollada
  const rollLeft = new THREE.Mesh(sharedRollGeo, sharedRollMat);
  rollLeft.position.set(-hw * 0.45, 0.5, hl + 0.03);
  rollLeft.rotation.z = -0.3;
  group.add(rollLeft);

  const rollRight = new THREE.Mesh(sharedRollGeo, sharedRollMat);
  rollRight.position.set(hw * 0.45, 0.5, hl + 0.03);
  rollRight.rotation.z = 0.3;
  group.add(rollRight);

  // 4. Parantes Frontales
  const frontPoleLeft = new THREE.Mesh(sharedPoleGeo, sharedPoleMat);
  frontPoleLeft.position.set(-hw, height / 2, hl);
  frontPoleLeft.castShadow = true;
  group.add(frontPoleLeft);

  const frontPoleRight = new THREE.Mesh(sharedPoleGeo, sharedPoleMat);
  frontPoleRight.position.set(hw, height / 2, hl);
  frontPoleRight.castShadow = true;
  group.add(frontPoleRight);

  // 5. Vientos Tensores compactos (Optimizado con LineSegments único)
  const cornerOffsets = [
    [-hw - 0.2, 0, fhl_front + 0.2],
    [hw + 0.2, 0, fhl_front + 0.2],
    [-hw - 0.2, 0, -fhl_back - 0.2],
    [hw + 0.2, 0, -fhl_back - 0.2]
  ];

  const ropePoints = [];
  cornerOffsets.forEach(([px, py, pz]) => {
    const peg = new THREE.Mesh(sharedPegGeo, sharedPegMat);
    peg.position.set(px, 0.07, pz);
    peg.rotation.z = (px > 0 ? 0.3 : -0.3);
    group.add(peg);

    const startX = (px > 0 ? hw : -hw);
    const startZ = (pz > 0 ? hl : -hl);
    ropePoints.push(
      new THREE.Vector3(startX, 0.75, startZ),
      new THREE.Vector3(px, 0.05, pz)
    );
  });

  const ropeGeo = new THREE.BufferGeometry().setFromPoints(ropePoints);
  group.add(new THREE.LineSegments(ropeGeo, sharedRopeMat));

  // 6. Módulo Tendedero-Zapatero al Lateral
  // Según el plano: Tendedero 1.0m x 0.5m + Zapatero 0.8m x 0.4m
  if (needsTendedero) {
    const tendedero = createTendederoZapatero();
    
    if (type === 'varones') {
      tendedero.position.set(-hw - 0.5, 0, 0.0);
      tendedero.rotation.y = Math.PI / 2;
    } else {
      tendedero.position.set(hw + 0.5, 0, 0.0);
      tendedero.rotation.y = Math.PI / 2;
    }
    
    group.add(tendedero);
  }

  // 7. Ficha Técnica Exacta con Clase Scout
  const hasConstruccion = needsTendedero ? 'Con Tendedero (1.0×0.5m) y Zapatero (0.8×0.4m)' : 'Sin construcción';
  const claseTitulo = claseNombre ? ` · Clase ${claseNombre}` : '';
  group.userData = {
    title: `Carpa #${id} (${sectorName}${claseTitulo})`,
    category: `${sectorName}${claseTitulo}`,
    specs: [
      ...(claseNombre ? [{ label: 'Clase', val: claseNombre }] : []),
      { label: 'Carpa', val: '2.25 m × 2.40 m' },
      { label: 'Frontal', val: '0.35 m' },
      { label: 'Largo Total Módulo', val: '2.75 m' },
      { label: 'Área Total Módulo', val: '6.60 m² (2.40m × 2.75m)' },
      { label: 'Capacidad', val: '5 - 6 participantes' },
      { label: 'Construccion', val: hasConstruccion }
    ]
  };

  return group;
}
