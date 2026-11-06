const illustrationMarkup = `
<svg class="illustration-svg" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="illus-onion-shade" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--illus-onion-light)"/><stop offset="1" stop-color="var(--illus-onion)"/></linearGradient>
    <linearGradient id="illus-tomato-shade" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--illus-tomato-light)"/><stop offset="1" stop-color="var(--illus-tomato)"/></linearGradient>
    <linearGradient id="illus-trend-area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--illus-line)" stop-opacity=".26"/><stop offset="1" stop-color="var(--illus-line)" stop-opacity="0"/></linearGradient>
    <radialGradient id="illus-sun-glow"><stop stop-color="var(--illus-glow)" stop-opacity=".42"/><stop offset="1" stop-color="var(--illus-glow)" stop-opacity="0"/></radialGradient>
  </defs>

  <g class="illus-sun-depth" data-depth="1" aria-hidden="true">
    <circle class="illus-sun-glow" cx="424" cy="89" r="80" fill="url(#illus-sun-glow)"/>
    <g class="illus-rays" transform="translate(424 89)">
      <path d="M0-69v-13M49-49l9-9M69 0h13M49 49l9 9M0 69v13M-49 49l-9 9M-69 0h-13M-49-49l-9-9" fill="none" stroke="var(--illus-glow)" stroke-linecap="round" stroke-width="2"/>
    </g>
    <circle cx="424" cy="89" r="38" fill="var(--illus-sun)" opacity=".22"/>
  </g>

  <g class="illus-trend-layer" data-depth="1">
    <path class="illus-trend-area" d="M5 286C93 268 142 251 213 246S342 215 404 181 500 145 570 112V320H5Z" fill="url(#illus-trend-area)"/>
    <path class="illus-trend-line" pathLength="1" d="M5 286C93 268 142 251 213 246S342 215 404 181 500 145 570 112" fill="none" stroke="var(--illus-line)" stroke-linecap="round" stroke-width="2.5"/>
    <circle class="illus-trend-halo" cx="570" cy="112" r="15" fill="var(--illus-glow)" opacity=".16"/>
    <circle class="illus-trend-dot" cx="570" cy="112" r="4.5" fill="var(--illus-line)"/>
  </g>

  <g class="illus-wheat-depth" data-depth="2" opacity=".76">
    <g class="illus-wheat-sway" transform="translate(87 258) rotate(-8)">
      <path d="M0 0C4-40 3-80 1-116" fill="none" stroke="var(--illus-wheat-stem)" stroke-linecap="round" stroke-width="2.5"/>
      <path d="M1-83C-15-91-20-101-17-111-6-106 1-98 1-83Zm0-11c14-8 19-18 16-28C6-117 0-108 1-94Zm0-18C-12-120-15-130-11-139-3-133 1-124 1-112Zm0-12c12-9 15-18 10-27C3-136 0-128 1-112Z" fill="var(--illus-wheat)"/>
    </g>
    <g class="illus-wheat-sway" style="--illus-delay:-2.8s" transform="translate(520 182) rotate(12)">
      <path d="M0 0C-3-35-3-66 0-92" fill="none" stroke="var(--illus-wheat-stem)" stroke-linecap="round" stroke-width="2"/>
      <path d="M0-65c-12-6-15-14-13-22 8 4 13 11 13 22Zm0-8c10-6 13-14 10-21-7 4-10 11-10 21Zm0-14c-10-6-12-13-9-20 6 4 9 10 9 20Z" fill="var(--illus-wheat)"/>
    </g>
  </g>

  <g class="illus-leaves-depth" data-depth="2">
    <g class="illus-leaf-flutter" transform="translate(143 251) rotate(-12)">
      <path d="M0 0C-25-10-31-29-20-43-3-39 5-21 0 0Z" fill="var(--illus-leaf)"/><path d="M0 0-16-35" fill="none" stroke="var(--illus-leaf-vein)" stroke-width="1.5"/>
      <path d="M4-2C21-19 39-18 44-3 34 11 17 12 4-2Z" fill="var(--illus-leaf-light)"/><path d="m4-2 32-2" fill="none" stroke="var(--illus-leaf-vein)" stroke-width="1.3"/>
    </g>
    <g class="illus-leaf-flutter" style="--illus-delay:-3.4s" transform="translate(360 240) rotate(14) scale(.72)">
      <path d="M0 0C-25-10-31-29-20-43-3-39 5-21 0 0Z" fill="var(--illus-leaf)"/><path d="M0 0-16-35" fill="none" stroke="var(--illus-leaf-vein)" stroke-width="1.5"/>
      <path d="M4-2C21-19 39-18 44-3 34 11 17 12 4-2Z" fill="var(--illus-leaf-light)"/>
    </g>
  </g>

  <g class="illus-onion-depth" data-depth="3">
    <g class="illus-hop" transform="translate(230 176)">
      <g class="illus-onion-tilt">
        <path d="M0-76C-18-61-58-38-62 1-66 40-39 70 0 78 39 70 66 40 62 1 58-38 18-61 0-76Z" fill="url(#illus-onion-shade)"/>
        <path d="M-32-53C-47-32-52-4-44 20-38 40-25 55-8 64-23 43-28 17-26-9-24-29-18-44-11-59Z" fill="var(--illus-onion-highlight)" opacity=".46"/>
        <path d="M0-69C-8-39-10 7-7 63M0-69C12-37 16 5 10 66" fill="none" stroke="var(--illus-onion-fold)" stroke-linecap="round" stroke-width="2" opacity=".32"/>
        <path d="M-13-77C-19-98-17-111-11-126-5-113-4-96 0-79 5-100 12-113 21-122 22-104 14-88 8-74" fill="none" stroke="var(--illus-leaf)" stroke-linecap="round" stroke-width="6"/>
        <path d="M-7 72-14 88m14-13 0 17m13-20 7 14" fill="none" stroke="var(--illus-root)" stroke-linecap="round" stroke-width="2.4"/>
      </g>
    </g>
  </g>

  <g class="illus-soy-depth" data-depth="2" opacity=".92">
    <g class="illus-bob" transform="translate(325 219) rotate(-16)">
      <path d="M-43 2C-42-17-24-32 5-32 34-31 47-13 41 7 35 25 13 32-15 27-34 23-45 15-43 2Z" fill="var(--illus-soy)" stroke="var(--illus-soy-edge)" stroke-width="2"/>
      <circle cx="-21" cy="2" r="7" fill="var(--illus-soy-seed)"/><circle cx="0" cy="-2" r="7" fill="var(--illus-soy-seed)"/><circle cx="21" cy="0" r="7" fill="var(--illus-soy-seed)"/>
    </g>
  </g>

  <g class="illus-tomato-depth" data-depth="2">
    <g class="illus-hop" transform="translate(350 185) rotate(9)">
      <g class="illus-bob">
        <path d="M0-35C-31-39-48-18-45 9-43 34-24 47 0 43 25 47 44 31 45 7 47-19 29-39 0-35Z" fill="url(#illus-tomato-shade)"/>
        <path d="M0-32-5-44-12-35-26-38-19-27-32-23-17-19-12-8-4-17 10-17 3-26 11-34Z" fill="var(--illus-leaf)"/>
        <path d="M-25-16C-34-2-29 18-17 27" fill="none" stroke="var(--illus-tomato-highlight)" stroke-linecap="round" stroke-width="5" opacity=".48"/>
      </g>
    </g>
  </g>

  <g class="illus-chili-depth" data-depth="3">
    <g class="illus-bob" transform="translate(270 258) rotate(-18)">
      <path d="M-42-4C-15-24 14-24 39-7 23 10 2 21-21 17-34 15-43 7-42-4Z" fill="var(--illus-chili)"/>
      <path d="M31-8C38-21 49-25 56-16L42-3" fill="none" stroke="var(--illus-leaf)" stroke-linecap="round" stroke-width="5"/>
      <path d="M-26 0C-7-11 12-12 28-7" fill="none" stroke="var(--illus-chili-highlight)" stroke-linecap="round" stroke-width="2" opacity=".52"/>
    </g>
  </g>

  <g class="illus-sparkles" aria-hidden="true">
    <circle cx="154" cy="120" r="2.2" fill="var(--illus-sparkle)"/><circle cx="386" cy="124" r="2.5" fill="var(--illus-sparkle)"/>
    <circle cx="457" cy="194" r="2" fill="var(--illus-sparkle)"/><circle cx="183" cy="278" r="2.4" fill="var(--illus-sparkle)"/>
    <circle cx="485" cy="68" r="1.8" fill="var(--illus-sparkle)"/><circle cx="54" cy="226" r="2" fill="var(--illus-sparkle)"/>
  </g>
</svg>`;

