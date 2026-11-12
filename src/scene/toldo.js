import * as THREE from 'three';

/**
 * Toldo de Sombra continuo tensado que jala DIRECTO DESDE LA PORTADA (Z = +8.95m)
 * cubriendo el sendero principal, mesa de comunicaciones y el patio de formación hasta Z = -5.0m.
 */
export function createToldoYMastil() {
  const group = new THREE.Group();
  group.name = 'ToldoGroup';

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.85 });
  const ropeMat = new THREE.LineBasicMaterial({ color: 0xfef08a });

  const toldoSubGroup = new THREE.Group();
  toldoSubGroup.name = 'ToldoSombraSubGroup';

  // Dimensiones exactas:
  // Ancho: 6.8m (de X = -3.4m a +3.4m, dejando despejados los pasadizos)
  // Largo: 13.95m (desde Z = +8.95m en la viga de la Portada hasta Z = -5.0m frente al pasadizo horizontal)
  const tw = 6.8;
  const tl = 13.95;
  const toldoGeo = new THREE.PlaneGeometry(tw, tl, 24, 30);

  const posAttr = toldoGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const distFromCenter = Math.sqrt((x / (tw / 2)) ** 2 + (y / (tl / 2)) ** 2);
    const sag = -0.3 * (1.0 - Math.min(1.0, distFromCenter * 0.75));
    posAttr.setZ(i, sag);
  }
  toldoGeo.computeVertexNormals();

  const toldoMat = new THREE.MeshStandardMaterial({
    color: 0xe2d9c8,
    roughness: 0.8,
    metalness: 0.05,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.88
  });

  const toldoMesh = new THREE.Mesh(toldoGeo, toldoMat);
  toldoMesh.rotation.x = Math.PI / 2;
  // Centro en Z = (8.95 + (-5.0)) / 2 = +1.975m
  toldoMesh.position.set(0, 3.35, 1.975);
  toldoMesh.castShadow = true;
  toldoMesh.receiveShadow = true;
  toldoSubGroup.add(toldoMesh);

  // Postes de madera intermedios (Z = +2.0m) y posteriores (Z = -5.0m)
  const poleH = 3.5;
  const poleGeo = new THREE.CylinderGeometry(0.055, 0.055, poleH, 8);

  const supportPoints = [
    [-3.4, 2.0],
    [3.4, 2.0],
    [-3.4, -5.0],
    [3.4, -5.0]
  ];

  supportPoints.forEach(([px, pz]) => {
    const p = new THREE.Mesh(poleGeo, woodMat);
    p.position.set(px, poleH / 2, pz);
    p.castShadow = true;
    toldoSubGroup.add(p);

    const anchorX = px + (px > 0 ? 1.5 : -1.5);
    const anchorZ = pz + (pz < 0 ? -1.3 : 1.2);
    const anchorLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(px, poleH - 0.1, pz),
      new THREE.Vector3(anchorX, 0.05, anchorZ)
    ]);
    toldoSubGroup.add(new THREE.Line(anchorLineGeo, ropeMat));
  });

  // Amarres frontales directos a la Portada Pionera
  for (let sx of [-3.4, -1.7, 0, 1.7, 3.4]) {
    const tieGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(sx, 3.3, 8.85),
      new THREE.Vector3(sx * 0.85, 3.1, 8.95)
    ]);
    toldoSubGroup.add(new THREE.Line(tieGeo, ropeMat));
  }

  toldoSubGroup.userData = {
    title: 'Toldo Continuo desde la Portada',
    category: 'Acondicionamiento Ambiental',
    desc: 'Toldo continuo de 94.8 m² que nace de la viga de la Portada y cubre todo el patio central de formación.',
    specs: [
      { label: 'Longitud', val: '13.95 metros continuos' },
      { label: 'Ancho', val: '6.80 metros' },
      { label: 'Área Cubierta', val: '94.86 m²' },
      { label: 'Anclaje Frontal', val: 'Viga principal de la Portada' }
    ]
  };

  group.add(toldoSubGroup);
  return { toldoGroup: group, toldoSubGroup };
}
