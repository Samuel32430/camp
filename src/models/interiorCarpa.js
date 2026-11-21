import * as THREE from 'three';

/**
 * Amoblado interior hiperdetallado para la Carpa #1 de Varones
 * ubicada en X = -8.75m, Z = 3.6m (rotación Y = PI / 2, mirando al patio central).
 */
export function createInteriorCarpa() {
  const group = new THREE.Group();
  group.name = 'InteriorCarpaDetallado';

  group.position.set(-8.75, 0, 3.6);
  group.rotation.y = Math.PI / 2;

  // 1. Piso Aislante Térmico (Groundsheet)
  const tarpMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.95
  });
  const tarp = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.1), tarpMat);
  tarp.rotation.x = -Math.PI / 2;
  tarp.position.set(0, 0.02, 0);
  tarp.receiveShadow = true;
  group.add(tarp);

  // 2. Colchonetas y Sacos de Dormir (5 Unidades)
  const sleepingColors = [0x0284c7, 0x059669, 0xd97706, 0x7c3aed, 0xe11d48];
  const matMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
  const pillowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });

  const matWidth = 0.33;
  const matLength = 1.65;
  const spacing = 0.36;

  for (let i = 0; i < 5; i++) {
    const bagGroup = new THREE.Group();
    const xPos = -0.72 + i * spacing;
    bagGroup.position.set(xPos, 0, -0.15);

    const pad = new THREE.Mesh(new THREE.BoxGeometry(matWidth, 0.04, matLength), matMat);
    pad.position.y = 0.03;
    pad.castShadow = true;
    bagGroup.add(pad);

    const bagMat = new THREE.MeshStandardMaterial({
      color: sleepingColors[i],
      roughness: 0.7,
      metalness: 0.1
    });
    const sleepingBag = new THREE.Mesh(new THREE.BoxGeometry(matWidth * 0.92, 0.12, matLength * 0.85), bagMat);
    sleepingBag.position.set(0, 0.09, 0.08);
    sleepingBag.castShadow = true;
    bagGroup.add(sleepingBag);

    const pillow = new THREE.Mesh(new THREE.BoxGeometry(matWidth * 0.85, 0.08, 0.26), pillowMat);
    pillow.position.set(0, 0.13, -matLength / 2 + 0.2);
    pillow.castShadow = true;
    bagGroup.add(pillow);

    const backpackMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 });
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.2), backpackMat);
    backpack.position.set(0, 0.16, -matLength / 2 - 0.04);
    backpack.castShadow = true;
    bagGroup.add(backpack);

    group.add(bagGroup);
  }

  // 3. Linterna Colgante
  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(0, 1.2, 0);

  const cordGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.25, 4);
  const cord = new THREE.Mesh(cordGeo, new THREE.MeshBasicMaterial({ color: 0x000000 }));
  cord.position.y = 0.12;
  lanternGroup.add(cord);

  const lanternBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.13, 8),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
  );
  lanternGroup.add(lanternBody);

  const lanternGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.07, 8),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  lanternGlass.position.y = -0.02;
  lanternGroup.add(lanternGlass);

  const interiorLight = new THREE.PointLight(0xf59e0b, 1.8, 5.0);
  interiorLight.position.y = -0.04;
  // Optimización: castShadow = false elimina 6 pases cubemap de sombra por frame
  interiorLight.castShadow = false;
  lanternGroup.add(interiorLight);

  group.add(lanternGroup);

  // 4. Parante de madera visible
  const ridgePole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 2.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
  );
  ridgePole.rotation.x = Math.PI / 2;
  ridgePole.position.set(0, 1.38, 0);
  group.add(ridgePole);

  return { interiorGroup: group, interiorLight };
}
