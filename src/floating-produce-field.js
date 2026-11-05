const ASSET_ROOT = "/assets/produce/";

const crops = {
  onion: '<path fill="#a2694d" d="M64 22c-8 13-29 18-36 41-8 27 8 48 36 50 28-2 44-23 36-50-7-23-28-28-36-41Z"/><path fill="#e4d594" fill-opacity=".72" d="M64 22v-9m-8 10c-2 8-1 15 2 21m12-21c2 8 1 15-2 21"/><path fill="none" stroke="#f0d9b6" stroke-opacity=".52" stroke-width="3" stroke-linecap="round" d="M45 48c-13 17-13 39 0 51m38-51c13 17 13 39 0 51M57 59c-5 12-5 25 0 37m14-37c5 12 5 25 0 37"/>',
  tomato: '<path fill="#a05e4f" d="M64 37c-11-12-29-10-39 2-16 20-9 55 12 68 18 11 36 11 54 0 21-13 28-48 12-68-10-12-28-14-39-2Z"/><path fill="#55734d" d="m64 40-8-19 9 10 8-14-2 18 19-9-13 15 19 4-21 3-11 12-11-12-21-3 19-4-13-15Z"/>',
  soybean: '<path fill="#7a7042" d="M22 72c9-24 30-39 54-35 21 4 34 21 31 39-3 20-23 31-48 27-22-4-42-13-37-31Z"/><ellipse fill="#e4d594" fill-opacity=".82" cx="48" cy="70" rx="10" ry="14"/><ellipse fill="#e4d594" fill-opacity=".82" cx="70" cy="72" rx="10" ry="14"/><ellipse fill="#e4d594" fill-opacity=".82" cx="90" cy="72" rx="9" ry="12"/><path fill="none" stroke="#55734d" stroke-width="3" stroke-linecap="round" d="M29 82c21 5 46 4 70-4"/>',
  potato: '<path fill="#bc9855" d="M23 66c-3-14 10-26 25-28 8-9 23-12 34-4 14-5 27 7 25 19 10 12 2 26-8 31-8 17-25 20-38 13-15 5-32-3-34-16-8-3-11-9-4-15Z"/><g fill="#55734d" fill-opacity=".58"><circle cx="46" cy="59" r="3"/><circle cx="77" cy="49" r="2.5"/><circle cx="88" cy="74" r="3"/><circle cx="55" cy="84" r="2.5"/></g>',
  chili: '<path fill="#55734d" d="M29 90c14-30 28-49 51-59 12-5 22-4 27 1-10 6-12 16-9 27 4 17-6 34-24 44-17 9-35 8-45-1Z"/><path fill="none" stroke="#bc9855" stroke-width="5" stroke-linecap="round" d="M83 35c6-8 7-14 4-21m0 10c-7 1-11-2-13-7"/>',
  wheat: '<path fill="none" stroke="#bc9855" stroke-width="5" stroke-linecap="round" d="M58 112c5-34 11-65 14-95"/><g fill="#d7bd76"><ellipse cx="57" cy="32" rx="8" ry="15" transform="rotate(-36 57 32)"/><ellipse cx="78" cy="41" rx="8" ry="15" transform="rotate(35 78 41)"/><ellipse cx="53" cy="51" rx="8" ry="15" transform="rotate(-36 53 51)"/><ellipse cx="76" cy="61" rx="8" ry="15" transform="rotate(35 76 61)"/><ellipse cx="50" cy="71" rx="8" ry="14" transform="rotate(-36 50 71)"/></g><path fill="none" stroke="#55734d" stroke-width="3" stroke-linecap="round" d="M60 88c-13-10-20-18-26-30m30 11c12-7 20-15 27-26"/>',
  leaf: '<path fill="#55734d" d="M20 102c-4-42 18-75 76-83 6 51-14 81-76 83Z"/><path fill="none" stroke="#e4d594" stroke-opacity=".72" stroke-width="3" stroke-linecap="round" d="M23 99c20-23 42-42 69-73m-45 49-2-21m20 2 1-19"/>',
};