export function mountOverviewIllustration(container) {
  const card = container.closest(".market-note");
  const compareButton = card?.querySelector(".button-light");
  container.innerHTML = illustrationMarkup;
  const layers = [...container.querySelectorAll("[data-depth]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let inView = false;

  const viewObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    container.classList.toggle("is-paused", !inView || document.hidden || reducedMotion.matches);
  }, { threshold: 0.05 });
  viewObserver.observe(card || container);

  const onVisibility = () => container.classList.toggle("is-paused", document.hidden || !inView || reducedMotion.matches);
  const onMotionChange = () => {
    container.classList.toggle("is-static", reducedMotion.matches);
    container.classList.toggle("is-paused", document.hidden || !inView || reducedMotion.matches);
  };
  const onPointerMove = (event) => {
    if (!finePointer.matches || reducedMotion.matches) return;
    const bounds = container.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    const y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth) || 1;
      layer.style.setProperty("--layer-x", `${(x * depth * 3.3).toFixed(1)}px`);
      layer.style.setProperty("--layer-y", `${(y * depth * 3).toFixed(1)}px`);
      layer.style.setProperty("--pointer-tilt", `${(x * depth * 0.25).toFixed(2)}deg`);
    });
  };
  const onPointerLeave = () => layers.forEach((layer) => {
    layer.style.setProperty("--layer-x", "0px");
    layer.style.setProperty("--layer-y", "0px");
    layer.style.setProperty("--pointer-tilt", "0deg");
  });
  const onCompareEnter = () => container.classList.add("is-comparing");
  const onCompareLeave = () => container.classList.remove("is-comparing");

  requestAnimationFrame(() => container.classList.add("is-ready"));
  onMotionChange(); onVisibility();
  container.addEventListener("pointermove", onPointerMove, { passive: true });
  container.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibility);
  reducedMotion.addEventListener("change", onMotionChange);
  compareButton?.addEventListener("pointerenter", onCompareEnter);
  compareButton?.addEventListener("pointerleave", onCompareLeave);

  return () => {
    viewObserver.disconnect();
    container.removeEventListener("pointermove", onPointerMove);
    container.removeEventListener("pointerleave", onPointerLeave);
    document.removeEventListener("visibilitychange", onVisibility);
    reducedMotion.removeEventListener("change", onMotionChange);
    compareButton?.removeEventListener("pointerenter", onCompareEnter);
    compareButton?.removeEventListener("pointerleave", onCompareLeave);
    container.replaceChildren();
  };
}
