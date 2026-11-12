import * as THREE from 'three';

/**
 * Sistema de Iluminación Nocturna para el campamento:
 * - Guirnalda de luces cálidas suspendidas a lo largo del patio cubierto.
 * - Bombillas LED con efecto de brillo emisivo.
 * - Puntos de luz cálida que iluminan el suelo y las áreas de reunión.
 * - Foco direccional hacia el mástil y las banderas.
 * - Conmutación automática según el modo de tiempo (Día, Atardecer, Noche).
 */
export function createLucesNocturnas() {
  const group = new THREE.Group();
  group.name = 'LucesNocturnasGroup';

  const cableMat = new THREE.LineBasicMaterial({ color: 0x1f2937, linewidth: 2 });

  // Material de las bombillas (se modula dinámicamente según la hora)
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xfbbf24,
    emissiveIntensity: 0.0,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  const bulbGeo = new THREE.SphereGeometry(0.065, 8, 8);
  const capGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.04, 6);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });

  // 1. Dos tiras paralelas de guirnalda a lo largo del patio
  const xTiras = [-1.8, 1.8];
  const zStart = 8.2;
  const zEnd = -4.5;
  const numBulbsPerTira = 11;
  const stepZ = (zEnd - zStart) / (numBulbsPerTira - 1);

  xTiras.forEach((xPos) => {
    const points = [];
    for (let i = 0; i < numBulbsPerTira; i++) {
      const z = zStart + i * stepZ;
      // Ligera catenaria (caída en el centro de cada tramo)
      const sag = Math.sin((i / (numBulbsPerTira - 1)) * Math.PI) * 0.18;
      const y = 3.05 - sag;
      points.push(new THREE.Vector3(xPos, y, z));

      // Módulo de bombilla
      const bulbGroup = new THREE.Group();
      bulbGroup.position.set(xPos, y - 0.05, z);

      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 0.04;
      bulbGroup.add(cap);

      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.y = -0.04;
      bulbGroup.add(bulb);

      group.add(bulbGroup);
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, cableMat);
    group.add(line);
  });

  // 2. Luces puntuales cálidas bajo la cubierta
  const pointLights = [];
  const lightZPositions = [6.5, 2.5, -1.0, -4.0];

  lightZPositions.forEach((z, idx) => {
    const pl = new THREE.PointLight(0xffaa33, 0.0, 8.5, 1.8);
    pl.position.set(idx % 2 === 0 ? -0.8 : 0.8, 2.85, z);
    pl.castShadow = true;
    pl.shadow.bias = -0.002;
    pl.shadow.mapSize.width = 512;
    pl.shadow.mapSize.height = 512;
    group.add(pl);
    pointLights.push(pl);
  });

  // Control de intensidad según el tiempo
  function setLucesNocturnasMode(mode) {
    if (mode === 'day') {
      bulbMat.emissiveIntensity = 0.0;
      bulbMat.opacity = 0.7;
      pointLights.forEach(pl => { pl.intensity = 0.0; });
    } else if (mode === 'sunset') {
      bulbMat.emissiveIntensity = 0.6;
      bulbMat.opacity = 0.95;
      pointLights.forEach(pl => { pl.intensity = 0.45; });
    } else if (mode === 'night') {
      bulbMat.emissiveIntensity = 2.2;
      bulbMat.opacity = 1.0;
      pointLights.forEach(pl => { pl.intensity = 1.45; });
    }
  }

  // Inicializar apagadas para modo día
  setLucesNocturnasMode('day');

  // Desactivar raycast para que los clics no abran tarjeta de información sobre las guirnaldas
  group.traverse(obj => {
    obj.raycast = () => {};
  });

  return { lucesNocturnasGroup: group, setLucesNocturnasMode };
}
