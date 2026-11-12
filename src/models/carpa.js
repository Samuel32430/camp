import * as THREE from 'three';
import { createTendederoZapatero } from './tendederoZapatero.js';

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
  position = [0, 0, 0],
  rotationY = 0,
  includeTendedero = true
} = {}) {
  const group = new THREE.Group();
  group.name = `Carpa_${type}_${id}`;
  group.position.set(...position);
  group.rotation.y = rotationY;

  const needsTendedero = includeTendedero && type !== 'directiva';

  let mainColor, flyColor, sectorName;
  if (type === 'varones') {
    mainColor = 0x1e40af; // Azul scout varones
    flyColor = 0x3b82f6;
    sectorName = 'Sector Varones';
  } else if (type === 'mujeres') {
    mainColor = 0xbe185d; // Frambuesa scout mujeres
    flyColor = 0xec4899;
    sectorName = 'Sector Mujeres';
  } else {
    mainColor = 0x3f6212; // Verde oliva directiva
    flyColor = 0x65a30d;
    sectorName = 'Directiva y Jefatura';
  }

  const canvasMat = new THREE.MeshStandardMaterial({
    color: mainColor,
    roughness: 0.75,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const flyMat = new THREE.MeshStandardMaterial({
    color: flyColor,
    roughness: 0.7,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  // Medidas exactas de la ficha técnica
  const width = 2.25;   // 2.25 m de ancho frontal
  const length = 2.40;  // 2.40 m de largo
  const height = 1.45;  // 1.45 m de altura
  const awningFront = 0.35; // 0.35 m de alero frontal

  const hw = width / 2;
  const hl = length / 2;

  // 1. Cuerpo Principal de la Carpa (2.25m x 2.40m)
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

  const tentMesh = new THREE.Mesh(tentGeo, canvasMat);
  tentMesh.castShadow = true;
  tentMesh.receiveShadow = true;
  group.add(tentMesh);

  // 2. Sobretecho con Alero Frontal de 0.35m (Largo total 2.75m)
  const flyGeo = new THREE.BufferGeometry();
  const flyExtra = 0.06;
  const fhw = hw + flyExtra;
  const fhl_front = hl + awningFront;
  const fhl_back = hl + flyExtra;
  const fh = height + flyExtra;

  const flyPositions = new Float32Array([
    -fhw, 0.1, fhl_front,   0, fh, fhl_front,   0, fh, -fhl_back,
    -fhw, 0.1, fhl_front,   0, fh, -fhl_back,  -fhw, 0.1, -fhl_back,

    0, fh, fhl_front,   fhw, 0.1, fhl_front,   fhw, 0.1, -fhl_back,
    0, fh, fhl_front,   fhw, 0.1, -fhl_back,  0, fh, -fhl_back
  ]);

  flyGeo.setAttribute('position', new THREE.BufferAttribute(flyPositions, 3));
  flyGeo.computeVertexNormals();

  const flyMesh = new THREE.Mesh(flyGeo, flyMat);
  flyMesh.castShadow = true;
  flyMesh.receiveShadow = true;
  group.add(flyMesh);

  // 3. Puerta Abierta Enrollada
  const rollMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
  const rollGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.85, 8);
  
  const rollLeft = new THREE.Mesh(rollGeo, rollMat);
  rollLeft.position.set(-hw * 0.45, 0.5, hl + 0.03);
  rollLeft.rotation.z = -0.3;
  group.add(rollLeft);

  const rollRight = new THREE.Mesh(rollGeo, rollMat);
  rollRight.position.set(hw * 0.45, 0.5, hl + 0.03);
  rollRight.rotation.z = 0.3;
  group.add(rollRight);

  // 4. Parantes Frontales
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8 });
  const poleGeo = new THREE.CylinderGeometry(0.022, 0.022, height, 8);
  
  const frontPoleLeft = new THREE.Mesh(poleGeo, poleMat);
  frontPoleLeft.position.set(-hw, height / 2, hl);
  frontPoleLeft.castShadow = true;
  group.add(frontPoleLeft);

  const frontPoleRight = new THREE.Mesh(poleGeo, poleMat);
  frontPoleRight.position.set(hw, height / 2, hl);
  frontPoleRight.castShadow = true;
  group.add(frontPoleRight);

  // 5. Vientos Tensores compactos
  const ropeMat = new THREE.LineBasicMaterial({ color: 0xfef08a });
  const pegGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.15, 6);
  const pegMat = new THREE.MeshStandardMaterial({ color: 0x713f12 });

  const cornerOffsets = [
    [-hw - 0.2, 0, fhl_front + 0.2],
    [hw + 0.2, 0, fhl_front + 0.2],
    [-hw - 0.2, 0, -fhl_back - 0.2],
    [hw + 0.2, 0, -fhl_back - 0.2]
  ];

  cornerOffsets.forEach(([px, py, pz]) => {
    const peg = new THREE.Mesh(pegGeo, pegMat);
    peg.position.set(px, 0.07, pz);
    peg.rotation.z = (px > 0 ? 0.3 : -0.3);
    group.add(peg);

    const startX = (px > 0 ? hw : -hw);
    const startZ = (pz > 0 ? hl : -hl);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(startX, 0.75, startZ),
      new THREE.Vector3(px, 0.05, pz)
    ]);
    group.add(new THREE.Line(lineGeo, ropeMat));
  });

  // 6. Luz Interior Cálida
  const tentLight = new THREE.PointLight(0xf59e0b, 0.6, 3.2);
  tentLight.position.set(0, 0.85, 0);
  tentLight.name = 'TentInteriorLight';
  group.add(tentLight);

  // 7. Módulo Tendedero-Zapatero al Lateral
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

  // 8. Ficha Técnica Exacta
  const hasConstruccion = needsTendedero ? 'Con Tendedero (1.0×0.5m) y Zapatero (0.8×0.4m)' : 'Sin construcción';
  group.userData = {
    title: `Carpa #${id} (${sectorName})`,
    category: sectorName,
    specs: [
      { label: 'Cuerpo Carpa', val: '2.25 m × 2.40 m' },
      { label: 'Alero Frontal', val: '0.35 m' },
      { label: 'Largo Total Módulo', val: '2.75 m' },
      { label: 'Área Total Módulo', val: '6.60 m² (2.40m × 2.75m)' },
      { label: 'Capacidad', val: '5 - 6 participantes' },
      { label: 'Equipamiento', val: hasConstruccion }
    ]
  };

  return group;
}
