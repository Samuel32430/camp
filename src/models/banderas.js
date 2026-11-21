import * as THREE from 'three';
import { ORION_COLORS } from './portada.js';

/**
 * Banderas oficiales integradas a los trípodes de la portada:
 *   - Trípode Izquierdo (X = -2.60 m, Z = 8.95 m): Bandera Oficial Club Orión
 *   - Trípode Derecho   (X = +2.60 m, Z = 8.95 m): Bandera Nacional del Perú
 * 
 * Ambos mástiles van adosados y amarrados como parte de la estructura pionera de los trípodes,
 * elevándose hasta 4.30 m de altura con animación física de viento.
 */

const MASTIL_H = 4.30;
const MASTIL_R = 0.035;

const FLAG_W = 1.30;
const FLAG_H = 0.80;
const FLAG_SEGS_X = 14;
const FLAG_SEGS_Y = 7;

let flagMeshes = [];

function createMastilConBandera(parentGroup, x, z, flagType = 'orion') {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  // ── Mástil de madera pionera ──────────────────────────────────────────────
  const mastilMat = new THREE.MeshStandardMaterial({
    color: 0x6d3f1a,
    roughness: 0.85,
    metalness: 0.05
  });
  const mastil = new THREE.Mesh(
    new THREE.CylinderGeometry(MASTIL_R * 0.85, MASTIL_R * 1.1, MASTIL_H, 12),
    mastilMat
  );
  mastil.position.y = MASTIL_H / 2;
  mastil.castShadow = true;
  group.add(mastil);

  // Amarres de sujeción al trípode (a 1.2m y 2.6m de altura)
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 });
  for (const hy of [1.2, 2.65]) {
    const lash = new THREE.Mesh(new THREE.TorusGeometry(MASTIL_R + 0.03, 0.015, 6, 12), ropeMat);
    lash.position.y = hy;
    lash.rotation.x = Math.PI / 2;
    group.add(lash);
  }

  // Remate superior (pomo dorado)
  const remate = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 12, 12),
    new THREE.MeshStandardMaterial({
      color: ORION_COLORS.amarillo,
      roughness: 0.35,
      metalness: 0.5
    })
  );
  remate.position.y = MASTIL_H + 0.06;
  group.add(remate);

  // Driza del mástil (cuerda para izar)
  const ropeLineMat = new THREE.LineBasicMaterial({ color: 0xfef08a });
  const ropeGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(MASTIL_R + 0.012, MASTIL_H - 0.05, 0),
    new THREE.Vector3(MASTIL_R + 0.012, 1.1, 0)
  ]);
  group.add(new THREE.Line(ropeGeo, ropeLineMat));

  // ── Textura Canvas para la bandera ────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  function drawFlagDesign() {
    if (flagType === 'peru') {
      // ── Bandera Oficial del Perú (3 franjas verticales: Rojo - Blanco - Rojo)
      const stripeW = 512 / 3;
      ctx.fillStyle = '#d91023'; // Rojo bermellón
      ctx.fillRect(0, 0, stripeW, 320);

      ctx.fillStyle = '#ffffff'; // Blanco institucional
      ctx.fillRect(stripeW, 0, stripeW, 320);

      ctx.fillStyle = '#d91023'; // Rojo bermellón
      ctx.fillRect(stripeW * 2, 0, stripeW, 320);

      // Borde ceremonial dorado fino
      ctx.strokeStyle = '#f5c518';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 508, 316);

      // Sombra sutil de costura interior
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(stripeW, 0); ctx.lineTo(stripeW, 320);
      ctx.moveTo(stripeW * 2, 0); ctx.lineTo(stripeW * 2, 320);
      ctx.stroke();
    } else {
      // ── Bandera Oficial del Club Orión (Fondo totalmente blanco, logo oficial al centro)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 320);

      // Borde perimetral sutil
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 508, 316);

      // Placeholder central mientras carga el logo
      ctx.save();
      ctx.translate(256, 160);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const rOuter = 65, rInner = 28;
        const a = -Math.PI / 2 + (i * 2 * Math.PI / 5);
        const aI = a + Math.PI / 5;
        if (i === 0) ctx.moveTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
        else ctx.lineTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
        ctx.lineTo(Math.cos(aI) * rInner, Math.sin(aI) * rInner);
      }
      ctx.closePath();
      ctx.fillStyle = '#f5c518';
      ctx.fill();
      ctx.strokeStyle = '#1a3a8f';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
  }

  drawFlagDesign();

  const flagTex = new THREE.CanvasTexture(canvas);
  flagTex.minFilter = THREE.LinearFilter;

  // Carga del logo oficial: centrado sobre fondo blanco rectangular
  if (flagType === 'orion') {
    const imgLogo = new Image();
    imgLogo.crossOrigin = 'anonymous';
    imgLogo.src = '/logo-orion.png';
    const renderLogo = () => {
      // Limpiar con fondo blanco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 320);

      // Borde sutil
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 508, 316);

      // Logo al centro del rectángulo
      const size = 265;
      const lx = (512 - size) / 2;
      const ly = (320 - size) / 2;
      ctx.drawImage(imgLogo, lx, ly, size, size);
      flagTex.needsUpdate = true;
    };

    imgLogo.onload = renderLogo;
    if (imgLogo.complete) {
      renderLogo();
    }
  }

  const flagMat = new THREE.MeshStandardMaterial({
    map: flagTex,
    side: THREE.DoubleSide,
    roughness: 0.75,
    metalness: 0.05
  });

  const flagGeo = new THREE.PlaneGeometry(FLAG_W, FLAG_H, FLAG_SEGS_X, FLAG_SEGS_Y);
  const flagMesh = new THREE.Mesh(flagGeo, flagMat);

  // Orientar la bandera ondeando hacia afuera del pórtico para no obstruir el centro
  const dirX = x < 0 ? -1 : 1;
  flagMesh.position.set(dirX * (FLAG_W / 2 + MASTIL_R), MASTIL_H - FLAG_H / 2 - 0.10, 0);
  if (dirX < 0) {
    // Si apunta hacia -X, invertir rotación para que el diseño mire correctamente
    flagMesh.rotation.y = Math.PI;
  }
  flagMesh.castShadow = true;
  group.add(flagMesh);

  flagMeshes.push({ mesh: flagMesh, dirX });

  // Inspector userData
  group.userData = {
    title: flagType === 'peru' ? 'Mástil Derecho — Bandera Nacional de Perú' : 'Mástil Izquierdo — Bandera Club Orión',
    category: 'Ceremonial en Portada',
    desc: 'Mástil de 4.30 m adosado al trípode pionero con driza de izamiento y bandera ondeando con viento.',
    specs: [
      { label: 'Ubicación',        val: flagType === 'peru' ? 'Trípode Derecho (X: +2.60m)' : 'Trípode Izquierdo (X: -2.60m)' },
      { label: 'Altura mástil',    val: `${MASTIL_H.toFixed(2)} m` },
      { label: 'Diámetro mástil',  val: '5 a 6 cm (Madera tratada)' },
      { label: 'Medidas bandera',  val: `${FLAG_W.toFixed(2)} m × ${FLAG_H.toFixed(2)} m` },
      { label: 'Tipo ceremonial',  val: flagType === 'peru' ? 'Pabellón Nacional' : 'Emblema Institucional' }
    ]
  };

  parentGroup.add(group);
  return group;
}

