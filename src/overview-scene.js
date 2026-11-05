import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let entrancePlayed = false;

export function mountOverviewScene(container) {
  const card = container.closest(".market-note");
  if (!card) return () => {};

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2, 2, 1.4, -1.4, 0.1, 40);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const specimens = [];
  let renderer = null;
  let frameId = 0;
  let visible = false;
  let hidden = document.hidden;
  let disposed = false;
  let failed = false;
  let assetsStarted = false;
  let assetsReady = false;
  let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let elapsed = 0;
  let lastTime = 0;
  let entranceStart = 0;

  const colorFrom = (selector, property = "color") => {
    const element = document.querySelector(selector);
    return new THREE.Color(element ? getComputedStyle(element)[property] : "#345943");
  };
  const colors = {
    light: () => colorFrom(".market-note", "color"),
    green: () => colorFrom(".market-note", "backgroundColor"),
    gold: () => colorFrom(".note-crop-label strong"),
  };
  const addGeometry = (geometry) => { geometries.add(geometry); return geometry; };
  const trackMaterial = (material) => { materials.add(material); return material; };
  const disposeModel = (root) => {
    root.traverse((node) => {
      if (!node.isMesh) return;
      node.geometry?.dispose();
      const list = Array.isArray(node.material) ? node.material : [node.material];
      list.forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value?.isTexture) { textures.add(value); value.dispose(); }
        });
        material.dispose();
      });
    });
  };

  const ambient = new THREE.HemisphereLight(colors.light(), colors.green(), 2.2);
  const keyLight = new THREE.DirectionalLight(colors.gold(), 3.0);
  keyLight.position.set(-3, 5, 7);
  const fillLight = new THREE.DirectionalLight(colors.light(), 1.8);
  fillLight.position.set(4, 2, 5);
  scene.add(ambient, keyLight, fillLight);

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 128;
  shadowCanvas.height = 64;
  const shadowContext = shadowCanvas.getContext("2d");
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  shadowTexture.colorSpace = THREE.SRGBColorSpace;
  textures.add(shadowTexture);
  const shadowMaterial = trackMaterial(new THREE.MeshBasicMaterial({
    map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.44,
  }));
  const paintShadow = () => {
    const tint = colors.green();
    const r = Math.round(tint.r * 255);
    const g = Math.round(tint.g * 255);
    const b = Math.round(tint.b * 255);
    const gradient = shadowContext.createRadialGradient(64, 32, 2, 64, 32, 32);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, .36)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    shadowContext.clearRect(0, 0, 128, 64);
    shadowContext.fillStyle = gradient;
    shadowContext.fillRect(0, 0, 128, 64);
    shadowTexture.needsUpdate = true;
  };
  const groundShadow = new THREE.Mesh(addGeometry(new THREE.PlaneGeometry(3.45, 0.7)), shadowMaterial);
  groundShadow.position.set(-0.04, -0.91, -0.35);
  scene.add(groundShadow);

  // A softly segmented soybean pod complements the textured onion and tomato assets.
  const makeSoybean = () => {
    const group = new THREE.Group();
    const vertices = [];
    const indices = [];
    const rings = 40;
    const sides = 20;
    for (let i = 0; i <= rings; i += 1) {
      const u = i / rings;
      const x = (u - 0.5) * 1.55;
      const endTaper = Math.pow(Math.sin(Math.PI * u), 0.55);
      const lobes = 0.84 + 0.16 * Math.cos(u * Math.PI * 6);
      const radius = 0.19 * endTaper * lobes;
      for (let j = 0; j <= sides; j += 1) {
        const angle = (j / sides) * Math.PI * 2;
        vertices.push(x, 0.035 * Math.sin(u * Math.PI * 2) + Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
    }
    for (let i = 0; i < rings; i += 1) {
      for (let j = 0; j < sides; j += 1) {
        const a = i * (sides + 1) + j;
        const b = a + sides + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    const podGeometry = addGeometry(new THREE.BufferGeometry());
    podGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    podGeometry.setIndex(indices);
    podGeometry.computeVertexNormals();
    const podMaterial = trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#91a76a"), roughness: 0.78, metalness: 0,
      transparent: true, opacity: 0,
    }));
    const pod = new THREE.Mesh(podGeometry, podMaterial);
    group.add(pod);
    const seamPoints = [];
    for (let i = 0; i <= 16; i += 1) {
      const u = i / 16;
      seamPoints.push(new THREE.Vector3((u - 0.5) * 1.4, 0.035 * Math.sin(u * Math.PI * 2), 0.12 * Math.pow(Math.sin(Math.PI * u), 0.55)));
    }
    const seam = new THREE.Mesh(
      addGeometry(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(seamPoints), 24, 0.009, 5, false)),
      trackMaterial(new THREE.MeshStandardMaterial({ color: new THREE.Color("#b4c28e"), roughness: 0.9, transparent: true, opacity: 0 })),
    );
    group.add(seam);
    return group;
  };

  const makeRoundTomato = (sourceRoot) => {
    let sourceMaterial;
    sourceRoot.traverse((node) => {
      if (sourceMaterial || !node.isMesh) return;
      sourceMaterial = Array.isArray(node.material) ? node.material[0] : node.material;
    });
    const bodyMaterial = trackMaterial(sourceMaterial?.clone?.() || new THREE.MeshStandardMaterial({ color: 0x9f5547, roughness: 0.72 }));
    bodyMaterial.transparent = true;
    bodyMaterial.opacity = 0;
    bodyMaterial.roughness = 0.72;

    const tomato = new THREE.Group();
    const body = new THREE.Mesh(addGeometry(new THREE.SphereGeometry(0.515, 48, 32)), bodyMaterial);
    body.scale.set(1.03, 0.88, 1.03);
    tomato.add(body);

    const calyxShape = new THREE.Shape();
    for (let point = 0; point < 10; point += 1) {
      const angle = (point / 10) * Math.PI * 2 - Math.PI / 2;
      const radius = point % 2 === 0 ? 0.16 : 0.075;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (point === 0) calyxShape.moveTo(x, y); else calyxShape.lineTo(x, y);
    }
    calyxShape.closePath();
    const calyxMaterial = trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.green()).lerp(new THREE.Color("#91a76a"), 0.6),
      side: THREE.DoubleSide,
      roughness: 0.84,
      transparent: true,
      opacity: 0,
    }));
    const calyx = new THREE.Mesh(addGeometry(new THREE.ShapeGeometry(calyxShape)), calyxMaterial);
    calyx.rotation.x = -0.38;
    calyx.position.set(0, 0.43, 0.14);
    tomato.add(calyx);
    const stem = new THREE.Mesh(
      addGeometry(new THREE.CylinderGeometry(0.018, 0.027, 0.075, 8)),
      calyxMaterial,
    );
    stem.position.set(0, 0.47, 0.04);
    tomato.add(stem);
    return tomato;
  };

  const soybean = makeSoybean();
  soybean.position.set(-0.02, -0.48, 0.24);
  soybean.rotation.z = -0.2;
  soybean.scale.setScalar(0.88);
  soybean.userData.targetScale = 0.88;
  scene.add(soybean);
  specimens.push({ group: soybean, x: soybean.position.x, y: soybean.position.y, z: soybean.position.z, speed: 0.62, phase: 2.7, rotation: -0.2, turn: 0.15, index: 2 });

  const positions = [
    { x: -0.92, y: -0.42, z: 0.28, height: 1.18, speed: 0.48, phase: 0.4, rotation: -0.08, turn: 0.12, index: 0 },
    { x: 0.78, y: -0.31, z: 0.1, height: 1.03, speed: 0.56, phase: 1.9, rotation: 0.11, turn: -0.16, index: 1 },
  ];

  const loader = new GLTFLoader();
  const loadProduce = async () => {
    try {
      const [onionAsset, tomatoAsset] = await Promise.all([
        loader.loadAsync("/models/red-onion.glb"),
        loader.loadAsync("/models/beef-tomato.glb"),
      ]);
      if (disposed) {
        disposeModel(onionAsset.scene);
        disposeModel(tomatoAsset.scene);
        return;
      }
      [onionAsset.scene, tomatoAsset.scene].forEach((asset, index) => {
        const spec = positions[index];
        let produce = asset;
        if (index === 1) {
          produce = makeRoundTomato(asset);
        } else {
          const bounds = new THREE.Box3().setFromObject(asset);
          const size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          const scale = spec.height / Math.max(size.y, size.x, size.z);
          asset.scale.setScalar(scale);
          asset.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
        }
        asset.traverse((node) => {
          if (!node.isMesh) return;
          node.castShadow = false;
          node.receiveShadow = false;
          const modelMaterials = Array.isArray(node.material) ? node.material : [node.material];
          modelMaterials.forEach((material) => {
            material.transparent = true;
            material.opacity = 0;
            trackMaterial(material);
            Object.values(material).forEach((value) => { if (value?.isTexture) textures.add(value); });
          });
          if (node.geometry) geometries.add(node.geometry);
        });
        const group = new THREE.Group();
        group.add(produce);
        group.position.set(spec.x, spec.y, spec.z);
        group.rotation.z = spec.rotation;
        scene.add(group);
        specimens.push({ ...spec, group });
      });
      entranceStart = elapsed;
      assetsReady = true;
      if (reduced) drawStaticFrame(); else start();
    } catch {
      // Keep the existing CSS illustration visible if an asset fails to load.
    }
  };

  const syncTheme = () => {
    ambient.color.copy(colors.light());
    ambient.groundColor.copy(colors.green());
    keyLight.color.copy(colors.gold());
    fillLight.color.copy(colors.light());
    paintShadow();
    if (renderer && reduced) renderer.render(scene, camera);
  };
  const drawStaticFrame = () => {
    materials.forEach((material) => { material.opacity = material === shadowMaterial ? 0.44 : 1; });
    specimens.forEach(({ group }) => group.scale.setScalar(group.userData.targetScale || 1));
    entrancePlayed = true;
    if (renderer) renderer.render(scene, camera);
  };
  const canAnimate = () => renderer && visible && !hidden && !reduced && !disposed;
  const stop = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = 0;
  };
  const animate = (now) => {
    frameId = 0;
    if (!canAnimate()) return;
    elapsed += Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    const allEntered = assetsReady && elapsed - entranceStart > 1.2;
    specimens.forEach(({ group, x, y, z, speed, phase, rotation, turn, index }) => {
      const progress = entrancePlayed ? 1 : THREE.MathUtils.clamp((elapsed - entranceStart - index * 0.14) / 0.72, 0, 1);
      const eased = 1 - (1 - progress) ** 3;
      const targetScale = group.userData.targetScale || 1;
      group.userData.targetScale = targetScale;
      group.scale.setScalar(targetScale * (0.88 + eased * 0.12));
      group.position.set(x, y + Math.sin(elapsed * speed + phase) * 0.075, z);
      group.rotation.y = rotation + elapsed * turn + Math.sin(elapsed * 0.28 + phase) * 0.1;
      group.rotation.x = Math.sin(elapsed * 0.24 + phase) * 0.035;
      group.traverse((node) => {
        if (!node.isMesh) return;
        const list = Array.isArray(node.material) ? node.material : [node.material];
        list.forEach((material) => { material.opacity = eased; });
      });
    });
    if (allEntered) entrancePlayed = true;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };
  const start = () => {
    if (!canAnimate() || frameId) return;
    lastTime = performance.now();
    frameId = requestAnimationFrame(animate);
  };
  const destroyRenderer = () => {
    stop();
    if (!renderer) return;
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    renderer = null;
  };
  const resize = () => {
    if (disposed) return;
    const width = Math.floor(container.clientWidth);
    const height = Math.floor(container.clientHeight);
    if (window.innerWidth < 700 || width < 1 || height < 1) {
      destroyRenderer();
      return;
    }
    if (!renderer && !failed) {
      try {
        const probe = document.createElement("canvas").getContext("webgl2");
        if (!probe) { failed = true; return; }
        probe.getExtension("WEBGL_lose_context")?.loseContext();
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.className = "overview-scene-canvas";
        renderer.domElement.setAttribute("aria-hidden", "true");
        container.appendChild(renderer.domElement);
      } catch {
        failed = true;
        destroyRenderer();
        return;
      }
    }
    if (!renderer) return;
    const aspect = width / height;
    camera.left = -1.4 * aspect;
    camera.right = 1.4 * aspect;
    camera.top = 1.4;
    camera.bottom = -1.4;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (!assetsStarted) {
      assetsStarted = true;
      loadProduce();
    }
    if (reduced) drawStaticFrame(); else start();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start(); else stop();
  }, { threshold: 0.05 });
  intersectionObserver.observe(card);
  const themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
  const onVisibility = () => { hidden = document.hidden; if (hidden) stop(); else start(); };
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotionChange = (event) => {
    reduced = event.matches;
    if (reduced) { stop(); drawStaticFrame(); } else start();
  };
  document.addEventListener("visibilitychange", onVisibility);
  motionPreference.addEventListener("change", onMotionChange);
  window.addEventListener("resize", resize);
  paintShadow();
  resize();

  return () => {
    disposed = true;
    stop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    themeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    motionPreference.removeEventListener("change", onMotionChange);
    window.removeEventListener("resize", resize);
    destroyRenderer();
    materials.forEach((material) => material.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    textures.forEach((texture) => texture.dispose());
  };
}