const layout = [
  { crop: "onion", depth: "far", x: 2, y: 17, size: 42, z: -360, scale: 0.42, opacity: 0.72, duration: 15, delay: -3, driftX: 7, driftY: 11, turn: 8 },
  { crop: "wheat", depth: "far", x: 94, y: 22, size: 45, z: -330, scale: 0.46, opacity: 0.74, duration: 13, delay: -7, driftX: -8, driftY: 10, turn: -7 },
  { crop: "leaf", depth: "far", x: 5, y: 42, size: 40, z: -380, scale: 0.38, opacity: 0.68, duration: 16, delay: -4, driftX: 6, driftY: -9, turn: 8 },
  { crop: "tomato", depth: "far", x: 96, y: 48, size: 43, z: -350, scale: 0.44, opacity: 0.7, duration: 14, delay: -10, driftX: -6, driftY: -10, turn: -9 },
  { crop: "potato", depth: "far", x: 3, y: 70, size: 43, z: -370, scale: 0.4, opacity: 0.72, duration: 15, delay: -2, driftX: 8, driftY: -8, turn: 7 },
  { crop: "soybean", depth: "far", x: 95, y: 78, size: 44, z: -345, scale: 0.45, opacity: 0.7, duration: 14, delay: -8, driftX: -8, driftY: 9, turn: -8 },
  { crop: "chili", depth: "far", x: 10, y: 88, size: 42, z: -390, scale: 0.37, opacity: 0.68, duration: 16, delay: -5, driftX: 7, driftY: -7, turn: -8 },
  { crop: "wheat", depth: "far", x: 89, y: 38, size: 41, z: -355, scale: 0.4, opacity: 0.68, duration: 15, delay: -11, driftX: -5, driftY: 8, turn: 6 },
  { crop: "leaf", depth: "far", x: 8, y: 58, size: 45, z: -365, scale: 0.42, opacity: 0.69, duration: 14, delay: -6, driftX: 8, driftY: -11, turn: 10 },
  { crop: "tomato", depth: "mid", x: 1, y: 30, size: 55, z: -80, scale: 0.8, opacity: 0.68, duration: 12, delay: -4, driftX: 10, driftY: 13, turn: -8 },
  { crop: "soybean", depth: "mid", x: 95, y: 31, size: 57, z: -45, scale: 0.88, opacity: 0.68, duration: 11, delay: -9, driftX: -12, driftY: 12, turn: 8 },
  { crop: "potato", depth: "mid", x: 3, y: 54, size: 58, z: -20, scale: 0.92, opacity: 0.64, duration: 10, delay: -2, driftX: 11, driftY: -14, turn: -9 },
  { crop: "chili", depth: "mid", x: 96, y: 61, size: 56, z: -65, scale: 0.82, opacity: 0.65, duration: 12, delay: -7, driftX: -10, driftY: -12, turn: 10 },
  { crop: "wheat", depth: "mid", x: 1, y: 80, size: 58, z: -35, scale: 0.94, opacity: 0.63, duration: 11, delay: -10, driftX: 12, driftY: 10, turn: 7 },
  { crop: "leaf", depth: "mid", x: 96, y: 88, size: 57, z: -55, scale: 0.88, opacity: 0.62, duration: 13, delay: -6, driftX: -11, driftY: -10, turn: -10 },
  { crop: "onion", depth: "near", x: 2, y: 38, size: 62, z: 210, scale: 1.75, opacity: 0.43, duration: 9, delay: -3, driftX: 14, driftY: 16, turn: -11 },
  { crop: "tomato", depth: "near", x: 97, y: 54, size: 64, z: 255, scale: 1.95, opacity: 0.39, duration: 8, delay: -6, driftX: -16, driftY: -15, turn: 11 },
  { crop: "leaf", depth: "near", x: 3, y: 74, size: 62, z: 230, scale: 1.7, opacity: 0.38, duration: 10, delay: -8, driftX: 15, driftY: -14, turn: 10 },
];

const staticItems = new Set([0, 2, 5, 9, 12]);
const mobileItems = new Set([0, 2, 4, 9, 11, 13]);

function svgSource(name) {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">${crops[name]}</svg>`)}`;
}

async function findAsset(crop, signal) {
  for (const extension of ["webp", "png"]) {
    try {
      const response = await fetch(`${ASSET_ROOT}${crop}.${extension}`, { method: "HEAD", signal, cache: "force-cache" });
      if (response.ok) return `${ASSET_ROOT}${crop}.${extension}`;
    } catch {
      return null;
    }
  }
  return null;
}

function makeItem(item, index) {
  const wrapper = document.createElement("div");
  wrapper.className = `produce-field-item produce-field-${item.depth}`;
  wrapper.dataset.index = String(index);
  wrapper.style.left = `${item.x}%`;
  wrapper.style.top = `${item.y}%`;
  wrapper.style.setProperty("--item-size", `${item.size}px`);
  wrapper.style.setProperty("--item-depth", `${item.z}px`);
  wrapper.style.setProperty("--item-scale", item.scale);
  wrapper.style.setProperty("--item-start-scale", (item.scale * 0.92).toFixed(3));
  wrapper.style.setProperty("--item-opacity", item.opacity);
  wrapper.style.setProperty("--item-duration", `${item.duration}s`);
  wrapper.style.setProperty("--item-delay", `${item.delay}s`);
  wrapper.style.setProperty("--drift-x", `${item.driftX}px`);
  wrapper.style.setProperty("--drift-y", `${item.driftY}px`);
  wrapper.style.setProperty("--turn", `${item.turn}deg`);
  wrapper.dataset.crop = item.crop;

  const depth = document.createElement("div");
  depth.className = "produce-field-depth";
  depth.dataset.depth = item.depth;
  const drift = document.createElement("div");
  drift.className = "produce-field-drift";
  const image = document.createElement("img");
  image.className = "produce-field-image";
  image.alt = "";
  image.width = item.depth === "near" ? 700 : 400;
  image.height = image.width;
  image.loading = "lazy";
  image.decoding = "async";
  image.src = svgSource(item.crop);
  drift.appendChild(image);
  depth.appendChild(drift);
  wrapper.appendChild(depth);
  return wrapper;
}

