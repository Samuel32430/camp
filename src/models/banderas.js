import * as THREE from 'three';
import { ORION_COLORS } from './portada.js';

/**
 * Banderas del Club Orión frente a la portada.
 * La formación del club se ubica en el patio central mirando hacia la portada (+Z).
 * Por lo tanto, las banderas se sitúan en el frente ceremonial de la portada
 * (entre el patio de formación y la portada, en Z ≈ 7.8m - 8.1m), para que toda la
 * formación las tenga de frente durante los devocionales y ceremonias de izamiento.
 *
 *   - Mástil Central:   X =  0.0, Z = 7.8  (Mástil Principal con Bandera Oficial Club Orión)
 *   - Mástil Izquierdo: X = -3.2, Z = 8.1  (Bandera Nacional / Bienvenida)
 *   - Mástil Derecho:   X = +3.2, Z = 8.1  (Bandera Conquistadores / Camporee)
 */

const MASTIL_H = 4.0;
const MASTIL_R = 0.030;

const FLAG_W = 1.30;
const FLAG_H = 0.80;
const FLAG_SEGS_X = 12;
const FLAG_SEGS_Y = 6;

const flagMeshes = [];

function createMastilConBandera(parentGroup, x, z, flagType = 'principal') {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  // ── Mástil de madera pionera ──────────────────────────────────────────────
  const mastilMat = new THREE.MeshStandardMaterial({
    color: 0x6d3f1a,
    roughness: 0.85,
    metalness: 0.05
  });
  const mastil = new THREE.Mesh(
    new THREE.CylinderGeometry(MASTIL_R * 0.8, MASTIL_R, MASTIL_H, 12),
    mastilMat
  );
  mastil.position.y = MASTIL_H / 2;
  mastil.castShadow = true;
  group.add(mastil);

  // Base de soporte pionera (3 estacas cruzadas en la base)
  const baseStakeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6);
  const baseStakeMat = new THREE.MeshStandardMaterial({ color: 0x503010, roughness: 0.9 });
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3;
    const baseStake = new THREE.Mesh(baseStakeGeo, baseStakeMat);
    baseStake.position.set(Math.cos(angle) * 0.25, 0.25, Math.sin(angle) * 0.25);
    baseStake.rotation.set(Math.sin(angle) * 0.4, 0, -Math.cos(angle) * 0.4);
    group.add(baseStake);
  }

  // Remate superior (pomo dorado)
  const remate = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshStandardMaterial({
      color: ORION_COLORS.amarillo,
      roughness: 0.35,
      metalness: 0.5
    })
  );
  remate.position.y = MASTIL_H + 0.06;
  group.add(remate);

  // Driza del mástil (cuerda para izar)
  const ropeMat = new THREE.LineBasicMaterial({ color: 0xfef08a });
  const ropeGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(MASTIL_R + 0.01, MASTIL_H - 0.05, 0),
    new THREE.Vector3(MASTIL_R + 0.01, 1.2, 0)
  ]);
  group.add(new THREE.Line(ropeGeo, ropeMat));

  // ── Bandera con Textura Canvas y Logo Oficial ─────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  function drawFlagDesign() {
    if (flagType === 'principal') {
      // Fondo dividido diagonalmente azul y verde con franja blanca y amarilla
      ctx.fillStyle = '#1a3a8f'; // Azul Orión
      ctx.fillRect(0, 0, 512, 320);

      // Franja verde inferior
      ctx.fillStyle = '#1a7a3f'; // Verde Orión
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.lineTo(512, 160);
      ctx.lineTo(512, 320);
      ctx.lineTo(0, 320);
      ctx.closePath();
      ctx.fill();

      // Franja amarilla intermedia
      ctx.fillStyle = '#f5c518';
      ctx.fillRect(0, 150, 512, 18);

      // Borde blanco institucional
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 10;
      ctx.strokeRect(6, 6, 500, 308);

      // Texto
      ctx.fillStyle = '#f5c518';
      ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CLUB DE CONQUISTADORES', 256, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 58px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ORIÓN', 256, 105);

      ctx.font = '600 24px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('★ SERVICIO · VALOR · FE ★', 256, 245);
    } else {
      // Bandera bicolor lateral (Verde y Azul con estrella dorada)
      ctx.fillStyle = '#1a7a3f';
      ctx.fillRect(0, 0, 256, 320);
      ctx.fillStyle = '#1a3a8f';
      ctx.fillRect(256, 0, 256, 320);

      // Estrella central
      ctx.save();
      ctx.translate(256, 160);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const rOuter = 85, rInner = 36;
        const a = -Math.PI / 2 + (i * 2 * Math.PI / 5);
        const aI = a + Math.PI / 5;
        if (i === 0) ctx.moveTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
        else ctx.lineTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
        ctx.lineTo(Math.cos(aI) * rInner, Math.sin(aI) * rInner);
      }
      ctx.closePath();
      ctx.fillStyle = '#f5c518';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.strokeRect(5, 5, 502, 310);
    }
  }

  drawFlagDesign();

  const flagTex = new THREE.CanvasTexture(canvas);
  flagTex.minFilter = THREE.LinearFilter;

  // Carga asíncrona del logo real subido por el usuario
  const imgLogo = new Image();
  imgLogo.crossOrigin = 'anonymous';
  imgLogo.src = '/logo-orion.png';
  imgLogo.onload = () => {
    if (flagType === 'principal') {
      drawFlagDesign();
      // Dibujar logo oficial en el centro de la bandera
      ctx.drawImage(imgLogo, 206, 158, 100, 100);
      flagTex.needsUpdate = true;
    }
  };

  const flagMat = new THREE.MeshStandardMaterial({
    map: flagTex,
    side: THREE.DoubleSide,
    roughness: 0.75,
    metalness: 0.05
  });

  const flagGeo = new THREE.PlaneGeometry(FLAG_W, FLAG_H, FLAG_SEGS_X, FLAG_SEGS_Y);
  const flagMesh = new THREE.Mesh(flagGeo, flagMat);

  // Orientar la bandera ondeando hacia un lado
  flagMesh.position.set(FLAG_W / 2 + MASTIL_R, MASTIL_H - FLAG_H / 2 - 0.08, 0);
  flagMesh.castShadow = true;
  group.add(flagMesh);

  flagMeshes.push(flagMesh);

  // Inspector userData
  group.userData = {
    title: flagType === 'principal' ? 'Mástil Principal — Bandera Club Orión' : 'Mástil Lateral de Formación',
    category: 'Ceremonial',
    desc: 'Ubicado al frente de la portada, de cara a la formación en el patio central.',
    specs: [
      { label: 'Ubicación',        val: `X: ${x >= 0 ? '+' : ''}${x.toFixed(1)}m · Z: +${z.toFixed(1)}m` },
      { label: 'Altura mástil',    val: `${MASTIL_H.toFixed(2)} m` },
      { label: 'Diámetro mástil',  val: 'Ø 6 cm (Madera tratada)' },
      { label: 'Medidas bandera',  val: `${FLAG_W.toFixed(2)} m × ${FLAG_H.toFixed(2)} m` },
      { label: 'Orientación',      val: 'Visible para formación en patio' }
    ]
  };

  parentGroup.add(group);
  return group;
}

