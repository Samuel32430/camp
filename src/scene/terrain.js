import * as THREE from 'three';

/**
 * Terreno con las medidas exactas calculadas: 20.00m x 18.00m = 360.00 m²
 * - 8 carpas al fondo con pasadizo horizontal de 1.50m
 * - Pasadizos verticales de 1.50m entre filas
 * - Patio central despejado de 6.80m de ancho
 */
export function createTerrain(scene) {
  const terrainGroup = new THREE.Group();
  terrainGroup.name = 'TerrainGroup';

  // 1. Entorno Exterior de Naturaleza
  const outerGeo = new THREE.PlaneGeometry(60, 50, 32, 32);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0x3d6634,
    roughness: 0.9,
    metalness: 0.1
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  outerMesh.rotation.x = -Math.PI / 2;
  outerMesh.position.y = -0.05;
  outerMesh.receiveShadow = true;
  terrainGroup.add(outerMesh);

  // 2. Terreno Oficial: 20.00m x 18.00m (360.00 m²)
  // X: de -10.0m a +10.0m (20.0m de ancho)
  // Z: de -9.0m a +9.0m (18.0m de largo)
  const lotGeo = new THREE.PlaneGeometry(20, 18, 40, 36);
  const lotMat = new THREE.MeshStandardMaterial({
    color: 0x4f7942,
    roughness: 0.8,
    metalness: 0.1
  });
  const lotMesh = new THREE.Mesh(lotGeo, lotMat);
  lotMesh.rotation.x = -Math.PI / 2;
  lotMesh.position.y = 0.0;
  lotMesh.receiveShadow = true;
  lotMesh.userData = {
    title: 'Terreno Oficial del Campamento',
    category: 'Lote Calculado 360 m²',
    desc: 'Distribución matemática de 20m × 18m con 8 carpas al fondo, 25 carpas totales, pasadizos de 1.5m y centro libre de 6.8m.',
    specs: [
      { label: 'Dimensiones', val: '20.00 m × 18.00 m' },
      { label: 'Área Total', val: '360.00 m²' },
      { label: 'Fila Posterior', val: '8 carpas (4 varones / 4 mujeres)' },
      { label: 'Pasadizos', val: '1.50 m (horizontal y verticales)' },
      { label: 'Patio Central', val: '6.80 m de ancho libre' }
    ]
  };
  terrainGroup.add(lotMesh);

  // 3. Senderos de Tierra Compacta (Dirt Paths)
  const pathMat = new THREE.MeshStandardMaterial({
    color: 0xb5915f,
    roughness: 0.95,
    metalness: 0.05
  });

  // A. Sendero de Acceso Principal (desde la portada Z=+9 hasta el patio Z=+4.5)
  const mainPath = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 4.5), pathMat);
  mainPath.rotation.x = -Math.PI / 2;
  mainPath.position.set(0, 0.015, 6.8);
  mainPath.receiveShadow = true;
  terrainGroup.add(mainPath);

  // B. Pasadizo Horizontal del Fondo (1.50m de ancho en Z = -5.8m, de X = -9.6m a +9.6m)
  const backCrossPath = new THREE.Mesh(new THREE.PlaneGeometry(19.2, 1.5), pathMat);
  backCrossPath.rotation.x = -Math.PI / 2;
  backCrossPath.position.set(0, 0.015, -5.8);
  backCrossPath.receiveShadow = true;
  terrainGroup.add(backCrossPath);

  // C. Pasadizo Vertical Ala Varones (1.50m de ancho en X = -6.8m, de Z = -5.0m a +4.5m)
  const varonesPath = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 9.8), pathMat);
  varonesPath.rotation.x = -Math.PI / 2;
  varonesPath.position.set(-6.8, 0.015, -0.2);
  varonesPath.receiveShadow = true;
  terrainGroup.add(varonesPath);

  // D. Pasadizo Vertical Ala Mujeres (1.50m de ancho en X = +6.8m, de Z = -5.0m a +4.5m)
  const mujeresPath = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 9.8), pathMat);
  mujeresPath.rotation.x = -Math.PI / 2;
  mujeresPath.position.set(6.8, 0.015, -0.2);
  mujeresPath.receiveShadow = true;
  terrainGroup.add(mujeresPath);

  // E. Pasadizo Transversal Frente a Servicios (Z = +4.6m, ancho 1.5m)
  const frontCrossPath = new THREE.Mesh(new THREE.PlaneGeometry(19.2, 1.4), pathMat);
  frontCrossPath.rotation.x = -Math.PI / 2;
  frontCrossPath.position.set(0, 0.012, 4.6);
  frontCrossPath.receiveShadow = true;
  terrainGroup.add(frontCrossPath);

  // 4. Patio Central de Formación (6.80m de ancho libre)
  // X: de -3.4m a +3.4m (ancho 6.8m); Z: de -5.0m a +4.0m (largo 9.0m)
  const patioGeo = new THREE.PlaneGeometry(6.8, 8.8);
  const patioMat = new THREE.MeshStandardMaterial({
    color: 0x5a8a4b,
    roughness: 0.75,
    metalness: 0.1
  });
  const patioMesh = new THREE.Mesh(patioGeo, patioMat);
  patioMesh.rotation.x = -Math.PI / 2;
  patioMesh.position.set(0, 0.018, -0.5);
  patioMesh.receiveShadow = true;
  patioMesh.userData = {
    title: 'Patio Central de Formación',
    category: 'Área Cívica / Asamblea',
    desc: 'Espacio despejado de 60 m² (6.8m × 8.8m) cubierto por el toldo continuo para asambleas de los 130 acampantes.',
    specs: [
      { label: 'Ancho Libre', val: '6.80 metros' },
      { label: 'Largo Libre', val: '8.80 metros' },
      { label: 'Área', val: '59.84 m²' },
      { label: 'Protección', val: 'Toldo continuo desde la portada' }
    ]
  };
  terrainGroup.add(patioMesh);

  // Línea perimetral blanca del patio
  const borderEdges = new THREE.EdgesGeometry(patioGeo);
  const borderLine = new THREE.LineSegments(borderEdges, new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2
  }));
  borderLine.rotation.x = -Math.PI / 2;
  borderLine.position.set(0, 0.025, -0.5);
  terrainGroup.add(borderLine);

  // 5. Capa de Zonificación (Toggleable)
  const zonesGroup = new THREE.Group();
  zonesGroup.name = 'ZonesGroup';

  // Zona Varones (Azul)
  const zoneVarones = new THREE.Mesh(
    new THREE.PlaneGeometry(6.6, 12.0),
    new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
  );
  zoneVarones.rotation.x = -Math.PI / 2;
  zoneVarones.position.set(-6.7, 0.03, -2.0);
  zonesGroup.add(zoneVarones);

  // Zona Mujeres (Rosa)
  const zoneMujeres = new THREE.Mesh(
    new THREE.PlaneGeometry(6.6, 12.0),
    new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
  );
  zoneMujeres.rotation.x = -Math.PI / 2;
  zoneMujeres.position.set(6.7, 0.03, -2.0);
  zonesGroup.add(zoneMujeres);

  // Zona Fondo (8 carpas)
  const zoneFondo = new THREE.Mesh(
    new THREE.PlaneGeometry(19.2, 2.6),
    new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
  );
  zoneFondo.rotation.x = -Math.PI / 2;
  zoneFondo.position.set(0, 0.03, -7.5);
  zonesGroup.add(zoneFondo);

  terrainGroup.add(zonesGroup);

  // 6. Línea perimétrica del terreno oficial (20m x 18m)
  const perimeterPoints = [
    new THREE.Vector3(-10, 0.04, -9),
    new THREE.Vector3(10, 0.04, -9),
    new THREE.Vector3(10, 0.04, 9),
    new THREE.Vector3(-10, 0.04, 9),
    new THREE.Vector3(-10, 0.04, -9)
  ];
  const perimeterGeo = new THREE.BufferGeometry().setFromPoints(perimeterPoints);
  const perimeterLine = new THREE.Line(perimeterGeo, new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    linewidth: 3
  }));
  terrainGroup.add(perimeterLine);

  scene.add(terrainGroup);
  return { terrainGroup, zonesGroup, lotMesh };
}