export function mountFloatingProduceField(container) {
  const world = document.createElement("div");
  world.className = "produce-field-world";
  const nodes = layout.map(makeItem);
  nodes.forEach((node) => world.appendChild(node));
  container.replaceChildren(world);

  const controller = new AbortController();
  const signal = controller.signal;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smallScreen = window.matchMedia("(max-width: 699px)");
  let intersecting = !("IntersectionObserver" in window);
  let tabVisible = !document.hidden;
  let reduced = reducedMotion.matches;
  let small = smallScreen.matches;
  let disposed = false;
  let raf = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let bounds = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

  const applyState = () => {
    container.classList.toggle("is-mobile", small);
    container.classList.toggle("is-reduced", reduced);
    container.classList.toggle("is-paused", !intersecting || !tabVisible);
    nodes.forEach((node, index) => {
      node.hidden = reduced ? !staticItems.has(index) : small ? !mobileItems.has(index) : false;
      if (reduced || small) {
        const depth = node.firstElementChild;
        depth?.style.setProperty("--parallax-x", "0px");
        depth?.style.setProperty("--parallax-y", "0px");
      }
    });
    if (reduced) {
      targetX = 0;
      targetY = 0;
      pointerX = 0;
      pointerY = 0;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const loadAssetFor = async (node, assetPath) => {
    if (disposed) return;
    const image = node.querySelector("img");
    if (!image) return;
    if (!assetPath) {
      try { await image.decode(); } catch { /* keep the SVG fallback */ }
      return;
    }
    await new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        resolve();
      };
      const timeout = window.setTimeout(() => {
        if (!image.dataset.assetLoaded) image.src = svgSource(node.dataset.crop);
        finish();
      }, 4000);
      image.onload = async () => {
        if (image.currentSrc !== new URL(assetPath, document.baseURI).href) return;
        image.dataset.assetLoaded = "true";
        try { await image.decode(); } catch { image.src = svgSource(node.dataset.crop); }
        finish();
      };
      image.onerror = () => {
        image.src = svgSource(node.dataset.crop);
        finish();
      };
      image.src = assetPath;
    });
  };

  const begin = async () => {
    const cropsToLoad = [...new Set(layout.map(({ crop }) => crop))];
    const assets = await Promise.all(cropsToLoad.map(async (crop) => [crop, await findAsset(crop, signal)]));
    if (disposed) return;
    const assetMap = new Map(assets);
    await Promise.all(nodes.map((node) => loadAssetFor(node, assetMap.get(node.dataset.crop))));
    if (disposed) return;
    applyState();
    container.classList.add("is-ready");
  };

  const updateBounds = () => { bounds = container.getBoundingClientRect(); };
  const animateParallax = () => {
    raf = 0;
    if (disposed || !intersecting || !tabVisible || reduced || small) return;
    pointerX += (targetX - pointerX) * 0.09;
    pointerY += (targetY - pointerY) * 0.09;
    let moving = false;
    nodes.forEach((node, index) => {
      const factor = layout[index].depth === "near" ? 14 : layout[index].depth === "mid" ? 8 : 4;
      const x = -pointerX * factor;
      const y = -pointerY * factor;
      node.firstElementChild?.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
      node.firstElementChild?.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      if (Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > 0.004) moving = true;
    });
    if (moving) raf = requestAnimationFrame(animateParallax);
  };
  const onPointerMove = (event) => {
    if (reduced || small || !window.matchMedia("(pointer: fine)").matches) return;
    targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2));
    targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2));
    if (!raf) raf = requestAnimationFrame(animateParallax);
  };
  const onPointerOut = (event) => {
    if (event.relatedTarget) return;
    targetX = 0;
    targetY = 0;
    if (!raf) raf = requestAnimationFrame(animateParallax);
  };
  const onVisibility = () => { tabVisible = !document.hidden; applyState(); };
  const onMotion = (event) => { reduced = event.matches; applyState(); };
  const onResize = () => { small = smallScreen.matches; updateBounds(); applyState(); };

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; applyState(); }, { threshold: 0.01 })
    : null;
  observer?.observe(container);
  const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(updateBounds) : null;
  resizeObserver?.observe(container);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerout", onPointerOut, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  reducedMotion.addEventListener("change", onMotion);
  smallScreen.addEventListener("change", onResize);
  updateBounds();
  applyState();
  begin();

  return () => {
    disposed = true;
    controller.abort();
    if (raf) cancelAnimationFrame(raf);
    observer?.disconnect();
    resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerout", onPointerOut);
    window.removeEventListener("resize", onResize);
    reducedMotion.removeEventListener("change", onMotion);
    smallScreen.removeEventListener("change", onResize);
    container.classList.remove("is-ready", "is-mobile", "is-reduced", "is-paused");
    container.replaceChildren();
  };
}
