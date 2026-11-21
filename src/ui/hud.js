import * as THREE from 'three';

/**
 * Gestiona la interfaz de usuario (HUD), animaciones suaves de cámara,
 * toggles de capas, inspector técnico de objetos y el colapso del panel lateral.
 */
export function setupHUD({
  camera,
  controls,
  toldoSubGroup,
  cotasGroup,
  zonesGroup,
  banderasGroup,
  lightsController
}) {
  const cameraAnim = {
    active: false,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    startTime: 0,
    duration: 1200
  };

  const presets = {
    iso: {
      pos: new THREE.Vector3(20, 18, 20),
      target: new THREE.Vector3(0, 0, 0)
    },
    top: {
      pos: new THREE.Vector3(0, 30, 0.001),
      target: new THREE.Vector3(0, 0, 0)
    },
    front: {
      pos: new THREE.Vector3(0, 3.2, 16.5),
      target: new THREE.Vector3(0, 1.8, 8.8)
    },
    formacion: {
      pos: new THREE.Vector3(0, 1.8, 1.5),
      target: new THREE.Vector3(0, 2.0, 8.2)
    },
    patio: {
      pos: new THREE.Vector3(0, 2.2, -6.5),
      target: new THREE.Vector3(0, 1.6, 3.0)
    },
    inside: {
      pos: new THREE.Vector3(-8.75, 0.65, 3.6),
      target: new THREE.Vector3(-5.5, 0.75, 3.6)
    }
  };

  function transitionTo(presetKey) {
    const p = presets[presetKey];
    if (!p) return;

    cameraAnim.startPos.copy(camera.position);
    cameraAnim.endPos.copy(p.pos);
    cameraAnim.startTarget.copy(controls.target);
    cameraAnim.endTarget.copy(p.target);
    cameraAnim.startTime = performance.now();
    cameraAnim.active = true;

    document.querySelectorAll('.btn-view').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`view-${presetKey}`);
    if (btn) btn.classList.add('active');

    const insideBar = document.getElementById('inside-mode-bar');
    if (presetKey === 'inside') {
      insideBar?.classList.remove('hidden');
    } else {
      insideBar?.classList.add('hidden');
    }

    // En pantallas pequeñas, colapsar el menú al seleccionar una vista para ver el modelo
    if (window.innerWidth <= 768) {
      toggleSidebar(false);
    }
  }

  function updateCameraAnimation(now) {
    if (!cameraAnim.active) return;

    const elapsed = now - cameraAnim.startTime;
    const progress = Math.min(1.0, elapsed / cameraAnim.duration);
    const t = progress * progress * (3 - 2 * progress);

    camera.position.lerpVectors(cameraAnim.startPos, cameraAnim.endPos, t);
    controls.target.lerpVectors(cameraAnim.startTarget, cameraAnim.endTarget, t);
    controls.update();

    if (progress >= 1.0) {
      cameraAnim.active = false;
    }
  }

  // Conectar botones de cámara
  document.getElementById('view-iso')?.addEventListener('click', () => transitionTo('iso'));
  document.getElementById('view-top')?.addEventListener('click', () => transitionTo('top'));
  document.getElementById('view-front')?.addEventListener('click', () => transitionTo('front'));
  document.getElementById('view-formacion')?.addEventListener('click', () => transitionTo('formacion'));
  document.getElementById('view-patio')?.addEventListener('click', () => transitionTo('patio'));
  document.getElementById('view-inside')?.addEventListener('click', () => transitionTo('inside'));
  document.getElementById('btn-exit-inside')?.addEventListener('click', () => transitionTo('iso'));

  // ==========================================
  // AUTO-ROTACIÓN (MODO PRESENTACIÓN)
  // ==========================================
  controls.autoRotate = false;
  controls.autoRotateSpeed = 5.0;

  const btnAutoRotate = document.getElementById('btn-autorotate');
  function toggleAutoRotate(forceState) {
    const newState = forceState !== undefined ? forceState : !controls.autoRotate;
    controls.autoRotate = newState;
    if (newState) {
      btnAutoRotate?.classList.add('active');
    } else {
      btnAutoRotate?.classList.remove('active');
    }
  }

  btnAutoRotate?.addEventListener('click', () => toggleAutoRotate());

  // Pausar auto-rotación si el usuario manipula la cámara manualmente
  controls.addEventListener('start', () => {
    if (controls.autoRotate) {
      toggleAutoRotate(false);
    }
  });

  // Atajo de teclado: Barra espaciadora para alternar auto-rotación
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      toggleAutoRotate();
    }
  });

  // ==========================================
  // PANTALLA COMPLETA (FULLSCREEN)
  // ==========================================
  const btnFullscreen = document.getElementById('btn-fullscreen');
  function updateFullscreenBtn() {
    const isFs = !!document.fullscreenElement;
    if (btnFullscreen) {
      btnFullscreen.innerHTML = isFs
        ? '<span class="fs-icon">✕</span><span class="fs-text"> Salir</span>'
        : '<span class="fs-icon">⛶</span><span class="fs-text"> Pantalla Completa</span>';
      if (isFs) {
        btnFullscreen.classList.add('active');
      } else {
        btnFullscreen.classList.remove('active');
      }
    }
  }

  btnFullscreen?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  document.addEventListener('fullscreenchange', updateFullscreenBtn);

  // ==========================================
  // COLAPSO / OCULTAMIENTO DEL PANEL LATERAL
  // ==========================================
  const sidebar = document.getElementById('hud-sidebar');
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const btnOpenSidebar = document.getElementById('btn-open-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  function toggleSidebar(show) {
    if (show) {
      sidebar?.classList.remove('collapsed');
      btnOpenSidebar?.classList.add('hidden');
      if (window.innerWidth <= 768) {
        sidebarBackdrop?.classList.remove('hidden');
      }
    } else {
      sidebar?.classList.add('collapsed');
      btnOpenSidebar?.classList.remove('hidden');
      sidebarBackdrop?.classList.add('hidden');
    }
  }

  btnToggleSidebar?.addEventListener('click', () => toggleSidebar(false));
  btnOpenSidebar?.addEventListener('click', () => toggleSidebar(true));
  sidebarBackdrop?.addEventListener('click', () => toggleSidebar(false));

  // En celulares, iniciar con el menú oculto para no tapar la vista 3D
  if (window.innerWidth <= 768) {
    toggleSidebar(false);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
      const isCollapsed = sidebar?.classList.contains('collapsed');
      toggleSidebar(isCollapsed);
    }
  });

  // Conectar Toggles de Capas
  const toggleToldo = document.getElementById('toggle-toldo');
  if (toggleToldo && toldoSubGroup) {
    toggleToldo.addEventListener('change', (e) => {
      toldoSubGroup.visible = e.target.checked;
    });
  }

  const toggleCotas = document.getElementById('toggle-cotas');
  if (toggleCotas && cotasGroup) {
    toggleCotas.addEventListener('change', (e) => {
      cotasGroup.visible = e.target.checked;
    });
  }

  const toggleZonas = document.getElementById('toggle-zonas');
  if (toggleZonas && zonesGroup) {
    toggleZonas.addEventListener('change', (e) => {
      zonesGroup.visible = e.target.checked;
    });
  }

  const toggleRotulos = document.getElementById('toggle-rotulos');
  if (toggleRotulos && cotasGroup) {
    toggleRotulos.addEventListener('change', (e) => {
      cotasGroup.traverse(child => {
        if (child.isSprite) child.visible = e.target.checked;
      });
    });
  }

  const toggleBanderas = document.getElementById('toggle-banderas');
  if (toggleBanderas && banderasGroup) {
    toggleBanderas.addEventListener('change', (e) => {
      banderasGroup.visible = e.target.checked;
    });
  }

  // Conectar Selector de Tiempo
  const timeBtns = {
    day: document.getElementById('btn-time-day'),
    sunset: document.getElementById('btn-time-sunset'),
    night: document.getElementById('btn-time-night')
  };

  Object.entries(timeBtns).forEach(([mode, btn]) => {
    btn?.addEventListener('click', () => {
      Object.values(timeBtns).forEach(b => b?.classList.remove('active'));
      btn.classList.add('active');
      lightsController.setTimeMode(mode);
    });
  });

  // Conectar Modal / Inspector Card
  const card = document.getElementById('inspector-card');
  const cardClose = document.getElementById('card-close');
  const cardTitle = document.getElementById('card-title');
  const cardCat = document.getElementById('card-category');
  const cardSpecs = document.getElementById('card-specs');

  cardClose?.addEventListener('click', () => {
    card.classList.add('hidden');
  });

  function showInspector(data) {
    if (!data || !card) return;

    cardTitle.textContent = data.title || 'Elemento';
    cardCat.textContent = data.category || 'Zona';

    cardSpecs.innerHTML = '';
    if (data.specs && Array.isArray(data.specs)) {
      data.specs.forEach(s => {
        const box = document.createElement('div');
        box.className = 'spec-box';
        box.innerHTML = `
          <span class="spec-label">${s.label}</span>
          <span class="spec-value">${s.val}</span>
        `;
        cardSpecs.appendChild(box);
      });
    }

    card.classList.remove('hidden');
  }

  // ==========================================
  // MODAL UNIFICADO (PLANIFICACIÓN, MATERIALES, DISTRIBUCIÓN)
  // ==========================================
  const modalBackdrop = document.getElementById('info-modal-backdrop');
  const btnCloseModal = document.getElementById('btn-close-modal');

  function openModalTab(tabId) {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('hidden');

    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.modal-tab-content').forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  function closeModal() {
    modalBackdrop?.classList.add('hidden');
  }

  document.getElementById('btn-open-planificacion')?.addEventListener('click', () => {
    openModalTab('tab-planificacion');
  });

  document.getElementById('btn-open-materiales')?.addEventListener('click', () => {
    openModalTab('tab-materiales');
  });

  document.getElementById('btn-open-distribucion')?.addEventListener('click', () => {
    openModalTab('tab-distribucion');
  });

  btnCloseModal?.addEventListener('click', closeModal);

  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  document.querySelectorAll('.modal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      if (targetTab) openModalTab(targetTab);
    });
  });

  return { updateCameraAnimation, transitionTo, showInspector, openModalTab, closeModal };
}