/**
 * Crea las 2 banderas integradas a los trípodes de la portada:
 * Club Orión a la izquierda y Bandera de Perú a la derecha.
 */
export function createBanderas() {
  const banderasGroup = new THREE.Group();
  banderasGroup.name = 'BanderasGroup';
  flagMeshes = [];

  // Mástil Trípode Izquierdo: Bandera Club Orión (X = -2.60 m, Z = 8.95 m)
  createMastilConBandera(banderasGroup, -2.60, 8.95, 'orion');

  // Mástil Trípode Derecho: Bandera de Perú (X = +2.60 m, Z = 8.95 m)
  createMastilConBandera(banderasGroup,  2.60, 8.95, 'peru');

  return { banderasGroup, updateBanderas };
}

/**
 * Animación física de ondeo por viento optimizada:
 * - Actualiza posiciones Z con ondas senoidales
 * - Reduce el recálculo pesado de normales de CPU a cada 3 frames
 */
let flagAnimFrame = 0;
export function updateBanderas(timeSec) {
  flagAnimFrame++;
  const shouldComputeNormals = (flagAnimFrame % 3 === 0);

  for (let m = 0; m < flagMeshes.length; m++) {
    const { mesh } = flagMeshes[m];
    const pos = mesh.geometry.attributes.position;
    const cols = FLAG_SEGS_X + 1;
    const rows = FLAG_SEGS_Y + 1;

    const phaseOffset = m * 1.2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const normX = c / FLAG_SEGS_X; // 0 a 1

        // Fijar el borde adyacente al mástil
        if (c === 0) {
          pos.setZ(idx, 0);
          continue;
        }

        const wave1 = Math.sin(timeSec * 3.4 + normX * 4.5 + phaseOffset) * (0.08 * normX);
        const wave2 = Math.cos(timeSec * 2.2 + normX * 3.0 + r * 0.3) * (0.035 * normX);
        pos.setZ(idx, wave1 + wave2);
      }
    }
    pos.needsUpdate = true;
    if (shouldComputeNormals) {
      mesh.geometry.computeVertexNormals();
    }
  }
}