/**
 * Crea el conjunto de mástiles con banderas frente a la portada.
 */
export function createBanderas() {
  const banderasGroup = new THREE.Group();
  banderasGroup.name = 'BanderasGroup';

  // Mástil central en eje principal frente a la portada
  createMastilConBandera(banderasGroup,  0.0, 7.8, 'principal');

  // Mástiles laterales flanqueando el ingreso hacia la formación
  createMastilConBandera(banderasGroup, -3.2, 8.1, 'lateral');
  createMastilConBandera(banderasGroup,  3.2, 8.1, 'lateral');

  return { banderasGroup, updateBanderas };
}

/**
 * Animación física de ondeo por viento
 */
export function updateBanderas(timeSec) {
  for (let m = 0; m < flagMeshes.length; m++) {
    const mesh = flagMeshes[m];
    const pos = mesh.geometry.attributes.position;
    const cols = FLAG_SEGS_X + 1;
    const rows = FLAG_SEGS_Y + 1;

    // Pequeño desfase de viento entre banderas
    const phaseOffset = m * 0.85;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const normX = c / FLAG_SEGS_X; // 0 en el mástil, 1 en extremo libre

        // Vértices sujetos al mástil (c=0) no se mueven
        if (c === 0) {
          pos.setZ(idx, 0);
          continue;
        }

        const wave1 = Math.sin(timeSec * 3.2 + normX * 4.2 + phaseOffset) * (0.07 * normX);
        const wave2 = Math.cos(timeSec * 2.1 + normX * 2.8 + r * 0.4) * (0.03 * normX);
        pos.setZ(idx, wave1 + wave2);
      }
    }
    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }
}
