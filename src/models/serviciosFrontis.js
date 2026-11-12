import * as THREE from 'three';

/**
 * Servicios Frontales para el terreno de 20m x 18m:
 * - Tópico Médico (15 m²) en X = -5.0m, Z = 6.8m
 * - Puesto de Seguridad (5 m²) en X = -2.8m, Z = 7.8m
 * - Almacén de Logística (15 m²) en X = +5.0m, Z = 6.8m
 * - Mesa de Comunicaciones (5 m²) en X = +2.6m, Z = 6.2m
 * (Dejando el espacio exterior de X = -8.5m y +8.5m para las carpas de Directiva)
 */
export function createServiciosFrontis() {
  const serviciosGroup = new THREE.Group();
  serviciosGroup.name = 'ServiciosFrontis';

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

  // ==========================================
  // 1. TÓPICO MÉDICO (15 m²) - Frontal Izquierdo
  // ==========================================
  const topicoGroup = new THREE.Group();
  topicoGroup.position.set(-5.0, 0, 6.8);

  const topicoCanvasMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.65,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const tw = 3.2;
  const tl = 3.8;

  const tentBase = new THREE.Mesh(new THREE.BoxGeometry(tw, 1.4, tl), topicoCanvasMat);
  tentBase.position.y = 0.7;
  tentBase.castShadow = true;
  tentBase.receiveShadow = true;
  topicoGroup.add(tentBase);

  const tentRoof = new THREE.Mesh(new THREE.ConeGeometry(tw * 0.72, 0.9, 4), topicoCanvasMat);
  tentRoof.rotation.y = Math.PI / 4;
  tentRoof.position.y = 1.4 + 0.45;
  tentRoof.castShadow = true;
  topicoGroup.add(tentRoof);

  // Cruz Roja Frontal
  const redMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
  const crossH = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.22), redMat);
  crossH.position.set(0, 1.0, tl / 2 + 0.01);
  topicoGroup.add(crossH);

  const crossV = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.7), redMat);
  crossV.position.set(0, 1.0, tl / 2 + 0.01);
  topicoGroup.add(crossV);

  // Camilla médica plegable
  const bedMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 0.65), bedMat);
  bed.position.set(0, 0.45, tl / 2 + 0.55);
  bed.castShadow = true;
  topicoGroup.add(bed);

  for (let sx of [-0.7, 0.7]) {
    for (let sz of [-0.22, 0.22]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6), frameMat);
      leg.position.set(sx, 0.22, tl / 2 + 0.55 + sz);
      topicoGroup.add(leg);
    }
  }

  // Soporte de suero
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.35, 6), frameMat);
  pole.position.set(-0.75, 0.68, tl / 2 + 0.75);
  topicoGroup.add(pole);

  topicoGroup.userData = {
    title: 'Tópico Médico de Emergencias',
    category: 'Salud y Primeros Auxilios',
    desc: 'Puesto médico de 15 m² situado en el frontis para atención inmediata y rápida evacuación.',
    specs: [
      { label: 'Área', val: '15.00 m² (3.2m × 3.8m)' },
      { label: 'Ubicación', val: 'Frontis Izquierdo' },
      { label: 'Equipamiento', val: 'Camilla, Botiquines, Medicamentos' }
    ]
  };
  serviciosGroup.add(topicoGroup);

  // ==========================================
  // 2. PUESTO DE SEGURIDAD (5 m²)
  // ==========================================
  const segGroup = new THREE.Group();
  segGroup.position.set(-2.8, 0, 7.8);

  const segCanvasMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

  for (let px of [-0.75, 0.75]) {
    for (let pz of [-0.75, 0.75]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.2, 8), woodMat);
      p.position.set(px, 1.1, pz);
      p.castShadow = true;
      segGroup.add(p);
    }
  }

  const segRoof = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.8), segCanvasMat);
  segRoof.position.set(0, 2.2, 0);
  segRoof.rotation.x = 0.06;
  segRoof.castShadow = true;
  segGroup.add(segRoof);

  const desk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.45), woodMat);
  desk.position.set(0, 0.4, 0);
  desk.castShadow = true;
  segGroup.add(desk);

  const extMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 0.42, 8),
    new THREE.MeshStandardMaterial({ color: 0xef4444 })
  );
  extMesh.position.set(0.55, 0.25, 0.4);
  extMesh.castShadow = true;
  segGroup.add(extMesh);

  segGroup.userData = {
    title: 'Puesto de Seguridad y Control',
    category: 'Seguridad y Vigilancia',
    desc: 'Control perimétrico las 24 horas y primera respuesta contra incendios.',
    specs: [
      { label: 'Área', val: '5.00 m²' },
      { label: 'Ubicación', val: 'Junto al Acceso Varones' }
    ]
  };
  serviciosGroup.add(segGroup);

  // ==========================================
  // 3. ALMACÉN DE LOGÍSTICA (15 m²) - Frontal Derecho
  // ==========================================
  const logGroup = new THREE.Group();
  logGroup.position.set(5.0, 0, 6.8);

  const logCanvasMat = new THREE.MeshStandardMaterial({
    color: 0x3f4f34,
    roughness: 0.8,
    metalness: 0.05
  });

  const logBase = new THREE.Mesh(new THREE.BoxGeometry(tw, 1.4, tl), logCanvasMat);
  logBase.position.y = 0.7;
  logBase.castShadow = true;
  logBase.receiveShadow = true;
  logGroup.add(logBase);

  const logRoof = new THREE.Mesh(new THREE.ConeGeometry(tw * 0.72, 0.9, 4), logCanvasMat);
  logRoof.rotation.y = Math.PI / 4;
  logRoof.position.y = 1.4 + 0.45;
  logRoof.castShadow = true;
  logGroup.add(logRoof);

  // Cajas de suministros
  const crateMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 });
  const crateGeo = new THREE.BoxGeometry(0.6, 0.42, 0.5);

  const crate1 = new THREE.Mesh(crateGeo, crateMat);
  crate1.position.set(-0.55, 0.21, tl / 2 + 0.45);
  crate1.castShadow = true;
  logGroup.add(crate1);

  const crate2 = new THREE.Mesh(crateGeo, crateMat);
  crate2.position.set(-0.55, 0.63, tl / 2 + 0.45);
  crate2.rotation.y = 0.12;
  crate2.castShadow = true;
  logGroup.add(crate2);

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.75, 12),
    new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.5 })
  );
  barrel.position.set(0.55, 0.38, tl / 2 + 0.45);
  barrel.castShadow = true;
  logGroup.add(barrel);

  logGroup.userData = {
    title: 'Almacén de Logística e Intendencia',
    category: 'Logística y Abastecimiento',
    desc: 'Centro de acopio de víveres, agua potable, combustible y herramientas pioneras.',
    specs: [
      { label: 'Área', val: '15.00 m² (3.2m × 3.8m)' },
      { label: 'Ubicación', val: 'Frontis Derecho' },
    ]
  };
  serviciosGroup.add(logGroup);

  // ==============================================================
  // 4. MESA DE COMUNICACIONES Y EDICIÓN DE VIDEOS
  // ==============================================================
  const commGroup = new THREE.Group();
  commGroup.position.set(2.6, 0, 6.2);

  const tableTopMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.85 });
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.8), tableTopMat);
  tableTop.position.set(0, 0.75, 0);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  commGroup.add(tableTop);

  for (let mx of [-0.65, 0.65]) {
    for (let mz of [-0.3, 0.3]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), woodMat);
      leg.position.set(mx, 0.36, mz);
      leg.castShadow = true;
      commGroup.add(leg);
    }
  }

  for (let bz of [-0.55, 0.55]) {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.28), tableTopMat);
    bench.position.set(0, 0.42, bz);
    bench.castShadow = true;
    commGroup.add(bench);
  }

  // Laptops con pantalla iluminada
  const laptopMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  const lap1Base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.015, 0.22), laptopMat);
  lap1Base.position.set(-0.3, 0.8, 0);
  lap1Base.castShadow = true;
  commGroup.add(lap1Base);

  const lap1Screen = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.015), screenMat);
  lap1Screen.position.set(-0.3, 0.9, -0.1);
  lap1Screen.rotation.x = -0.15;
  commGroup.add(lap1Screen);

  const lap2Base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.015, 0.22), laptopMat);
  lap2Base.position.set(0.3, 0.8, 0.05);
  lap2Base.rotation.y = 0.2;
  lap2Base.castShadow = true;
  commGroup.add(lap2Base);

  const lap2Screen = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.015), screenMat);
  lap2Screen.position.set(0.3, 0.9, -0.05);
  lap2Screen.rotation.set(-0.15, 0.2, 0);
  commGroup.add(lap2Screen);

  // Cámara en trípode
  const cameraTripod = new THREE.Group();
  cameraTripod.position.set(1.1, 0, -0.35);

  const camPoleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
  for (let a = 0; a < 3; a++) {
    const angle = (a / 3) * Math.PI * 2;
    const cLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.25, 6), camPoleMat);
    cLeg.position.set(Math.cos(angle) * 0.18, 0.6, Math.sin(angle) * 0.18);
    cLeg.rotation.set(Math.sin(angle) * 0.18, 0, -Math.cos(angle) * 0.18);
    cLeg.castShadow = true;
    cameraTripod.add(cLeg);
  }

  const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.11, 0.22), camPoleMat);
  camBody.position.y = 1.25;
  cameraTripod.add(camBody);

  const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.13, 12), camPoleMat);
  camLens.rotation.x = Math.PI / 2;
  camLens.position.set(0, 1.25, -0.14);
  cameraTripod.add(camLens);

  commGroup.add(cameraTripod);

  commGroup.userData = {
    title: 'Mesa de Comunicaciones y Edición de Video',
    category: 'Comunicaciones y Audiovisuales',
    desc: 'Bajo la sombra del toldo continuo para cobertura, edición de videos y transmisión diaria.',
    specs: [
      { label: 'Ubicación', val: 'Frontal Bajo Sombra de Toldo' },
      { label: 'Equipamiento', val: 'Laptops, Trípode, Camaras' }
    ]
  };
  serviciosGroup.add(commGroup);

  return serviciosGroup;
}
