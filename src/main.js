import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { createTerrain } from './scene/terrain.js';
import { createLights } from './scene/lights.js';
import { createToldoYMastil } from './scene/toldo.js';
import { createPortadaYCercado } from './models/portada.js';
import { createBanderas } from './models/banderas.js';
import { createCarpa } from './models/carpa.js';
import { createServiciosFrontis } from './models/serviciosFrontis.js';
import { createInteriorCarpa } from './models/interiorCarpa.js';
import { createCotas } from './ui/cotas.js';
import { setupHUD } from './ui/hud.js';
import { createLucesNocturnas } from './scene/lucesNocturnas.js';

// ==========================================
// 1. INICIALIZACIÓN DE LA ESCENA Y RENDERER
// ==========================================
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0xc6e4ff, 40, 90);

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  250
);
camera.position.set(20, 18, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.02;
controls.minDistance = 1.5;
controls.maxDistance = 80;
controls.target.set(0, 0, 0);

// ==========================================
// 2. CONSTRUCCIÓN DE COMPONENTES DE LA ESCENA
// ==========================================
// A. Terreno Oficial Calculado: 20m x 18m = 360 m²
const { terrainGroup, zonesGroup, lotMesh } = createTerrain(scene);

// B. Iluminación y Modos de Tiempo
const lightsController = createLights(scene);

// C. Portada Pionera de Trípodes y Cerco Únicamente en el Frontis
const portadaGroup = createPortadaYCercado();
scene.add(portadaGroup);

// D. Servicios en el Frontis (Tópico, Seguridad, Logística, Comunicaciones)
const serviciosFrontis = createServiciosFrontis();
scene.add(serviciosFrontis);

// E. Toldo Continuo desde la Portada (13.95m de largo continuo)
const { toldoGroup, toldoSubGroup } = createToldoYMastil();
scene.add(toldoGroup);

// F. Cotas y Medidas Técnicas
const { cotasGroup } = createCotas(scene);

// G. Amoblado Interior de Carpa (Carpa #1 Varones en X = -8.75m, Z = 3.6m)
const { interiorGroup, interiorLight } = createInteriorCarpa();
scene.add(interiorGroup);

// H. Iluminación Nocturna (Guirnaldas de luces bajo la cubierta)
const { lucesNocturnasGroup, setLucesNocturnasMode } = createLucesNocturnas();
scene.add(lucesNocturnasGroup);

// I. Banderas Ceremoniales frente a la Portada (Mástil Principal + Laterales)
const { banderasGroup, updateBanderas } = createBanderas();
scene.add(banderasGroup);

// =========================================================
// 3. DISTRIBUCIÓN MATEMÁTICA EXACTA DE LAS 25 CARPAS
//    (10 Varones + 10 Mujeres + 5 Directiva)
// =========================================================
const carpasGroup = new THREE.Group();
carpasGroup.name = 'CarpasGroup';

// ---------------------------------------------------------
// A. FILA DEL FONDO: 8 CARPAS (4 Varones + 4 Mujeres)
// Z = -7.6m, mirando hacia el patio frontal (+Z)
// Pasadizo horizontal de 1.5m libre delante de ellas
// ---------------------------------------------------------
// 4 Carpas Fondo Varones (X = -8.75, -6.25, -3.75, -1.25)
const xFondoVarones = [-8.75, -6.25, -3.75, -1.25];
xFondoVarones.forEach((x, idx) => {
  const carpa = createCarpa({
    id: idx + 7,
    type: 'varones',
    position: [x, 0, -7.6],
    rotationY: 0
  });
  carpasGroup.add(carpa);
});

// 4 Carpas Fondo Mujeres (X = +1.25, +3.75, +6.25, +8.75)
const xFondoMujeres = [1.25, 3.75, 6.25, 8.75];
xFondoMujeres.forEach((x, idx) => {
  const carpa = createCarpa({
    id: idx + 7,
    type: 'mujeres',
    position: [x, 0, -7.6],
    rotationY: 0
  });
  carpasGroup.add(carpa);
});

// ---------------------------------------------------------
// B. ALA VARONES: 6 CARPAS EN COSTADO (Completando 10)
// Mirando hacia el centro (+X) con tendedero a su izquierda
// ---------------------------------------------------------
// 4 Carpas en Columna Exterior (X = -8.75)
const zCostadoRows = [3.6, 1.2, -1.2, -3.6];
zCostadoRows.forEach((z, idx) => {
  const carpa = createCarpa({
    id: idx + 1,
    type: 'varones',
    position: [-8.75, 0, z],
    rotationY: Math.PI / 2
  });
  carpasGroup.add(carpa);
});

// 2 Carpas en Columna Interior (X = -5.0, Z = -1.2 y -3.6 al frente del fondo)
const zInnerCostado = [-1.2, -3.6];
zInnerCostado.forEach((z, idx) => {
  const carpa = createCarpa({
    id: idx + 5,
    type: 'varones',
    position: [-5.0, 0, z],
    rotationY: Math.PI / 2
  });
  carpasGroup.add(carpa);
});

// ---------------------------------------------------------
// C. ALA MUJERES: 6 CARPAS EN COSTADO (Completando 10)
// Mirando hacia el centro (-X) con tendedero a su derecha
// ---------------------------------------------------------
// 4 Carpas en Columna Exterior (X = +8.75)
zCostadoRows.forEach((z, idx) => {
  const carpa = createCarpa({
    id: idx + 1,
    type: 'mujeres',
    position: [8.75, 0, z],
    rotationY: -Math.PI / 2
  });
  carpasGroup.add(carpa);
});

// 2 Carpas en Columna Interior (X = +5.0, Z = -1.2 y -3.6 al frente del fondo)
zInnerCostado.forEach((z, idx) => {
  const carpa = createCarpa({
    id: idx + 5,
    type: 'mujeres',
    position: [5.0, 0, z],
    rotationY: -Math.PI / 2
  });
  carpasGroup.add(carpa);
});

// ---------------------------------------------------------
// D. CARPAS DE DIRECTIVA (5 UNIDADES - SIN TENDEDERO REQUERIDO)
// ---------------------------------------------------------
// 1. Directiva 1: Frontis Exterior Izquierdo (X = -8.75, Z = 6.8 al costado del Tópico)
const dir1 = createCarpa({
  id: 1,
  type: 'directiva',
  position: [-8.75, 0, 6.8],
  rotationY: Math.PI / 2,
  includeTendedero: false
});
carpasGroup.add(dir1);

// 2. Directiva 2: Frontis Exterior Derecho (X = +8.75, Z = 6.8 al costado de Logística)
const dir2 = createCarpa({
  id: 2,
  type: 'directiva',
  position: [8.75, 0, 6.8],
  rotationY: -Math.PI / 2,
  includeTendedero: false
});
carpasGroup.add(dir2);

// 3. Directiva 3: Fila delantera interior izquierda (X = -5.0, Z = 3.6, frente al patio)
const dir3 = createCarpa({
  id: 3,
  type: 'directiva',
  position: [-5.0, 0, 3.6],
  rotationY: Math.PI / 2,
  includeTendedero: false
});
carpasGroup.add(dir3);

// 4. Directiva 4: Fila delantera interior derecha (X = +5.0, Z = 3.6, frente al patio)
const dir4 = createCarpa({
  id: 4,
  type: 'directiva',
  position: [5.0, 0, 3.6],
  rotationY: -Math.PI / 2,
  includeTendedero: false
});
carpasGroup.add(dir4);

// 5. Directiva 5: Jefatura de Campamento / Coordinación (X = -5.0, Z = 1.2)
const dir5 = createCarpa({
  id: 5,
  type: 'directiva',
  position: [-5.0, 0, 1.2],
  rotationY: Math.PI / 2,
  includeTendedero: false
});
carpasGroup.add(dir5);

scene.add(carpasGroup);

// ==========================================
// 4. CONFIGURACIÓN DEL HUD Y CONTROLADORES
// ==========================================
// Sincronizar el encendido de luces nocturnas con el selector de tiempo
const origSetTimeMode = lightsController.setTimeMode;
lightsController.setTimeMode = (mode) => {
  origSetTimeMode(mode);
  setLucesNocturnasMode(mode);
};

const hud = setupHUD({
  camera,
  controls,
  toldoSubGroup,
  cotasGroup,
  zonesGroup,
  banderasGroup,
  lightsController
});

// ==========================================
// 5. RAYCASTER E INSPECCIÓN AL CLIC
// ==========================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  if (
    event.target.closest('.glass-panel') ||
    event.target.closest('button') ||
    event.target.closest('label')
  ) {
    return;
  }

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    let current = intersects[0].object;
    let foundData = null;

    while (current && current !== scene) {
      if (current.userData && current.userData.title) {
        foundData = current.userData;
        break;
      }
      current = current.parent;
    }

    if (foundData) {
      hud.showInspector(foundData);
    }
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 6. BUCLE DE ANIMACIÓN
// ==========================================
function animate() {
  requestAnimationFrame(animate);

  const nowSec = performance.now() / 1000;
  updateBanderas(nowSec);

  hud.updateCameraAnimation(performance.now());
  controls.update();
  renderer.render(scene, camera);
}

animate();
