/**
 * AgriSync – Global Navigation & Health Polling
 */

const API_BASE = (location.port === '8000' || location.port === '') ? '' : 'http://127.0.0.1:8000';

// Map nav-item data-path / data-page values → HTML filenames
const PAGE_MAP = {
  'overview': 'overview.html',
  'ai-farming-assistant': 'ai-assistant.html',
  'weather-intelligence': 'weather.html',
  'crop-price-intelligence': 'crop-prices.html',
  'crop-and-market-explorer': 'crop-market-explorer.html',
  'telemetry': 'telemetry.html',
  'alerts-notifications': 'telemetry.html',
  'settings': 'settings.html',
  'login': 'login.html',
  'signup': 'signup.html',
};

function initNavigation() {
  const currentFile = location.pathname.split('/').pop() || 'overview.html';

  document.querySelectorAll('[data-path], [data-page]').forEach(el => {
    const path = el.getAttribute('data-path') || el.getAttribute('data-page');
    const target = PAGE_MAP[path];

    if (target) {
      if (el.tagName === 'A') {
        el.setAttribute('href', target);
      }
      el.style.cursor = 'pointer';

      // Check if this nav item matches the current page
      const isActive = (target === currentFile) || 
                       ((currentFile === 'index.html' || currentFile === '') && target === 'overview.html');

      if (isActive) {
        el.classList.add('bg-brand-50', 'text-brand-800', 'font-semibold');
        el.classList.remove('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900', 'text-on-surface-variant');
        el.setAttribute('aria-current', 'page');
        const icon = el.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.classList.remove('text-slate-400');
          icon.classList.add('text-brand-700');
        }
      }

      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = target;
      });
    }
  });

  // Also handle links with hash patterns
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const hash = a.getAttribute('href').replace('#', '');
    if (PAGE_MAP[hash]) {
      a.setAttribute('href', PAGE_MAP[hash]);
      a.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = PAGE_MAP[hash];
      });
    }
  });
}

async function pollHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const dot = document.getElementById('health-dot');
    if (dot) {
      dot.style.background = res.ok ? '#10b981' : '#ef4444';
    }
  } catch {
    const dot = document.getElementById('health-dot');
    if (dot) dot.style.background = '#ef4444';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  pollHealth();
  setInterval(pollHealth, 30000);
});
