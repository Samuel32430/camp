import * as THREE from 'three';

/**
 * Módulo pionero de Tendedero-Zapatero optimizado con recursos compartidos:
 * - 2 trípodes pequeños de palos de escoba
 * - 1 travesaño horizontal superior (tendedero para ropa y toallas)
 * - 2 travesaños horizontales inferiores paralelos (zapatero elevado del piso)
 * - Toalla y zapatos de campamento para realismo
 */

// Geometrías y Materiales compartidos entre los 20 tendederos (ahorro masivo de memoria y GPU VBOs)
const poleRadius = 0.018; // Radio de palo de escoba
const tripodHeight = 0.95; // Altura de 95 cm
const spanLength = 1.10;   // 1.10 m de largo

const sharedWoodMat = new THREE.MeshStandardMaterial({
  color: 0xc89b65,
  roughness: 0.85,
  metalness: 0.05
});

const sharedRopeMat = new THREE.MeshStandardMaterial({
  color: 0xfef08a,
  roughness: 0.9
});

const sharedShoeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });

const sharedTowelMatBlue = new THREE.MeshStandardMaterial({
  color: 0x38bdf8,
  roughness: 0.9,
  side: THREE.DoubleSide
});
const sharedTowelMatPink = new THREE.MeshStandardMaterial({
  color: 0xf43f5e,
  roughness: 0.9,
  side: THREE.DoubleSide
});

const sharedLegGeo = new THREE.CylinderGeometry(poleRadius, poleRadius, tripodHeight + 0.1, 8);
const sharedKnotGeo = new THREE.TorusGeometry(0.045, 0.02, 6, 12);
const sharedTopBarGeo = new THREE.CylinderGeometry(poleRadius, poleRadius, spanLength + 0.25, 8);
const sharedKnotTopGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.06, 8);
const sharedBottomBarGeo = new THREE.CylinderGeometry(poleRadius * 0.9, poleRadius * 0.9, spanLength + 0.08, 8);
const sharedTowelGeo = new THREE.PlaneGeometry(0.35, 0.45);
const sharedShoeGeo = new THREE.BoxGeometry(0.18, 0.09, 0.10);

export function createTendederoZapatero() {
  const group = new THREE.Group();
  group.name = 'TendederoZapatero';

  // Función auxiliar para construir un trípode de 3 palos
  function createTripod(xOffset) {
    const tripod = new THREE.Group();
    tripod.position.x = xOffset;
    const spread = 0.22; // Apertura de patas

    // Pata 1 (Frontal izquierda)
    const leg1 = new THREE.Mesh(sharedLegGeo, sharedWoodMat);
    leg1.position.set(-spread * 0.7, tripodHeight / 2, spread * 0.7);
    leg1.rotation.x = 0.22;
    leg1.rotation.z = -0.22;
    leg1.castShadow = true;
    tripod.add(leg1);

    // Pata 2 (Frontal derecha)
    const leg2 = new THREE.Mesh(sharedLegGeo, sharedWoodMat);
    leg2.position.set(spread * 0.7, tripodHeight / 2, spread * 0.7);
    leg2.rotation.x = 0.22;
    leg2.rotation.z = 0.22;
    leg2.castShadow = true;
    tripod.add(leg2);

    // Pata 3 (Trasera)
    const leg3 = new THREE.Mesh(sharedLegGeo, sharedWoodMat);
    leg3.position.set(0, tripodHeight / 2, -spread);
    leg3.rotation.x = -0.26;
    leg3.castShadow = true;
    tripod.add(leg3);

    // Amarre de driza en la cúspide del trípode
    const knot = new THREE.Mesh(sharedKnotGeo, sharedRopeMat);
    knot.position.set(0, tripodHeight - 0.05, 0);
    knot.rotation.x = Math.PI / 2;
    tripod.add(knot);

    return tripod;
  }

  // 1. Trípode Izquierdo
  const leftTripod = createTripod(-spanLength / 2);
  group.add(leftTripod);

  // 2. Trípode Derecho
  const rightTripod = createTripod(spanLength / 2);
  group.add(rightTripod);

  // 3. Travesaño Superior (TENDEDERO para ropa / toallas)
  const topBar = new THREE.Mesh(sharedTopBarGeo, sharedWoodMat);
  topBar.rotation.z = Math.PI / 2;
  topBar.position.set(0, tripodHeight - 0.04, 0);
  topBar.castShadow = true;
  group.add(topBar);

  // Amarres en los extremos del travesaño superior
  const knotTopLeft = new THREE.Mesh(sharedKnotTopGeo, sharedRopeMat);
  knotTopLeft.rotation.z = Math.PI / 2;
  knotTopLeft.position.set(-spanLength / 2, tripodHeight - 0.04, 0);
  group.add(knotTopLeft);

  const knotTopRight = knotTopLeft.clone();
  knotTopRight.position.x = spanLength / 2;
  group.add(knotTopRight);

  // 4. Travesaños Inferiores Paralelos (ZAPATERO de 2 palos horizontales)
  // Palo zapatero frontal
  const shoeBar1 = new THREE.Mesh(sharedBottomBarGeo, sharedWoodMat);
  shoeBar1.rotation.z = Math.PI / 2;
  shoeBar1.position.set(0, 0.18, 0.08);
  group.add(shoeBar1);

  // Palo zapatero posterior
  const shoeBar2 = new THREE.Mesh(sharedBottomBarGeo, sharedWoodMat);
  shoeBar2.rotation.z = Math.PI / 2;
  shoeBar2.position.set(0, 0.18, -0.08);
  group.add(shoeBar2);

  // 5. Detalles de Realismo: Toalla de secado colgada y calzado sobre el zapatero
  const towelMat = Math.random() > 0.5 ? sharedTowelMatBlue : sharedTowelMatPink;
  const towel = new THREE.Mesh(sharedTowelGeo, towelMat);
  towel.position.set(-0.15, tripodHeight - 0.22, 0.02);
  towel.castShadow = true;
  group.add(towel);

  // Zapatos de campamento descansando en el zapatero
  const shoeLeft = new THREE.Mesh(sharedShoeGeo, sharedShoeMat);
  shoeLeft.position.set(0.18, 0.22, 0);
  group.add(shoeLeft);

  const shoeRight = new THREE.Mesh(sharedShoeGeo, sharedShoeMat);
  shoeRight.position.set(0.32, 0.22, 0);
  group.add(shoeRight);

  group.userData = {
    title: 'Módulo Tendedero-Zapatero Pionero',
    category: 'Pionerismo / Higiene de Carpa',
    desc: 'Estructura scout pionera construida con 2 trípodes de palos de escoba, travesaño superior para secado de prendas y doble travesaño horizontal inferior como zapatero aislado del suelo.',
    specs: [
      { label: 'Estructura', val: '2 trípodes + 3 largueros' },
      { label: 'Material', val: 'Palos de escoba y driza' },
      { label: 'Largo × Alto', val: '1.10 m × 0.95 m' },
      { label: 'Función', val: 'Tendedero + Zapatero' }
    ]
  };

  return group;
}
