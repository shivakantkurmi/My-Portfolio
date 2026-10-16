/**
 * ============================================================================
 * SHIVAKANT KURMI — 3D SPATIAL DEVELOPER PORTFOLIO ENGINE (js/main.js)
 * High-End WebGL + Bloom + CSS3D Spatial Architecture
 * Features:
 *   - Universal Mouse Wheel, Touchpad & Keyboard Section-by-Section Scrolling
 *   - Perfectly Framed 3D Camera Waypoints (Zero Overlapping or Meshed Cards)
 *   - 12 Interactive Projects Showcase with 3D Rotating Relics & Quick-Jump Chips
 *   - 23 Skills Interactive 3D Wheel with Category Filtering
 *   - Optical Zoom Dock, Lighting Studio & Procedural Ambient Sound
 *   - 100% Robust Standard Geometries (Zero NaN Bounding Spheres)
 * ============================================================================
 */

(function(global) {
  'use strict';

  global.initPortfolioApp = function() {
    const DATA = global.PORTFOLIO_DATA;
    const THREE = global.THREE;
    const OrbitControls = global.OrbitControls;
    const EffectComposer = global.EffectComposer;
    const RenderPass = global.RenderPass;
    const UnrealBloomPass = global.UnrealBloomPass;
    const CSS3DRenderer = global.CSS3DRenderer;
    const CSS3DObject = global.CSS3DObject;
    const gsap = global.gsap;

    if (!THREE || !OrbitControls || !EffectComposer || !CSS3DRenderer) {
      console.error("[Portfolio 3D] Three.js or Addons failed to initialize.");
      return;
    }

    const webglContainer = document.getElementById('webgl-container');
    const css3dContainer = document.getElementById('css3d-container');

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02060d);
    scene.fog = new THREE.FogExp2(0x030914, 0.001);

    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 15, 54);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    webglContainer.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.68, 0.5, 0.32
    );
    composer.addPass(bloomPass);

    const css3dRenderer = new CSS3DRenderer();
    css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    css3dRenderer.domElement.style.pointerEvents = 'none';
    css3dContainer.appendChild(css3dRenderer.domElement);

    // OrbitControls: Full interactive navigation (pinch, wheel zoom, rotate & pan)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;   // Allows mouse wheel & touchpad pinch-to-zoom
    controls.zoomSpeed = 1.15;
    controls.minDistance = 6;
    controls.maxDistance = 260;
    controls.enableRotate = true; // Drag to orbit
    controls.rotateSpeed = 0.65;
    controls.enablePan = true;    // Pan allowed
    controls.panSpeed = 0.8;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controls.minPolarAngle = 0.15;
    controls.target.set(0, 16.5, 28);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const clickableWorldMeshes = [];
    const spatialSteleObjects = [];
    const steleRegistryById = {};

    // 2. PROCEDURAL HIGH-RES TEXTURES & MATERIALS
    function createHighResStoneTexture() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      const img = ctx.createImageData(512, 512);
      for (let y = 0; y < 512; y++) {
        for (let x = 0; x < 512; x++) {
          const idx = (y * 512 + x) * 4;
          const n = Math.sin(x * 0.05) * Math.cos(y * 0.05);
          const v = Math.floor(40 + (n * 0.5 + 0.5) * 80);
          img.data[idx] = v;
          img.data[idx + 1] = v + 8;
          img.data[idx + 2] = v + 18;
          img.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      return new THREE.CanvasTexture(c);
    }

    function createHexArrayTexture(primaryColor = '#edc967', secondaryColor = '#00f0ff') {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      const cx = 256, cy = 256;
      ctx.clearRect(0, 0, 512, 512);
      ctx.strokeStyle = primaryColor;
      ctx.fillStyle = primaryColor;

      [240, 220, 180, 150, 110, 80].forEach((r, i) => {
        ctx.beginPath();
        ctx.lineWidth = i % 2 === 0 ? 3 : 1.5;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = i % 2 === 0 ? primaryColor : secondaryColor;
        ctx.moveTo(cx + Math.cos(ang) * 90, cy + Math.sin(ang) * 90);
        ctx.lineTo(cx + Math.cos(ang) * 240, cy + Math.sin(ang) * 240);
        ctx.stroke();
      }
      return new THREE.CanvasTexture(c);
    }

    const stonePBRTex = createHighResStoneTexture();
    const hexGoldTex = createHexArrayTexture('#edc967', '#00f0ff');
    const hexCyanTex = createHexArrayTexture('#00f0ff', '#ff0055');

    const matHighRock = new THREE.MeshStandardMaterial({
      map: stonePBRTex, bumpMap: stonePBRTex, bumpScale: 1.2, roughness: 0.7, metalness: 0.22
    });
    const matImperialGold = new THREE.MeshStandardMaterial({
      color: 0xedc967, emissive: 0x7a570d, emissiveIntensity: 0.65, roughness: 0.2, metalness: 0.94
    });
    const matImmortalJade = new THREE.MeshStandardMaterial({
      color: 0x00f0ff, emissive: 0x044855, emissiveIntensity: 0.85, roughness: 0.16, metalness: 0.65
    });
    const matObsidianStele = new THREE.MeshStandardMaterial({
      map: stonePBRTex, bumpMap: stonePBRTex, bumpScale: 0.45, color: 0x0a1929, roughness: 0.28, metalness: 0.65
    });

    // 3. UNIVERSAL CAMERA ZOOM HELPER
    global.zoomTo3DNode = function(object3D, distance = 18, yOffset = 0) {
      const worldPos = new THREE.Vector3();
      const worldQuat = new THREE.Quaternion();
      object3D.getWorldPosition(worldPos);
      object3D.getWorldQuaternion(worldQuat);

      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(worldQuat).normalize();
      const camDest = worldPos.clone().addScaledVector(forward, distance);
      camDest.y += yOffset;

      gsap.to(camera.position, {
        x: camDest.x, y: camDest.y, z: camDest.z, duration: 1.4, ease: "power3.out"
      });
      gsap.to(controls.target, {
        x: worldPos.x, y: worldPos.y + yOffset * 0.65, z: worldPos.z, duration: 1.4, ease: "power3.out"
      });
      playNote(640);
    };

    // Dedicated optical zoom via left HUD dock
    global.stepZoom = function(deltaDist) {
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
      const newDist = Math.max(10, Math.min(180, dir.length() + deltaDist));
      dir.normalize().multiplyScalar(newDist);
      const newPos = controls.target.clone().add(dir);
      gsap.to(camera.position, {
        x: newPos.x, y: newPos.y, z: newPos.z, duration: 0.5, ease: "power2.out"
      });
      playNote(deltaDist < 0 ? 587 : 440);
    };

    // 4. CREATE 3D SPATIAL UI STELE (GLUED TO FLOATING PLATFORMS)
    function createSpatial3DStele({
      id = "", htmlContent, widthPx = 800, heightPx = 520,
      scale = 0.034, zoomDist = 28, hasHoloRing = true, accentMat = matImperialGold,
      platform = null, position = null, localYOffset = 0, localZOffset = 0, rotationY = 0
    }) {
      const containerGroup = new THREE.Group();
      containerGroup.rotation.y = rotationY;

      const worldW = (widthPx * scale);
      const worldH = (heightPx * scale);

      if (platform) {
        const targetGroup = platform.group || (typeof platform.add === 'function' ? platform : null);
        const platHeight = platform.height || (platform.userData && platform.userData.height) || 16;
        if (position) {
          containerGroup.position.copy(position);
        } else {
          // Rigidly glue to platform: bottom beam rests directly on the platform terrace!
          const steleY = (platHeight / 2) + (worldH / 2) + 0.8 + localYOffset;
          containerGroup.position.set(0, steleY, localZOffset);
        }
        if (targetGroup) {
          targetGroup.add(containerGroup);
        } else {
          worldGroup.add(containerGroup);
        }
      } else {
        if (position) containerGroup.position.copy(position);
        worldGroup.add(containerGroup);
      }

      const div = document.createElement('div');
      div.id = "stele_" + id;
      div.className = 'spatial-stele-dom-root';
      div.style.width = widthPx + 'px';
      div.style.height = heightPx + 'px';
      div.style.pointerEvents = 'auto';
      div.innerHTML = htmlContent;

      // Allow internal scrolling and clicking without triggering 3D camera orbit or zoom
      div.addEventListener('wheel', (e) => {
        e.stopPropagation();
      }, { passive: true });
      div.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
      });

      const cssObj = new CSS3DObject(div);
      cssObj.scale.setScalar(scale);
      containerGroup.add(cssObj);

      if (id) {
        steleRegistryById[id] = { group: containerGroup, zoomDist, cssObj, widthPx, heightPx };
      }

      // 1. Obsidian Backing Slab (Grounded physical backing behind HTML card)
      const slabMesh = new THREE.Mesh(
        new THREE.BoxGeometry(worldW + 1.2, worldH + 1.2, 0.8),
        matObsidianStele
      );
      slabMesh.position.set(0, 0, -0.55);
      slabMesh.userData = {
        clickable: true,
        title: "PORTFOLIO MONUMENT",
        subtitle: "CLICK TO FRAME THIS SECTION",
        onClick: () => global.zoomTo3DNode(containerGroup, zoomDist)
      };
      clickableWorldMeshes.push(slabMesh);
      containerGroup.add(slabMesh);

      // 2. Twin Architectural Stone Columns
      const pillarGeo = new THREE.CylinderGeometry(0.38, 0.48, worldH + 2.8, 24);
      const leftPillar = new THREE.Mesh(pillarGeo, matHighRock);
      leftPillar.position.set(-(worldW / 2 + 1.0), 0, -0.45);
      const rightPillar = leftPillar.clone();
      rightPillar.position.x = (worldW / 2 + 1.0);
      containerGroup.add(leftPillar, rightPillar);

      // 3. Top and Bottom Beams
      const beamGeo = new THREE.BoxGeometry(worldW + 2.8, 0.85, 1.2);
      const topBeam = new THREE.Mesh(beamGeo, accentMat);
      topBeam.position.set(0, worldH / 2 + 0.8, -0.45);
      const botBeam = topBeam.clone();
      botBeam.position.y = -(worldH / 2 + 0.8);
      containerGroup.add(topBeam, botBeam);

      // 4. Holographic Arcane Halo Ring
      let haloMesh = null;
      if (hasHoloRing) {
        const haloRadius = Math.max(worldW, worldH) * 0.65;
        haloMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(haloRadius * 2, haloRadius * 2),
          new THREE.MeshBasicMaterial({
            map: accentMat === matImperialGold ? hexGoldTex : hexCyanTex,
            transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
          })
        );
        haloMesh.position.set(0, 0, -1.1);
        containerGroup.add(haloMesh);
      }

      spatialSteleObjects.push({ containerGroup, cssObj, haloMesh });
      return containerGroup;
    }

    // 5. CELESTIAL LIGHTING & SKY ELEMENTS
    const ambientLight = new THREE.AmbientLight(0x2b5280, 2.4);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xd8ecff, 3.0);
    moonLight.position.set(-120, 220, -280);
    scene.add(moonLight);

    const sanctuaryGoldLight = new THREE.PointLight(0xffcb6b, 5.4, 250);
    sanctuaryGoldLight.position.set(0, 28, 35);
    scene.add(sanctuaryGoldLight);

    const jadeSpiritLight = new THREE.PointLight(0x00f0ff, 4.6, 250);
    jadeSpiritLight.position.set(-30, 25, 10);
    scene.add(jadeSpiritLight);

    const moonGeo = new THREE.SphereGeometry(85, 36, 36);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xd8ecff, emissive: 0x4a82b8, emissiveIntensity: 0.7, roughness: 0.4
    });
    const colossalMoon = new THREE.Mesh(moonGeo, moonMat);
    colossalMoon.position.set(-110, 165, -520);
    worldGroup.add(colossalMoon);

    const cyberGrid = new THREE.GridHelper(1600, 120, 0x00f0ff, 0x092338);
    cyberGrid.position.y = -22;
    worldGroup.add(cyberGrid);

    // 6. BUILD 3D FLOATING TECH PLATFORMS
    const floatingPlatforms = [];
    function createFloatingPlatform({ x, y, z, radius = 24, height = 12, realmKey = "", beaconTitle = "" }) {
      const platformGroup = new THREE.Group();
      platformGroup.position.set(x, y, z);

      const baseGeo = new THREE.CylinderGeometry(radius, radius * 0.85, height, 32);
      const baseMesh = new THREE.Mesh(baseGeo, matHighRock);
      platformGroup.add(baseMesh);

      const topRing = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.95, 0.35, 16, 48), matImmortalJade);
      topRing.rotation.x = Math.PI / 2;
      topRing.position.y = height / 2;
      platformGroup.add(topRing);

      const innerPlaque = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.88, radius * 0.88, 0.4, 32), matObsidianStele);
      innerPlaque.position.y = height / 2 + 0.1;
      platformGroup.add(innerPlaque);

      if (realmKey) {
        baseMesh.userData = {
          clickable: true,
          title: beaconTitle || realmKey.toUpperCase(),
          subtitle: "CLICK TO FLY TO THIS SECTION",
          onClick: () => global.flyToSection(realmKey)
        };
        clickableWorldMeshes.push(baseMesh);
      }

      platformGroup.height = height;
      platformGroup.radius = radius;
      platformGroup.group = platformGroup;
      worldGroup.add(platformGroup);
      floatingPlatforms.push({ group: platformGroup, baseY: y, phase: x * 0.05 + z * 0.05 });
      return platformGroup;
    }

    // Platforms strategically distributed across 3D space with zero overlap
    const pHome = createFloatingPlatform({ x: 0, y: 0, z: 28, radius: 24, height: 12, realmKey: 'home', beaconTitle: 'HOME SANCTUARY' });
    const pAbout = createFloatingPlatform({ x: -85, y: 14, z: -65, radius: 26, height: 14, realmKey: 'about', beaconTitle: 'ABOUT SHIVAKANT' });
    const pSkills = createFloatingPlatform({ x: 135, y: 22, z: -45, radius: 32, height: 16, realmKey: 'skills', beaconTitle: 'CORE SKILLS' });
    const pProjects = createFloatingPlatform({ x: -155, y: 30, z: -45, radius: 32, height: 16, realmKey: 'projects', beaconTitle: 'FEATURED PROJECTS' });
    const pExperience = createFloatingPlatform({ x: 85, y: 55, z: -165, radius: 28, height: 16, realmKey: 'experience', beaconTitle: 'TIMELINE & EXPERIENCE' });
    const pResume = createFloatingPlatform({ x: -75, y: 75, z: -235, radius: 28, height: 16, realmKey: 'resume', beaconTitle: 'CURRICULUM VITAE' });
    const pContact = createFloatingPlatform({ x: 0, y: 95, z: -365, radius: 32, height: 18, realmKey: 'contact', beaconTitle: 'CONTACT PORTAL' });

    // 7. BUILD 3D SPATIAL STELES FOR ALL SECTIONS (GLUED FIRMLY TO PLATFORMS)
    // A. SECTION 0: HOME
    createSpatial3DStele({
      id: "home_main",
      platform: pHome,
      widthPx: 800,
      heightPx: 520,
      localZOffset: 0,
      rotationY: 0,
      scale: 0.034,
      zoomDist: 28,
      htmlContent: `
        <div class="spatial-stele">
          <div class="stele-watermark">SK</div>
          <div class="stele-eyebrow">PORTFOLIO OF SHIVAKANT KURMI</div>
          <h1 class="stele-title" style="font-size:2.4rem;">SHIVAKANT KURMI</h1>
          <div class="stele-subtitle">${DATA.PERSONAL_INFO.role}</div>
          <p class="stele-body">${DATA.PERSONAL_INFO.bio}</p>

          <div style="display:flex; flex-wrap:wrap; gap:12px; margin:16px 0;">
            <div class="coding-badge-btn" style="border-color:#ffa116;">
              <span class="badge-tag" style="background:rgba(255,161,22,0.25); color:#ffa116;">LEETCODE</span>
              <span>Knight Badge (1000+ Solved)</span>
            </div>
            <div class="coding-badge-btn" style="border-color:#2f8d46;">
              <span class="badge-tag" style="background:rgba(47,141,70,0.25); color:#2f8d46;">GFG</span>
              <span>Institute Rank 4 / 3856</span>
            </div>
            <div class="coding-badge-btn" style="border-color:#edc967;">
              <span class="badge-tag" style="background:rgba(237,201,103,0.25); color:#edc967;">VIT BHOPAL</span>
              <span>CGPA: 9.83 / 10.0</span>
            </div>
          </div>

          <div class="stele-btn-row">
            <button class="primary-btn" onclick="window.flyToSection('projects')">🚀 EXPLORE PROJECTS (12)</button>
            <a class="secondary-btn" href="Shivakant_Kurmi_Resume.pdf" download="Shivakant_Kurmi_Resume.pdf" target="_blank">📄 RESUME PDF</a>
            <button class="secondary-btn" onclick="window.flyToSection('about')">↓ VIEW ABOUT</button>
          </div>
        </div>
      `
    });

    // B. SECTION 1: ABOUT
    createSpatial3DStele({
      id: "about_main",
      platform: pAbout,
      widthPx: 840,
      heightPx: 530,
      localZOffset: 0,
      rotationY: 0,
      scale: 0.034,
      zoomDist: 28,
      htmlContent: `
        <div class="spatial-stele">
          <div class="stele-watermark">ABOUT</div>
          <div class="stele-eyebrow">ENGINEERING PROFILE & BACKGROUND</div>
          <h2 class="stele-title" style="font-size:2.2rem;">ABOUT SHIVAKANT KURMI</h2>
          <div class="stele-subtitle">VIT Bhopal B.Tech CSE (Gaming Tech) • Damoh District Topper</div>
          <p class="stele-body">
            Passionate full-stack software engineer and 3D game developer. Selected for the prestigious <strong>STARS Scheme</strong> at VIT Bhopal for outstanding academic merit. Maintains an exceptional <strong>9.83 CGPA</strong> while actively architecting high-concurrency web platforms, ML vision systems, and immersive 3D games in Unity.
          </p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px; margin:16px 0;">
            <div style="padding:12px 14px; background:rgba(6,20,36,0.9); border:1px solid rgba(0,240,255,0.4); border-radius:4px;">
              <div style="color:var(--accent-gold); font-family:'Cinzel',serif; font-size:0.78rem;">★ DISTRICT DAMOH TOPPER</div>
              <div style="font-size:0.88rem; color:#fff; font-weight:600; margin-top:3px;">Rank #1 in District</div>
              <div style="font-size:0.75rem; color:#94a3b8;">Higher Secondary Examination</div>
            </div>
            <div style="padding:12px 14px; background:rgba(6,20,36,0.9); border:1px solid rgba(245,197,66,0.5); border-radius:4px;">
              <div style="color:var(--primary); font-family:'Cinzel',serif; font-size:0.78rem;">★ AWS CERTIFIED</div>
              <div style="font-size:0.88rem; color:#fff; font-weight:600; margin-top:3px;">Cloud Practitioner</div>
              <div style="font-size:0.75rem; color:#94a3b8;">Amazon Web Services</div>
            </div>
            <div style="padding:12px 14px; background:rgba(6,20,36,0.9); border:1px solid rgba(0,240,255,0.4); border-radius:4px;">
              <div style="color:var(--accent-gold); font-family:'Cinzel',serif; font-size:0.78rem;">★ 1000+ DSA PROBLEMS</div>
              <div style="font-size:0.88rem; color:#fff; font-weight:600; margin-top:3px;">LeetCode Knight</div>
              <div style="font-size:0.75rem; color:#94a3b8;">Top 5% Worldwide (Rank 22,987)</div>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:14px;">
            <a class="coding-badge-btn" href="${DATA.SOCIAL_LINKS.linkedin}" target="_blank" rel="noopener">
              💼 LinkedIn Profile ↗
            </a>
            <a class="coding-badge-btn" href="${DATA.SOCIAL_LINKS.github}" target="_blank" rel="noopener">
              🐙 GitHub Repos ↗
            </a>
            <a class="coding-badge-btn" href="https://leetcode.com/u/Shivakant_kurmi/" target="_blank" rel="noopener">
              ⚔ LeetCode Profile ↗
            </a>
            <a class="coding-badge-btn" href="https://www.geeksforgeeks.org/user/shivakant_kurmi_23bcg10140/" target="_blank" rel="noopener">
              🌿 GeeksforGeeks Profile ↗
            </a>
          </div>

          <div class="stele-btn-row" style="margin-top:20px;">
            <button class="primary-btn" onclick="window.flyToSection('skills')">NEXT: 23 SKILLS →</button>
          </div>
        </div>
      `
    });

    // C. SECTION 2: SKILLS (COMMAND AMPHITHEATER WITH NON-OBSCURING FLANKING WINGS)
    createSpatial3DStele({
      id: "skills_main",
      platform: pSkills,
      widthPx: 740,
      heightPx: 480,
      localZOffset: -4,
      rotationY: 0,
      scale: 0.032,
      zoomDist: 28,
      htmlContent: `
        <div class="spatial-stele" id="skills-central-stele">
          <div class="stele-watermark">SKILLS</div>
          <div class="stele-eyebrow">CORE TECHNICAL ARSENAL • 23 TECHNOLOGIES</div>
          <h2 class="stele-title" style="font-size:2.1rem;">SKILLS & EXPERTISE</h2>
          <div class="stele-subtitle" id="skill-active-cat">Command Amphitheater • Click or hover any wing slip</div>
          <p class="stele-body" style="font-size:0.92rem; min-height:48px;">
            Hover or click any 3D skill tablet on the left or right wings to inspect production proficiency, frameworks, and real-world project deployments.
          </p>

          <div class="filter-pill-row">
            <button class="filter-pill active" onclick="window.filterSkills('ALL', this)">ALL (23)</button>
            <button class="filter-pill" onclick="window.filterSkills('PROGRAMMING', this)">LANGUAGES</button>
            <button class="filter-pill" onclick="window.filterSkills('FULL STACK', this)">FULL STACK</button>
            <button class="filter-pill" onclick="window.filterSkills('GAME DEV', this)">GAME DEV</button>
            <button class="filter-pill" onclick="window.filterSkills('AI / ML', this)">AI / ML</button>
            <button class="filter-pill" onclick="window.filterSkills('CLOUD', this)">CLOUD</button>
          </div>

          <div id="skill-detail-card" style="margin-top:14px; padding:12px 16px; background:rgba(6,22,38,0.94); border:1px solid var(--primary); border-radius:4px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong id="skill-detail-name" style="font-family:'Cinzel',serif; font-size:1.15rem; color:#fff;">⚡ C++ (Programming)</strong>
              <span id="skill-detail-cat" style="font-size:0.72rem; color:var(--accent-gold); font-weight:700;">COMPETITIVE & SYSTEMS</span>
            </div>
            <p id="skill-detail-desc" style="font-size:0.86rem; color:#cbd5e1; margin-top:5px; line-height:1.5;">
              High-performance memory management, STL algorithms, and 1000+ competitive programming trials conquered.
            </p>
            <div id="skill-detail-app" style="margin-top:6px; font-size:0.82rem; color:var(--primary); font-family:'JetBrains Mono',monospace;">
              <strong>Production Application:</strong> Competitive Programming, Core Engines & DSA
            </div>
          </div>

          <div class="stele-btn-row" style="margin-top:16px;">
            <button class="primary-btn" onclick="window.flyToSection('projects')">NEXT: 12 PROJECTS →</button>
          </div>
        </div>
      `
    });

    // 3D Skill Flanking Wings: Left Wing (Languages/Full-Stack) & Right Wing (Game Dev/AI/Cloud)
    // The central corridor (|x| < 15) is 100% open so the main panel is NEVER obscured!
    const skillWheel3DGroup = new THREE.Group();
    pSkills.group.add(skillWheel3DGroup);

    const skillNodes = [];
    DATA.SKILLS_LIST.forEach((sk, idx) => {
      const isLeftWing = idx < 12; // 0-11 on Left Wing, 12-22 on Right Wing
      const wingIdx = isLeftWing ? idx : idx - 12;
      const col = Math.floor(wingIdx / 6); // 0 (inner column) or 1 (outer column)
      const row = wingIdx % 6; // 0 to 5

      const sideSign = isLeftWing ? -1 : 1;
      const rx = sideSign * (col === 0 ? 18.5 : 26.5);
      const rz = col === 0 ? 3.0 : 8.5;
      const ry = (pSkills.height / 2) + 14.0 - (row * 3.4);

      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(rx, ry, rz);
      nodeGroup.rotation.y = -sideSign * 0.38; // Inward amphitheater tilt facing camera
      skillWheel3DGroup.add(nodeGroup);

      const slipDiv = document.createElement('div');
      slipDiv.className = 'talisman-slip' + (idx === 0 ? ' active' : '');
      slipDiv.style.pointerEvents = 'auto';
      slipDiv.innerHTML = `
        <div class="talisman-rune">${sk.icon}</div>
        <div style="overflow:hidden;">
          <span class="talisman-name">${sk.name}</span>
          <span class="talisman-cat">${sk.cat}</span>
        </div>
      `;
      slipDiv.addEventListener('mouseenter', () => global.activateSkillNode(idx, false));
      slipDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        global.activateSkillNode(idx, true);
      });

      const cssSlip = new CSS3DObject(slipDiv);
      cssSlip.scale.setScalar(0.024);
      nodeGroup.add(cssSlip);

      const crystalNode = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.46, 0),
        idx % 2 === 0 ? matImmortalJade : matImperialGold
      );
      crystalNode.position.set(0, -0.85, -0.4);
      nodeGroup.add(crystalNode);

      skillNodes.push({ sk, nodeGroup, slipDiv, crystalNode, isLeftWing, col, row });
    });

    // Glowing dynamic energy connector beam linking central stele to active skill slip
    const beamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, (pSkills.height / 2) + 16, -4),
      skillNodes[0].nodeGroup.position.clone()
    ]);
    const skillEnergyBeam = new THREE.Line(
      beamGeo,
      new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85 })
    );
    skillWheel3DGroup.add(skillEnergyBeam);

    global.activateSkillNode = function(index, zoom = false) {
      const item = skillNodes[index];
      if (!item) return;
      skillNodes.forEach((n, i) => n.slipDiv.classList.toggle('active', i === index));

      const nameEl = document.getElementById('skill-detail-name');
      const catEl = document.getElementById('skill-detail-cat');
      const descEl = document.getElementById('skill-detail-desc');
      const appEl = document.getElementById('skill-detail-app');

      if (nameEl) nameEl.textContent = `${item.sk.icon} ${item.sk.name}`;
      if (catEl) catEl.textContent = item.sk.cat;
      if (descEl) descEl.textContent = item.sk.desc;
      if (appEl) appEl.innerHTML = `<strong>Production Application:</strong> ${item.sk.app}`;

      // Update energy connector beam
      skillEnergyBeam.geometry.setFromPoints([
        new THREE.Vector3(0, (pSkills.height / 2) + 16, -4),
        item.nodeGroup.position.clone()
      ]);

      if (zoom) {
        const worldPos = new THREE.Vector3();
        item.nodeGroup.getWorldPosition(worldPos);
        const forwardX = item.isLeftWing ? -Math.sin(0.38) * 11 : Math.sin(0.38) * 11;
        const forwardZ = Math.cos(0.38) * 11;
        controls.enabled = false;
        gsap.to(camera.position, {
          x: worldPos.x + forwardX,
          y: worldPos.y + 0.3,
          z: worldPos.z + forwardZ,
          duration: 1.0,
          ease: "power2.inOut"
        });
        gsap.to(controls.target, {
          x: worldPos.x, y: worldPos.y, z: worldPos.z, duration: 1.0, ease: "power2.inOut",
          onComplete: () => { controls.enabled = true; }
        });
      } else {
        playNote(520 + index * 12);
      }
    };

    global.filterSkills = function(cat, btn) {
      document.querySelectorAll('#skills-central-stele .filter-pill').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      skillNodes.forEach(n => {
        const match = (cat === 'ALL' || n.sk.cat.toUpperCase().includes(cat.toUpperCase()));
        gsap.to(n.nodeGroup.scale, { x: match ? 1 : 0.25, y: match ? 1 : 0.25, z: match ? 1 : 0.25, duration: 0.45 });
        n.slipDiv.style.opacity = match ? '1' : '0.2';
      });
      playNote(440);
    };

    // D. SECTION 3: PROJECTS (ONE CENTRAL MAIN PANEL WITH SURROUNDING SELECTOR WINGS)
    const projectSmallNodes = [];
    let activeProjectIdx = 0;

    // 1. Central Main Project Display Panel
    const mainProj = DATA.PROJECTS_LIST[0];
    const projectMainStele = createSpatial3DStele({
      id: "projects_main",
      platform: pProjects,
      widthPx: 800,
      heightPx: 510,
      localZOffset: -4,
      rotationY: 0,
      scale: 0.034,
      zoomDist: 28,
      accentMat: matImperialGold,
      hasHoloRing: true,
      htmlContent: `
        <div class="spatial-stele" id="projects-central-stele">
          <div class="stele-watermark" id="proj-main-watermark">${mainProj.num}</div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div class="stele-eyebrow" id="proj-main-eyebrow">
              PROJECT 01 / 12 • ${(mainProj.category || 'WEB / FULL-STACK').toUpperCase()}
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span id="proj-main-badge" class="badge-tag" style="background:rgba(0,240,255,0.2); color:var(--primary); font-size:0.72rem;">
                ${mainProj.liveStatus || 'IN DEVELOPMENT'}
              </span>
              <button class="primary-btn" style="padding:4px 10px; font-size:0.72rem;" onclick="window.stepProject(-1)" title="Previous Project">◀ PREV</button>
              <button class="primary-btn" style="padding:4px 10px; font-size:0.72rem;" onclick="window.stepProject(1)" title="Next Project">NEXT ▶</button>
            </div>
          </div>

          <h2 class="stele-title" id="proj-main-title" style="font-size:2.2rem; margin-top:6px;">
            ${mainProj.icon || '☁️'} ${mainProj.name}
          </h2>
          <div class="stele-subtitle" id="proj-main-subtitle" style="font-size:1.1rem; color:var(--primary); margin-top:4px;">
            ${mainProj.subtitle}
          </div>

          <p class="stele-body" id="proj-main-desc" style="min-height:76px; line-height:1.6; font-size:0.95rem; margin-top:12px;">
            ${mainProj.desc}
          </p>

          <div class="chip-wrap" id="proj-main-tech" style="margin-top:14px;">
            ${(mainProj.tech || []).map(tc => `<span class="tech-chip">${tc}</span>`).join('')}
          </div>

          <div class="stele-btn-row" style="margin-top:20px;">
            <a class="primary-btn" id="proj-main-gh" href="${mainProj.github}" target="_blank" rel="noopener">
              🐙 GITHUB REPO ↗
            </a>
            <a class="secondary-btn" id="proj-main-live" href="${mainProj.live || '#'}" target="_blank" rel="noopener" style="${mainProj.live ? 'display:inline-flex;' : 'display:none;'}">
              🌐 LIVE DEMO ↗
            </a>
            <button class="secondary-btn" onclick="window.flyToSection('experience')">
              NEXT: TIMELINE →
            </button>
          </div>
        </div>
      `
    });

    // Rotating 3D Relic Mesh mounted on top of the Central Main Stele
    const mainProjectRelicMesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.8, 0.44, 64, 16),
      matImperialGold
    );
    mainProjectRelicMesh.position.set(0, 9.8, -0.45);
    mainProjectRelicMesh.userData = {
      clickable: true,
      title: "PROJECT CORE RELIC",
      subtitle: "ROTATING 3D ARTIFACT OF ACTIVE PROJECT",
      onClick: () => global.stepProject(1)
    };
    clickableWorldMeshes.push(mainProjectRelicMesh);
    projectMainStele.add(mainProjectRelicMesh);

    // 2. Surrounding Small Project Panels in Flanking Wings (Left: 0-5, Right: 6-11)
    // Central corridor (|x| < 15) is 100% open so the main panel is NEVER obscured or overlapped!
    const projectWheel3DGroup = new THREE.Group();
    pProjects.group.add(projectWheel3DGroup);

    DATA.PROJECTS_LIST.forEach((proj, idx) => {
      const isLeftWing = idx < 6; // 0-5 on Left Wing, 6-11 on Right Wing
      const wingIdx = isLeftWing ? idx : idx - 6; // 0 to 5
      const col = Math.floor(wingIdx / 3); // 0 (inner col) or 1 (outer col)
      const row = wingIdx % 3; // 0, 1, 2

      const sideSign = isLeftWing ? -1 : 1;
      const rx = sideSign * (col === 0 ? 19.5 : 27.5);
      const rz = col === 0 ? 3.5 : 8.5;
      const ry = (pProjects.height / 2) + 12.0 - (row * 4.6);

      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(rx, ry, rz);
      nodeGroup.rotation.y = -sideSign * 0.38; // Inward amphitheater tilt facing camera
      projectWheel3DGroup.add(nodeGroup);

      const slipDiv = document.createElement('div');
      slipDiv.className = 'project-small-slip' + (idx === 0 ? ' active' : '');
      slipDiv.style.pointerEvents = 'auto';
      slipDiv.innerHTML = `
        <div class="project-slip-num">${proj.num}</div>
        <div class="project-slip-info">
          <span class="project-slip-name">${proj.icon || '🚀'} ${proj.name}</span>
          <span class="project-slip-cat">${proj.category}</span>
        </div>
      `;

      slipDiv.addEventListener('mouseenter', () => global.setActiveProject(idx, false));
      slipDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        global.setActiveProject(idx, true);
      });

      const cssSlip = new CSS3DObject(slipDiv);
      cssSlip.scale.setScalar(0.024);
      nodeGroup.add(cssSlip);

      const crystalNode = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.46, 0),
        idx % 2 === 0 ? matImperialGold : matImmortalJade
      );
      crystalNode.position.set(0, -0.85, -0.4);
      nodeGroup.add(crystalNode);

      projectSmallNodes.push({ proj, nodeGroup, slipDiv, crystalNode, isLeftWing, col, row });
    });

    // Glowing dynamic energy connector beam linking central main project panel to active small panel
    const projBeamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, (pProjects.height / 2) + 16, -4),
      projectSmallNodes[0].nodeGroup.position.clone()
    ]);
    const projectEnergyBeam = new THREE.Line(
      projBeamGeo,
      new THREE.LineBasicMaterial({ color: 0xffcb6b, transparent: true, opacity: 0.85 })
    );
    projectWheel3DGroup.add(projectEnergyBeam);

    global.setActiveProject = function(index, playSound = true) {
      if (index < 0) index = DATA.PROJECTS_LIST.length - 1;
      if (index >= DATA.PROJECTS_LIST.length) index = 0;
      activeProjectIdx = index;

      const item = projectSmallNodes[index];
      if (!item) return;

      // Update active highlight on all small project slips
      projectSmallNodes.forEach((n, i) => n.slipDiv.classList.toggle('active', i === index));

      // Project full info onto the Central Main Panel
      const proj = item.proj;
      const watermarkEl = document.getElementById('proj-main-watermark');
      const eyebrowEl = document.getElementById('proj-main-eyebrow');
      const badgeEl = document.getElementById('proj-main-badge');
      const titleEl = document.getElementById('proj-main-title');
      const subtitleEl = document.getElementById('proj-main-subtitle');
      const descEl = document.getElementById('proj-main-desc');
      const techEl = document.getElementById('proj-main-tech');
      const ghEl = document.getElementById('proj-main-gh');
      const liveEl = document.getElementById('proj-main-live');

      if (watermarkEl) watermarkEl.textContent = proj.num;
      if (eyebrowEl) eyebrowEl.textContent = `PROJECT ${proj.num} / 12 • ${(proj.category || 'SOFTWARE').toUpperCase()}`;
      if (badgeEl) {
        badgeEl.textContent = proj.liveStatus || (proj.live ? 'LIVE DEMO' : 'IN DEVELOPMENT');
        badgeEl.style.background = proj.live ? 'rgba(0, 240, 255, 0.25)' : 'rgba(245, 197, 66, 0.25)';
        badgeEl.style.color = proj.live ? 'var(--primary)' : 'var(--accent-gold)';
      }
      if (titleEl) titleEl.textContent = `${proj.icon || '🚀'} ${proj.name}`;
      if (subtitleEl) subtitleEl.textContent = proj.subtitle;
      if (descEl) descEl.textContent = proj.desc;
      if (techEl) {
        techEl.innerHTML = (proj.tech || []).map(tc => `<span class="tech-chip">${tc}</span>`).join('');
      }
      if (ghEl) ghEl.href = proj.github;
      if (liveEl) {
        if (proj.live) {
          liveEl.href = proj.live;
          liveEl.style.display = 'inline-flex';
        } else {
          liveEl.style.display = 'none';
        }
      }

      // Update laser energy connector beam
      projectEnergyBeam.geometry.setFromPoints([
        new THREE.Vector3(0, (pProjects.height / 2) + 16, -4),
        item.nodeGroup.position.clone()
      ]);

      // Subtle pulse on active crystal
      gsap.fromTo(item.crystalNode.scale, { x: 1.5, y: 1.5, z: 1.5 }, { x: 1.0, y: 1.0, z: 1.0, duration: 0.4 });

      // Update HUD status readout
      const statusEl = document.getElementById('hud-status-readout');
      if (statusEl) statusEl.textContent = `PROJECT ${proj.num}: ${proj.name.toUpperCase()} • ${proj.category}`;

      if (playSound) playNote(560 + index * 16);
    };

    global.stepProject = function(direction) {
      global.setActiveProject(activeProjectIdx + direction, true);
    };
    global.focusProjectPedestal = global.setActiveProject;
    global.focusArtifactPedestal = global.setActiveProject;

    // E. SECTION 4: TIMELINE (EXPERIENCE & EDUCATION)
    createSpatial3DStele({
      id: "timeline_main",
      platform: pExperience,
      widthPx: 840,
      heightPx: 530,
      localZOffset: 0,
      rotationY: 0,
      scale: 0.034,
      zoomDist: 28,
      htmlContent: `
        <div class="spatial-stele">
          <div class="stele-watermark">TIMELINE</div>
          <div class="stele-eyebrow">EXPERIENCE & EDUCATION MILESTONES</div>
          <h2 class="stele-title" style="font-size:2.2rem;">TIMELINE & CREDENTIALS</h2>

          <div style="display:grid; gap:14px; margin-top:16px;">
            <div style="border-left:3px solid var(--accent-gold); padding-left:16px;">
              <div style="color:var(--accent-gold); font-family:'Cinzel',serif; font-size:0.78rem; font-weight:700;">
                APRIL 2025 – MAY 2025 • INTERNSHIP
              </div>
              <div style="font-size:1.15rem; color:#fff; font-weight:700;">AI Intern — Edunet Foundation & AICTE</div>
              <div style="font-size:0.86rem; color:var(--primary);">Microsoft Initiative • 4-Week Intensive</div>
              <p style="font-size:0.88rem; color:#cbd5e1; margin-top:4px;">
                Engineered EduMentor AI, an adaptive intelligent tutoring platform using Python, Gemini 1.5 Flash API, and RAG vector retrieval pipelines.
              </p>
            </div>

            <div style="border-left:3px solid var(--primary); padding-left:16px;">
              <div style="color:var(--primary); font-family:'Cinzel',serif; font-size:0.78rem; font-weight:700;">
                2023 – 2027 • DEGREE PROGRAM
              </div>
              <div style="font-size:1.15rem; color:#fff; font-weight:700;">B.Tech in Computer Science & Engineering (Gaming Technology)</div>
              <div style="font-size:0.86rem; color:var(--accent-gold);">Vellore Institute of Technology (VIT Bhopal) • CGPA: 9.83 / 10.0</div>
              <p style="font-size:0.88rem; color:#cbd5e1; margin-top:4px;">
                Selected for the prestigious STARS Scheme (Support for The Advancement of Rural Students) in recognition of academic excellence.
              </p>
            </div>

            <div style="border-left:3px solid #10b981; padding-left:16px;">
              <div style="color:#10b981; font-family:'Cinzel',serif; font-size:0.78rem; font-weight:700;">
                HONOURS & DISTRICT RANK
              </div>
              <div style="font-size:1.15rem; color:#fff; font-weight:700;">District Topper — Damoh District, Madhya Pradesh</div>
              <div style="font-size:0.86rem; color:#fff;">Higher Secondary State Examinations • Rank #1 in District</div>
            </div>
          </div>

          <div class="stele-btn-row" style="margin-top:20px;">
            <button class="primary-btn" onclick="window.flyToSection('resume')">NEXT: RESUME CV →</button>
          </div>
        </div>
      `
    });

    // F. SECTION 5: RESUME & CREDENTIALS
    createSpatial3DStele({
      id: "resume_main",
      platform: pResume,
      widthPx: 840,
      heightPx: 510,
      localZOffset: 0,
      rotationY: 0,
      scale: 0.034,
      zoomDist: 28,
      htmlContent: `
        <div class="spatial-stele" style="border-color:var(--accent-gold); border-width:3px;">
          <div class="stele-watermark">CV</div>
          <div class="stele-eyebrow">VERIFIED CURRICULUM VITAE</div>
          <h2 class="stele-title" style="font-size:2.2rem;">SHIVAKANT KURMI — RESUME</h2>
          <div class="stele-subtitle">Official Professional Document & Credentials</div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px; font-size:0.92rem; color:#dcebf7;">
            <div>
              <h4 style="color:var(--accent-gold); font-family:'Cinzel',serif; margin-bottom:6px;">EDUCATION & HONOURS</h4>
              <p>• <strong>VIT Bhopal University</strong> — B.Tech CSE (Gaming Tech) | <strong>CGPA: 9.83/10</strong></p>
              <p>• <strong>District Damoh Topper</strong> — Rank #1 in Higher Secondary</p>
              <p>• <strong>STARS Scholar</strong> — Academic Merit Scholarship</p>
              <h4 style="color:var(--accent-gold); font-family:'Cinzel',serif; margin:12px 0 6px;">COMPETITIVE TRIALS</h4>
              <p>• <strong>LeetCode:</strong> Knight Badge (Peak: 1916, 1000+ Solved)</p>
              <p>• <strong>GeeksforGeeks:</strong> Institute Rank 4 / 3856 (1000+ Solved)</p>
              <p>• <strong>HackerRank:</strong> 5★ Gold in C++</p>
            </div>
            <div>
              <h4 style="color:var(--primary); font-family:'Cinzel',serif; margin-bottom:6px;">PRODUCTION ARSENAL</h4>
              <p>• <strong>Languages:</strong> C++, Python, Java, C#, JavaScript, SQL</p>
              <p>• <strong>Game Dev / AR:</strong> Unity 3D, C#, Vuforia AR</p>
              <p>• <strong>Full Stack:</strong> React, Node.js, Express, MongoDB, PostgreSQL, Socket.IO</p>
              <p>• <strong>AI / Cloud:</strong> Gemini API, FAISS, RAG, AWS Cloud Practitioner</p>
            </div>
          </div>

          <div class="stele-btn-row" style="margin-top:20px;">
            <a class="primary-btn" href="Shivakant_Kurmi_Resume.pdf" download="Shivakant_Kurmi_Resume.pdf" target="_blank">
              ⬇ DOWNLOAD OFFICIAL RESUME PDF
            </a>
            <button class="secondary-btn" onclick="window.flyToSection('contact')">NEXT: CONTACT →</button>
          </div>
        </div>
      `
    });

    // G. SECTION 6: CONTACT PORTAL
    createSpatial3DStele({
      id: "contact_main",
      platform: pContact,
      widthPx: 840,
      heightPx: 530,
      localZOffset: 0,
      rotationY: 0,
      scale: 0.034,
      zoomDist: 28,
      htmlContent: `
        <div class="spatial-stele">
          <div class="stele-watermark">CONTACT</div>
          <div class="stele-eyebrow">COMMUNICATION PORTAL</div>
          <h2 class="stele-title" style="font-size:2.2rem;">LET'S BUILD SOMETHING EXTRAORDINARY</h2>
          <div class="stele-subtitle">Open for Software Engineering & Game Development Opportunities</div>

          <div style="display:grid; grid-template-columns:1fr 1.15fr; gap:22px; margin-top:16px;">
            <div>
              <p style="font-size:0.92rem; color:#cbd5e1; line-height:1.6; margin-bottom:14px;">
                Looking for a full-stack engineer, competitive coder, or 3D game developer? Feel free to reach out directly via email or connect through professional networks:
              </p>
              <div style="display:grid; gap:10px;">
                <a class="secondary-btn" href="mailto:shivakantkurmi49@gmail.com" style="justify-content:center;">
                  ✉ shivakantkurmi49@gmail.com
                </a>
                <a class="secondary-btn" href="tel:+917067103207" style="justify-content:center;">
                  📞 +91 7067103207
                </a>
                <a class="secondary-btn" href="https://github.com/shivakantkurmi" target="_blank" rel="noopener" style="justify-content:center;">
                  🐙 github.com/shivakantkurmi ↗
                </a>
                <a class="secondary-btn" href="https://www.linkedin.com/in/shivakant-kurmi-15339428a" target="_blank" rel="noopener" style="justify-content:center;">
                  💼 linkedin.com/in/shivakant-kurmi ↗
                </a>
              </div>
            </div>

            <form onsubmit="window.submitContactMessage(event)">
              <input class="form-input" type="text" placeholder="Your Name / Organization" required />
              <input class="form-input" type="email" placeholder="Your Email Address" required />
              <textarea class="form-input" style="height:90px; resize:none;" placeholder="Your message or collaboration proposal..." required></textarea>
              <button type="submit" class="primary-btn" id="contact-send-btn" style="width:100%; justify-content:center;">
                SEND TRANSMISSION ✉
              </button>
            </form>
          </div>
        </div>
      `
    });

    // 8. CAMERA WAYPOINTS & NAVIGATION
    const WAYPOINTS = {
      home: {
        cam: new THREE.Vector3(0, 18, 58),
        target: new THREE.Vector3(0, 17, 28),
        readout: "HOME • SHIVAKANT KURMI PORTFOLIO • DRAG TO ORBIT 3D WORLD • SCROLL / PINCH TO ZOOM"
      },
      about: {
        cam: new THREE.Vector3(-85, 33, -35),
        target: new THREE.Vector3(-85, 32, -65),
        readout: "ABOUT SHIVAKANT • B.TECH CSE (GAMING TECH) • CGPA 9.83 • DAMOH DISTRICT TOPPER"
      },
      skills: {
        cam: new THREE.Vector3(135, 41, -15),
        target: new THREE.Vector3(135, 39, -47),
        readout: "TECHNICAL SKILLS (23) • FULL-STACK, SYSTEMS, GAME DEV & AI"
      },
      projects: {
        cam: new THREE.Vector3(-155, 49, -15),
        target: new THREE.Vector3(-155, 47, -47),
        readout: "FEATURED PROJECTS (12 REPOSITORIES) • USE NEXT/PREV OR CLICK ANY 3D RELIC"
      },
      experience: {
        cam: new THREE.Vector3(85, 74, -135),
        target: new THREE.Vector3(85, 73, -165),
        readout: "TIMELINE • AI INTERN (MICROSOFT & AICTE) • VIT BHOPAL STARS SCHOLAR"
      },
      resume: {
        cam: new THREE.Vector3(-75, 93, -205),
        target: new THREE.Vector3(-75, 92, -235),
        readout: "OFFICIAL RESUME • VERIFIED CREDENTIALS • DOWNLOAD PDF"
      },
      contact: {
        cam: new THREE.Vector3(0, 114, -335),
        target: new THREE.Vector3(0, 113, -365),
        readout: "CONTACT PORTAL • OPEN FOR SOFTWARE & GAME DEVELOPMENT OPPORTUNITIES"
      }
    };

    const SECTION_ALIAS = {
      hero: "home",
      origin: "about",
      cultivation: "skills",
      artifacts: "projects",
      ascension: "experience",
      dao_scroll: "resume",
      nexion: "projects"
    };

    const SECTIONS = ['home', 'about', 'skills', 'projects', 'experience', 'resume', 'contact'];
    let currentSectionIndex = 0;

    global.flyToSection = function(secKey) {
      const resolved = SECTION_ALIAS[secKey] || secKey;
      const wp = WAYPOINTS[resolved];
      if (!wp) return;

      const idx = SECTIONS.indexOf(resolved);
      if (idx !== -1) currentSectionIndex = idx;

      document.querySelectorAll('.nav-stone-btn').forEach(btn => {
        btn.classList.toggle('active', (btn.dataset.section === resolved || btn.dataset.section === secKey));
      });

      const statusEl = document.getElementById('hud-status-readout');
      if (statusEl) statusEl.textContent = wp.readout;

      sanctuaryGoldLight.position.set(wp.target.x, wp.target.y + 12, wp.target.z + 18);

      // Temporarily disable OrbitControls during smooth camera flight to avoid fighting GSAP
      controls.enabled = false;
      gsap.to(camera.position, {
        x: wp.cam.x, y: wp.cam.y, z: wp.cam.z, duration: 1.4, ease: "power3.inOut"
      });
      gsap.to(controls.target, {
        x: wp.target.x, y: wp.target.y, z: wp.target.z, duration: 1.4, ease: "power3.inOut",
        onComplete: () => {
          controls.enabled = true;
        }
      });

      playNote(432);
    };
    global.flyToRealm = global.flyToSection;

    // Attach click listeners to all HUD bottom dock buttons
    document.querySelectorAll('.nav-stone-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sec = btn.dataset.section;
        if (sec) global.flyToSection(sec);
      });
    });

    // 9. ACCESSIBILITY: KEYBOARD NAVIGATION (Left/Right / PageUp/PageDown)
    window.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentSectionIndex < SECTIONS.length - 1) {
          currentSectionIndex++;
          global.flyToSection(SECTIONS[currentSectionIndex]);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSectionIndex > 0) {
          currentSectionIndex--;
          global.flyToSection(SECTIONS[currentSectionIndex]);
        }
      }
    });

    // 10. CELESTIAL LIGHTING ARRAY STUDIO
    const LIGHTING_PRESETS = {
      moonlit: {
        sky: 0x02060d, fog: 0x030914, moonTint: 0xd8ecff,
        orbit: 45, exposure: 3.0, bloom: 0.68, lamps: 5.4
      },
      dawn: {
        sky: 0x140b06, fog: 0x241309, moonTint: 0xffd27d,
        orbit: 25, exposure: 3.5, bloom: 0.85, lamps: 6.4
      },
      crimson: {
        sky: 0x0d0205, fog: 0x1a0308, moonTint: 0xff2e4c,
        orbit: 70, exposure: 3.0, bloom: 0.95, lamps: 5.8
      },
      jade: {
        sky: 0x010f0d, fog: 0x031c18, moonTint: 0x6bffdf,
        orbit: 55, exposure: 3.2, bloom: 0.75, lamps: 5.6
      },
      reading: {
        sky: 0x040b16, fog: 0x06101f, moonTint: 0xffffff,
        orbit: 45, exposure: 3.8, bloom: 0.22, lamps: 6.8
      }
    };

    global.toggleLightingStudio = function() {
      const panel = document.getElementById('lighting-studio-panel');
      const btn = document.getElementById('btn-lighting-studio');
      if (!panel) return;
      panel.classList.toggle('open');
      if (btn) btn.classList.toggle('active', panel.classList.contains('open'));
      playNote(528);
    };

    global.updateLightingSliders = function() {
      const slOrbit = document.getElementById('sl-orbit');
      const slExposure = document.getElementById('sl-exposure');
      const slBloom = document.getElementById('sl-bloom');
      const slLamps = document.getElementById('sl-lamps');

      if (!slOrbit || !slExposure || !slBloom || !slLamps) return;

      const orbitDeg = parseFloat(slOrbit.value);
      const exposureVal = parseFloat(slExposure.value);
      const bloomVal = parseFloat(slBloom.value);
      const lampsVal = parseFloat(slLamps.value);

      const rad = (orbitDeg * Math.PI) / 180;
      const mx = -Math.cos(rad) * 260;
      const my = 95 + Math.sin(rad) * 140;
      colossalMoon.position.set(mx, Math.max(45, my), -520);
      moonLight.position.set(mx, Math.max(60, my), -280);

      moonLight.intensity = exposureVal;
      ambientLight.intensity = exposureVal * 0.8;
      bloomPass.strength = bloomVal;
      sanctuaryGoldLight.intensity = lampsVal;
    };

    global.applyLightingPreset = function(key, btnEl) {
      const p = LIGHTING_PRESETS[key];
      if (!p) return;
      document.querySelectorAll('.preset-chip').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');

      scene.background.setHex(p.sky);
      scene.fog.color.setHex(p.fog);
      colossalMoon.material.color.setHex(p.moonTint);

      const slOrbit = document.getElementById('sl-orbit');
      const slExposure = document.getElementById('sl-exposure');
      const slBloom = document.getElementById('sl-bloom');
      const slLamps = document.getElementById('sl-lamps');

      if (slOrbit) slOrbit.value = p.orbit;
      if (slExposure) slExposure.value = p.exposure;
      if (slBloom) slBloom.value = p.bloom;
      if (slLamps) slLamps.value = p.lamps;

      global.updateLightingSliders();
      playNote(660);
    };

    // 11. PROCEDURAL HARMONIC AUDIO SYNTHESIZER
    let audioCtx = null, soundOn = false, droneGain = null;

    global.toggleSound = function() {
      const btn = document.getElementById('sound-toggle-btn');
      if (!soundOn) {
        if (!audioCtx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AC();
          const osc1 = audioCtx.createOscillator();
          const osc2 = audioCtx.createOscillator();
          droneGain = audioCtx.createGain();
          osc1.type = 'sine'; osc1.frequency.value = 73.42;
          osc2.type = 'triangle'; osc2.frequency.value = 110.0;
          const filt = audioCtx.createBiquadFilter();
          filt.type = 'lowpass'; filt.frequency.value = 220;
          droneGain.gain.value = 0.05;
          osc1.connect(filt); osc2.connect(filt);
          filt.connect(droneGain); droneGain.connect(audioCtx.destination);
          osc1.start(); osc2.start();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        gsap.to(droneGain.gain, { value: 0.06, duration: 0.8 });
        soundOn = true;
        if (btn) btn.textContent = '🔊 SOUND ON';
        playNote(528);
      } else {
        if (droneGain) gsap.to(droneGain.gain, { value: 0.0001, duration: 0.5 });
        soundOn = false;
        if (btn) btn.textContent = '🔇 SOUND';
      }
    };

    function playNote(freq = 528) {
      if (!soundOn || !audioCtx) return;
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      g.gain.setValueAtTime(0.001, audioCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.045, audioCtx.currentTime + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.4);
      osc.connect(g); g.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 1.45);
    }

    global.submitContactMessage = function(e) {
      e.preventDefault();
      const btn = document.getElementById('contact-send-btn');
      if (btn) btn.textContent = '✦ MESSAGE TRANSMITTED ✦';
      playNote(880);
      setTimeout(() => {
        e.target.reset();
        if (btn) btn.textContent = 'SEND TRANSMISSION ✉';
      }, 3200);
    };

    // 12. RAYCASTING INTERACTION
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const tooltipEl = document.getElementById('world-hover-tooltip');
    let pointerDownPos = { x: 0, y: 0 };

    window.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableWorldMeshes, false);
      if (hits.length > 0 && hits[0].object.userData.clickable && tooltipEl) {
        const data = hits[0].object.userData;
        tooltipEl.innerHTML = `${data.title}<span>${data.subtitle}</span>`;
        tooltipEl.style.left = `${e.clientX}px`;
        tooltipEl.style.top = `${e.clientY}px`;
        tooltipEl.classList.add('visible');
        document.body.style.cursor = 'pointer';
      } else if (tooltipEl) {
        tooltipEl.classList.remove('visible');
        document.body.style.cursor = 'default';
      }
    });

    window.addEventListener('pointerup', (e) => {
      const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (moveDist > 6) return;
      if (e.target.closest('.spatial-stele, .talisman-slip, #diegetic-3d-hud')) return;

      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableWorldMeshes, false);
      if (hits.length > 0 && hits[0].object.userData.onClick) {
        hits[0].object.userData.onClick();
      }
    });

    // 13. PARTICLES & NEBULA
    const pCount = 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 520;
      pPos[i * 3 + 1] = -10 + Math.random() * 180;
      pPos[i * 3 + 2] = 380 - Math.random() * 880;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.85, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
    );
    scene.add(particles);

    // 14. MASTER RENDER LOOP
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      floatingPlatforms.forEach(p => {
        p.group.position.y = p.baseY + Math.sin(t * 0.65 + p.phase) * 0.5;
      });

      spatialSteleObjects.forEach((st, i) => {
        if (st.haloMesh) st.haloMesh.rotation.z = t * 0.2 * (i % 2 === 0 ? 1 : -1);
      });

      if (mainProjectRelicMesh) {
        mainProjectRelicMesh.rotation.y = t * 0.8;
        mainProjectRelicMesh.rotation.x = t * 0.45;
      }

      projectSmallNodes.forEach((n, i) => {
        if (n.crystalNode) {
          n.crystalNode.rotation.y = t * 1.2 + i;
          n.crystalNode.rotation.z = t * 0.6;
        }
      });

      skillNodes.forEach((n, i) => {
        if (n.crystalNode) {
          n.crystalNode.rotation.y = t * 1.2 + i;
          n.crystalNode.rotation.z = t * 0.6;
        }
      });

      const posArr = particles.geometry.attributes.position.array;
      for (let i = 1; i < posArr.length; i += 3) {
        posArr[i] += 0.07;
        if (posArr[i] > 170) posArr[i] = -10;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      controls.update();
      composer.render();
      css3dRenderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    const loader = document.getElementById('celestial-loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('vanish');
        animate();
      }, 600);
    } else {
      animate();
    }
  };
})(window);
