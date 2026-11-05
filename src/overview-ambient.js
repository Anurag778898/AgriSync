const particleLayout = [
  [3, 18], [8, 36], [4, 57], [11, 78], [17, 25], [20, 68],
  [82, 17], [89, 33], [96, 51], [86, 72], [94, 87], [80, 83],
];

function svgElement(name, attributes = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

export function mountOverviewAmbient(container) {
  const world = document.createElement("div");
  world.className = "overview-ambient-world";

  ["left", "right", "lower"].forEach((name, index) => {
    const layer = document.createElement("div");
    layer.className = `ambient-parallax ambient-light ambient-light-${name}`;
    layer.dataset.depth = String(index + 1);
    const blob = document.createElement("div");
    blob.className = "ambient-light-blob";
    layer.appendChild(blob);
    world.appendChild(layer);
  });

  const rays = document.createElement("div");
  rays.className = "ambient-sun-rays";
  world.appendChild(rays);

  const contours = svgElement("svg", { class: "ambient-contours ambient-parallax", viewBox: "0 0 1000 600", preserveAspectRatio: "none" });
  contours.dataset.depth = "0.55";
  const contourGroup = svgElement("g");
  ["M0 360 C100 305 180 322 278 274 S430 242 505 268", "M1000 345 C915 302 842 332 756 286 S605 248 535 279", "M0 470 C116 414 192 438 295 386 S422 368 495 390", "M1000 455 C900 405 828 431 730 390 S594 365 520 401"].forEach((d) => {
    contourGroup.appendChild(svgElement("path", { d, class: "ambient-contour-path" }));
  });
  contours.appendChild(contourGroup);
  world.appendChild(contours);

  particleLayout.forEach(([x, y], index) => {
    const particle = document.createElement("div");
    particle.className = "ambient-parallax ambient-particle";
    particle.dataset.depth = "0.9";
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.setProperty("--particle-size", `${3 + (index % 4) * 1.5}px`);
    particle.style.setProperty("--particle-duration", `${14 + (index % 6) * 3}s`);
    particle.style.setProperty("--particle-delay", `${-(index * 2.7)}s`);
    particle.style.setProperty("--particle-enter-delay", `${550 + index * 35}ms`);
    const shape = document.createElement("span");
    shape.className = `ambient-particle-shape${index % 4 === 1 ? " is-leaf" : ""}`;
    if (index % 4 === 1) {
      const leaf = svgElement("svg", { viewBox: "0 0 16 12", focusable: "false" });
      leaf.appendChild(svgElement("path", { d: "M1 10C2 3 8 0 15 1c-1 7-7 11-14 9Z", fill: "currentColor" }));
      leaf.appendChild(svgElement("path", { d: "M2 10 12 2", fill: "none", stroke: "currentColor", "stroke-width": "0.6" }));
      shape.appendChild(leaf);
    }
    particle.appendChild(shape);
    world.appendChild(particle);
  });

  container.replaceChildren(world);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = reducedMotion.matches;
  let visible = !document.hidden;
  let intersecting = !("IntersectionObserver" in window);
  let disposed = false;
  let frame = 0;
  let introFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let bounds = container.getBoundingClientRect();

  const syncState = () => {
    container.classList.toggle("is-paused", !visible || !intersecting);
    container.classList.toggle("is-static", reduced);
    document.documentElement.classList.toggle("ambient-motion-paused", !visible || !intersecting);
    if (reduced) {
      targetX = 0;
      targetY = 0;
      pointerX = 0;
      pointerY = 0;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      container.querySelectorAll(".ambient-parallax").forEach((node) => { node.style.transform = ""; });
    }
  };

  const updateParallax = () => {
    frame = 0;
    if (disposed || reduced || !visible || !intersecting) return;
    pointerX += (targetX - pointerX) * 0.08;
    pointerY += (targetY - pointerY) * 0.08;
    container.querySelectorAll(".ambient-parallax").forEach((node) => {
      const depth = Number(node.dataset.depth || 1);
      node.style.transform = `translate3d(${-pointerX * 10 * depth}px, ${-pointerY * 10 * depth}px, 0)`;
    });
    if (Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > 0.004) frame = requestAnimationFrame(updateParallax);
  };
  const onPointerMove = (event) => {
    if (reduced || window.innerWidth < 900 || !window.matchMedia("(pointer: fine)").matches) return;
    targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2));
    targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2));
    if (!frame) frame = requestAnimationFrame(updateParallax);
  };
  const onPointerOut = (event) => {
    if (event.relatedTarget) return;
    targetX = 0;
    targetY = 0;
    if (!frame) frame = requestAnimationFrame(updateParallax);
  };
  const onVisibility = () => { visible = !document.hidden; syncState(); };
  const onMotion = (event) => { reduced = event.matches; syncState(); };
  const onResize = () => { bounds = container.getBoundingClientRect(); };
  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; syncState(); }, { threshold: 0.01 })
    : null;
  observer?.observe(container);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerout", onPointerOut, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  reducedMotion.addEventListener("change", onMotion);
  syncState();
  introFrame = requestAnimationFrame(() => container.classList.add("is-ready"));

  return () => {
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    if (introFrame) cancelAnimationFrame(introFrame);
    observer?.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerout", onPointerOut);
    window.removeEventListener("resize", onResize);
    reducedMotion.removeEventListener("change", onMotion);
    document.documentElement.classList.remove("ambient-motion-paused");
    container.classList.remove("is-ready", "is-paused", "is-static");
    container.replaceChildren();
  };
}
