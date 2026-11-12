import * as THREE from 'three';

export function createLights(scene) {
  const lightsGroup = new THREE.Group();
  lightsGroup.name = 'LightsGroup';

  // 1. Luz Hemisférica (Luz de rebote ambiental cielo / suelo)
  const hemiLight = new THREE.HemisphereLight(0xb1e1ff, 0x3b5323, 0.75);
  hemiLight.position.set(0, 30, 0);
  lightsGroup.add(hemiLight);

  // 2. Luz Solar Direccional Principal (con sombras suaves)
  const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
  dirLight.position.set(18, 28, 16);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 80;
  
  // Límites ortográficos de la sombra para cubrir el terreno ampliado de 24x20m
  const d = 18;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.bias = -0.0005;
  dirLight.shadow.radius = 2.5; // Sombra difusa natural
  lightsGroup.add(dirLight);

  // 3. Luz de Relleno Secundaria (Ambiental suave)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
  lightsGroup.add(ambientLight);

  // 4. Bóveda de Estrellas para el Modo Noche
  const starsGeo = new THREE.BufferGeometry();
  const starsCount = 420;
  const starPositions = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount; i++) {
    const r = 75 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * (Math.PI * 0.44); // Bóveda superior
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.cos(phi) + 2;
    starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starsMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.1,
    transparent: true,
    opacity: 0.0
  });
  const starsMesh = new THREE.Points(starsGeo, starsMat);
  starsMesh.visible = false;
  lightsGroup.add(starsMesh);

  scene.add(lightsGroup);

  // Controlador de Modos de Tiempo
  function setTimeMode(mode) {
    if (mode === 'day') {
      scene.background = new THREE.Color(0x87ceeb);
      if (scene.fog) scene.fog.color = new THREE.Color(0xc6e4ff);
      dirLight.color.setHex(0xfff5e6);
      dirLight.intensity = 1.4;
      dirLight.position.set(18, 28, 16);
      hemiLight.color.setHex(0xb1e1ff);
      hemiLight.groundColor.setHex(0x3b5323);
      hemiLight.intensity = 0.75;
      ambientLight.intensity = 0.28;
      starsMesh.visible = false;
      starsMat.opacity = 0.0;
    } else if (mode === 'sunset') {
      scene.background = new THREE.Color(0x4a2238);
      if (scene.fog) scene.fog.color = new THREE.Color(0x5a2d3c);
      dirLight.color.setHex(0xff7722);
      dirLight.intensity = 1.6;
      dirLight.position.set(24, 9, 4);
      hemiLight.color.setHex(0xf59e0b);
      hemiLight.groundColor.setHex(0x451a03);
      hemiLight.intensity = 0.55;
      ambientLight.intensity = 0.2;
      starsMesh.visible = false;
      starsMat.opacity = 0.0;
    } else if (mode === 'night') {
      scene.background = new THREE.Color(0x0a0e1a);
      if (scene.fog) scene.fog.color = new THREE.Color(0x0a0e1a);
      dirLight.color.setHex(0x38bdf8);
      dirLight.intensity = 0.28;
      dirLight.position.set(-10, 20, -10);
      hemiLight.color.setHex(0x1e293b);
      hemiLight.groundColor.setHex(0x0f172a);
      hemiLight.intensity = 0.35;
      ambientLight.intensity = 0.12;
      starsMesh.visible = true;
      starsMat.opacity = 0.85;
    }
  }

  // Inicializar en modo Día
  setTimeMode('day');

  return { lightsGroup, setTimeMode };
}
