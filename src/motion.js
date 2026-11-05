const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function directTextNode(element) {
  return [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
}

function readNumber(text) {
  const match = text?.trim().match(/^([₹$€£]?)([+−-]?)([\d,]+)(\.\d+)?(%?)(.*)$/);
  if (!match) return null;
  return { match, value: Number(`${match[2] === "−" ? "-" : match[2]}${match[3].replaceAll(",", "")}${match[4] || ""}`) };
}

function formatNumber(value, parts) {
  const [, currency, sign, integer, fraction = "", percent, suffix] = parts;
  const digits = fraction.length;
  const formatted = new Intl.NumberFormat("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Math.abs(value));
  const padded = integer.length > 1 && integer.startsWith("0") ? formatted.padStart(integer.length, "0") : formatted;
  return `${currency}${sign}${padded}${percent}${suffix}`;
}

function flashValue(element, nextValue, timers) {
  const previous = readNumber(element.dataset.lastValue);
  const next = readNumber(nextValue);
  if (!previous || !next || previous.value === next.value) return;
  element.dataset.flashDirection = next.value > previous.value ? "up" : "down";
  element.classList.remove("value-flash");
  void element.offsetWidth;
  element.classList.add("value-flash");
  clearTimeout(timers.get(element));
  timers.set(element, window.setTimeout(() => element.classList.remove("value-flash"), 900));
}

function countUp(element) {
  const node = directTextNode(element);
  const parsed = readNumber(node?.textContent);
  if (!node || !parsed) return;
  const final = parsed.value;
  const start = final * 0.85;
  const began = performance.now();
  element.dataset.countAnimating = "true";
  const frame = (now) => {
    const progress = Math.min(1, (now - began) / 700);
    const eased = 1 - (1 - progress) ** 3;
    node.textContent = formatNumber(start + (final - start) * eased, parsed.match);
    if (progress < 1) requestAnimationFrame(frame);
    else {
      node.textContent = formatNumber(final, parsed.match);
      element.dataset.lastValue = node.textContent.trim();
      element.dataset.countAnimating = "false";
      element.dataset.countDone = "true";
    }
  };
  requestAnimationFrame(frame);
}

export function startPageTransition(update) {
  if (reducedMotion() || !document.startViewTransition) return update();
  const root = document.documentElement;
  root.classList.add("view-transition-active");
  try {
    const transition = document.startViewTransition(update);
    transition.finished.then(() => root.classList.remove("view-transition-active"), () => root.classList.remove("view-transition-active"));
    return transition;
  } catch {
    root.classList.remove("view-transition-active");
    return update();
  }
}

export function startThemeTransition(button, update) {
  if (reducedMotion() || !document.startViewTransition) return update();
  const rect = button.getBoundingClientRect();
  const root = document.documentElement;
  root.style.setProperty("--theme-origin-x", `${rect.left + rect.width / 2}px`);
  root.style.setProperty("--theme-origin-y", `${rect.top + rect.height / 2}px`);
  root.classList.add("theme-transitioning");
  try {
    const transition = document.startViewTransition(update);
    transition.finished.then(() => root.classList.remove("theme-transitioning"), () => root.classList.remove("theme-transitioning"));
    return transition;
  } catch {
    root.classList.remove("theme-transitioning");
    return update();
  }
}

export function slideNavIndicator(page, previousRect) {
  if (!previousRect || reducedMotion()) return;
  const target = [...document.querySelectorAll(".menu-item[data-page]")].find((item) => item.dataset.page === page);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--nav-delta-y", `${previousRect.top - rect.top}px`);
  target.style.setProperty("--nav-scale-y", `${previousRect.height / rect.height}`);
  target.classList.remove("nav-indicator-moving");
  void target.offsetWidth;
  target.classList.add("nav-indicator-moving");
  window.setTimeout(() => {
    target.classList.remove("nav-indicator-moving");
    target.style.removeProperty("--nav-delta-y");
    target.style.removeProperty("--nav-scale-y");
  }, 400);
}

export function setupMotion(root) {
  if (!root) return () => {};
  const timers = new Map();
  const countElements = [...root.querySelectorAll("[data-countup]")];
  countElements.forEach((element) => {
    const node = directTextNode(element);
    element.dataset.lastValue = node?.textContent.trim() || "";
  });
  const countObserver = "IntersectionObserver" in window && !reducedMotion()
    ? new IntersectionObserver((entries, observer) => entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) { observer.unobserve(target); countUp(target); }
    }), { threshold: 0.3 })
    : null;
  countElements.forEach((element) => countObserver ? countObserver.observe(element) : element.dataset.countDone !== "true" && !reducedMotion() && countUp(element));

  const flashObserver = new MutationObserver((records) => records.forEach((record) => {
    const element = record.target.nodeType === Node.TEXT_NODE ? record.target.parentElement?.closest("[data-countup]") : record.target.closest?.("[data-countup]");
    if (!element || element.dataset.countDone !== "true" || element.dataset.countAnimating === "true") return;
    const next = directTextNode(element)?.textContent.trim();
    if (next && next !== element.dataset.lastValue) {
      flashValue(element, next, timers);
      element.dataset.lastValue = next;
    }
  }));
  flashObserver.observe(root, { subtree: true, characterData: true, childList: true });

  const hero = root.querySelector(".market-note");
  const heroObserver = hero && "IntersectionObserver" in window
    ? new IntersectionObserver(([entry]) => hero.classList.toggle("motion-paused", !entry.isIntersecting || document.hidden), { threshold: 0.05 })
    : null;
  heroObserver?.observe(hero);
  const onVisibility = () => hero?.classList.toggle("motion-paused", document.hidden || !heroObserver);
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    countObserver?.disconnect();
    flashObserver.disconnect();
    heroObserver?.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    timers.forEach(clearTimeout);
  };
}
