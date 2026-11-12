import * as THREE from 'three';

/**
 * Portada pionera de troncos con amarres sin pozos y cerco SOLO en el frontis
 * para el terreno de 20.00m de ancho en Z = +8.95m.
 */
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
  // 1. PORTADA (Centro frontal: X = -2.7 a +2.7, Z = +8.95)
  // ==============================================================
  const portadaGroup = new THREE.Group();
  portadaGroup.position.set(0, 0, 8.95);

  const tripodH = 3.3;
  const logR = 0.07;

  function createPioneerTripod(xOffset) {
    const tGroup = new THREE.Group();
    tGroup.position.x = xOffset;

    const legGeo = new THREE.CylinderGeometry(logR, logR, tripodH + 0.3, 8);
    const spreadZ = 0.6;
    const spreadX = 0.42;

    const leg1 = new THREE.Mesh(legGeo, woodMat);
    leg1.position.set(-spreadX, tripodH / 2, spreadZ);
    leg1.rotation.set(0.18, 0, -0.14);
    leg1.castShadow = true;
    tGroup.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, woodMat);
    leg2.position.set(spreadX, tripodH / 2, spreadZ);
    leg2.rotation.set(0.18, 0, 0.14);
    leg2.castShadow = true;
    tGroup.add(leg2);

    const leg3 = new THREE.Mesh(legGeo, woodMat);
    leg3.position.set(0, tripodH / 2, -spreadZ);
    leg3.rotation.set(-0.24, 0, 0);
    leg3.castShadow = true;
    tGroup.add(leg3);

    const knot = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.045, 8, 16), ropeMat);
    knot.position.set(0, tripodH - 0.1, 0);
    knot.rotation.x = Math.PI / 2;
    tGroup.add(knot);

    return tGroup;
  }

  // 3 Trípodes: Izquierdo (X=-2.6), Central (X=0), Derecho (X=+2.6)
  const tripIzq = createPioneerTripod(-2.6);
  const tripCen = createPioneerTripod(0);
  const tripDer = createPioneerTripod(2.6);
  portadaGroup.add(tripIzq);
  portadaGroup.add(tripCen);
  portadaGroup.add(tripDer);

  // Viga travesaño horizontal superior (5.8m de largo)
  const beamGeo = new THREE.CylinderGeometry(logR * 0.9, logR * 0.9, 5.8, 8);
  const beam = new THREE.Mesh(beamGeo, woodMat);
  beam.rotation.z = Math.PI / 2;
  beam.position.set(0, tripodH - 0.25, 0);
  beam.castShadow = true;
  portadaGroup.add(beam);

  for (let bx of [-2.6, 0, 2.6]) {
    const k = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.2, 8), ropeMat);
    k.rotation.z = Math.PI / 2;
    k.position.set(bx, tripodH - 0.25, 0);
    portadaGroup.add(k);
  }

  // Letreros de madera pirograbada
  const signWoodMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.9 });

  function createCarvedSign(text, width, height) {
    const sGroup = new THREE.Group();
    const board = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.05), signWoodMat);
    board.castShadow = true;
    sGroup.add(board);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4a2e18';
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
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

  const signVarones = createCarvedSign('ENTRADA VARONES', 2.1, 0.4);
  signVarones.position.set(-1.3, tripodH - 0.8, 0);
  portadaGroup.add(signVarones);

  const signMujeres = createCarvedSign('ENTRADA MUJERES', 2.1, 0.4);
  signMujeres.position.set(1.3, tripodH - 0.8, 0);
  portadaGroup.add(signMujeres);

  const mainSign = createCarvedSign('PORTADA', 2.6, 0.48);
  mainSign.position.set(0, tripodH + 0.35, 0);
  portadaGroup.add(mainSign);

  portadaGroup.userData = {
    title: 'Portada con Trípodes',
    category: 'Ingreso Principal',
    desc: 'Construcción pionera scout con 3 grandes trípodes de troncos y amarres de driza sin excavaciones, ofreciendo doble ingreso independiente.',
    specs: [
      { label: 'Estructura', val: '3 Trípodes + Palo de 5.8m' },
      { label: 'Ancho Frontal', val: '5.20 m' },
      { label: 'Altura', val: '3.30 m' }
    ]
  };

  group.add(portadaGroup);

  // ==============================================================
  // 2. CERCO PERIMÉTRICO (ÚNICAMENTE EN EL FRONTIS Z = +9.0m)
  // ==============================================================
  const fenceGroup = new THREE.Group();
  fenceGroup.name = 'FrontFenceGroup';

  const stakeGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.15, 8);
  const stakeMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.9 });
  const drizaMat = new THREE.LineBasicMaterial({ color: 0xfef08a });

  const zFront = 8.98;

  // Estacas en Frontal Izquierdo (X = -10.0 a -2.8)
  for (let x = -10.0; x <= -2.8; x += 1.4) {
    const stake = new THREE.Mesh(stakeGeo, stakeMat);
    stake.position.set(x, 0.55, zFront);
    stake.castShadow = true;
    fenceGroup.add(stake);
  }

  // Estacas en Frontal Derecho (X = 2.8 a 10.0)
  for (let x = 2.8; x <= 10.0; x += 1.4) {
    const stake = new THREE.Mesh(stakeGeo, stakeMat);
    stake.position.set(x, 0.55, zFront);
    stake.castShadow = true;
    fenceGroup.add(stake);
  }

  // 3 Niveles de driza tensada
  for (let h of [0.35, 0.68, 0.98]) {
    const lineGeoIzq = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10.0, h, zFront),
      new THREE.Vector3(-2.8, h, zFront)
    ]);
    fenceGroup.add(new THREE.Line(lineGeoIzq, drizaMat));

    const lineGeoDer = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2.8, h, zFront),
      new THREE.Vector3(10.0, h, zFront)
    ]);
    fenceGroup.add(new THREE.Line(lineGeoDer, drizaMat));
  }

  group.add(fenceGroup);
  return group;
}
