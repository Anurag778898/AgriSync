/**
 * AgriSync Crop Prices Client
 * Connects the Crop Price Intelligence page to backend market APIs
 */

const MARKET_API = (location.port === '8000' || location.port === '') ? '' : 'http://127.0.0.1:8000';

const COMMODITY_MANDI_DEFAULTS = {
  wheat: {
    basePrice: 2275,
    msp: 2125,
    mandis: [
      { name: "Lasalgaon APMC (Benchmark)", loc: "Nashik, Maharashtra", modal: 2275, min: 2190, max: 2350, vol: 1420, chg: 2.4, dist: "Local (18 km)", margin: "Base" },
      { name: "Pimpalgaon Baswant APMC", loc: "Nashik, Maharashtra", modal: 2240, min: 2150, max: 2310, vol: 890, chg: 1.1, dist: "26 km", margin: "-₹35 / qtl" },
      { name: "Vashi APMC Terminal", loc: "Navi Mumbai, Maharashtra", modal: 2520, min: 2400, max: 2650, vol: 3450, chg: 4.2, dist: "165 km", margin: "+₹155 / qtl" },
      { name: "Surat APMC Market", loc: "Surat, Gujarat", modal: 2380, min: 2280, max: 2450, vol: 1120, chg: 0.8, dist: "220 km", margin: "+₹10 / qtl" },
      { name: "Indore Mandi Terminal", loc: "Indore, Madhya Pradesh", modal: 2210, min: 2120, max: 2290, vol: 1780, chg: -0.5, dist: "410 km", margin: "-₹185 / qtl" },
    ]
  },
  tomato: {
    basePrice: 1850,
    msp: null,
    mandis: [
      { name: "Lasalgaon APMC (Benchmark)", loc: "Nashik, Maharashtra", modal: 1850, min: 1600, max: 2100, vol: 2800, chg: 5.8, dist: "Local (18 km)", margin: "Base" },
      { name: "Pimpalgaon Baswant APMC", loc: "Nashik, Maharashtra", modal: 1880, min: 1650, max: 2150, vol: 3200, chg: 6.2, dist: "26 km", margin: "+₹30 / qtl" },
      { name: "Vashi APMC Terminal", loc: "Navi Mumbai, Maharashtra", modal: 2250, min: 2000, max: 2500, vol: 5400, chg: 7.5, dist: "165 km", margin: "+₹280 / qtl" },
      { name: "Azadpur Mandi", loc: "New Delhi, Delhi", modal: 2400, min: 2100, max: 2700, vol: 8200, chg: 8.0, dist: "1150 km", margin: "+₹190 / qtl" },
      { name: "Surat APMC Market", loc: "Surat, Gujarat", modal: 2020, min: 1800, max: 2250, vol: 1950, chg: 4.1, dist: "220 km", margin: "+₹85 / qtl" },
    ]
  },
  onion: {
    basePrice: 1420,
    msp: null,
    mandis: [
      { name: "Lasalgaon APMC (Benchmark)", loc: "Nashik, Maharashtra", modal: 1420, min: 1100, max: 1750, vol: 4500, chg: 3.1, dist: "Local (18 km)", margin: "Base" },
      { name: "Pimpalgaon Baswant APMC", loc: "Nashik, Maharashtra", modal: 1400, min: 1080, max: 1720, vol: 3900, chg: 2.8, dist: "26 km", margin: "-₹20 / qtl" },
      { name: "Vashi APMC Terminal", loc: "Navi Mumbai, Maharashtra", modal: 1780, min: 1450, max: 2100, vol: 6200, chg: 4.5, dist: "165 km", margin: "+₹230 / qtl" },
      { name: "Azadpur Mandi", loc: "New Delhi, Delhi", modal: 1890, min: 1500, max: 2250, vol: 9100, chg: 5.2, dist: "1150 km", margin: "+₹160 / qtl" },
      { name: "Solapur APMC", loc: "Solapur, Maharashtra", modal: 1350, min: 1020, max: 1620, vol: 2400, chg: 1.5, dist: "340 km", margin: "-₹150 / qtl" },
    ]
  },
  soybean: {
    basePrice: 4600,
    msp: 4300,
    mandis: [
      { name: "Lasalgaon APMC (Benchmark)", loc: "Nashik, Maharashtra", modal: 4600, min: 4400, max: 4800, vol: 1100, chg: 0.8, dist: "Local (18 km)", margin: "Base" },
      { name: "Latur Mandi", loc: "Latur, Maharashtra", modal: 4720, min: 4500, max: 4950, vol: 4200, chg: 1.4, dist: "310 km", margin: "+₹35 / qtl" },
      { name: "Indore Mandi Terminal", loc: "Indore, Madhya Pradesh", modal: 4680, min: 4450, max: 4890, vol: 5100, chg: 1.0, dist: "410 km", margin: "-₹10 / qtl" },
      { name: "Akola APMC", loc: "Akola, Maharashtra", modal: 4640, min: 4420, max: 4850, vol: 2800, chg: 0.5, dist: "360 km", margin: "-₹40 / qtl" },
      { name: "Kota APMC", loc: "Kota, Rajasthan", modal: 4750, min: 4520, max: 4980, vol: 3600, chg: 1.8, dist: "680 km", margin: "-₹65 / qtl" },
    ]
  },
  cotton: {
    basePrice: 7100,
    msp: 6620,
    mandis: [
      { name: "Lasalgaon APMC (Benchmark)", loc: "Nashik, Maharashtra", modal: 7100, min: 6800, max: 7400, vol: 620, chg: -0.5, dist: "Local (18 km)", margin: "Base" },
      { name: "Jalgaon APMC", loc: "Jalgaon, Maharashtra", modal: 7280, min: 6950, max: 7550, vol: 2100, chg: 0.6, dist: "180 km", margin: "+₹95 / qtl" },
      { name: "Rajkot APMC", loc: "Rajkot, Gujarat", modal: 7450, min: 7100, max: 7750, vol: 4800, chg: 1.2, dist: "520 km", margin: "+₹140 / qtl" },
      { name: "Adilabad Mandi", loc: "Adilabad, Telangana", modal: 7050, min: 6750, max: 7320, vol: 1850, chg: -1.0, dist: "550 km", margin: "-₹210 / qtl" },
    ]
  }
};

async function loadCropPrices(commodity = 'wheat', unit = 'quintal') {
  try {
    const res = await fetch(`${MARKET_API}/api/v1/market/prices?commodity=${commodity}&unit=${unit}`);
    if (!res.ok) return;
    const data = await res.json();

    const priceEl = document.getElementById('current-price');
    if (priceEl && data.current_price) {
      const displayPrice = unit === 'kg' ? (data.current_price / 100).toFixed(2) : Math.round(data.current_price);
      priceEl.textContent = `₹${displayPrice}/${unit}`;
    }

    const changeEl = document.getElementById('price-change');
    if (changeEl && data.change_pct !== undefined) {
      changeEl.textContent = `${data.change_pct > 0 ? '+' : ''}${data.change_pct}%`;
      changeEl.className = `text-xs font-bold px-2 py-0.5 rounded-full font-mono ${data.change_pct >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`;
    }

    // Update Chart.js if present
    if (window.priceChart && data.history) {
      const hist = data.history;
      const baseVal = data.current_price;
      const mult = unit === 'kg' ? 0.01 : 1;

      const labels = hist.map(d => d.date.slice(5)).concat(['+3D (F)', '+6D (F)', '+9D (F)', '+12D (F)', '+15D (F)']);
      
      const histPoints = hist.map(d => Math.round(d.price * mult));
      const lastHist = histPoints[histPoints.length - 1];
      
      const forecastPoints = Array(hist.length - 1).fill(null);
      forecastPoints.push(lastHist);
      forecastPoints.push(Math.round(lastHist * 1.018));
      forecastPoints.push(Math.round(lastHist * 1.035));
      forecastPoints.push(Math.round(lastHist * 1.052));
      forecastPoints.push(Math.round(lastHist * 1.065));
      forecastPoints.push(Math.round(lastHist * 1.058));

      window.priceChart.data.labels = labels;
      window.priceChart.data.datasets[0].data = histPoints.concat([null, null, null, null, null]);
      window.priceChart.data.datasets[1].data = forecastPoints;
      
      const conf = COMMODITY_MANDI_DEFAULTS[commodity.toLowerCase()];
      if (conf && conf.msp && window.priceChart.data.datasets[2]) {
        window.priceChart.data.datasets[2].data = Array(labels.length).fill(Math.round(conf.msp * mult));
        window.priceChart.data.datasets[2].label = `MSP Floor (₹${Math.round(conf.msp * mult)})`;
      }
      
      window.priceChart.update();
    }

    // Update Mandi Matrix Table if present
    updateMandiTable(commodity, unit);

  } catch (err) {
    console.warn('Crop prices fetch failed:', err.message);
  }
}

function updateMandiTable(commodity, unit) {
  const tbody = document.getElementById('mandiTableBody');
  if (!tbody) return;

  const info = COMMODITY_MANDI_DEFAULTS[commodity.toLowerCase()] || COMMODITY_MANDI_DEFAULTS.wheat;
  const mult = unit === 'kg' ? 0.01 : 1;
  const unitSuffix = unit === 'kg' ? '/ kg' : '/ qtl';

  tbody.innerHTML = info.mandis.map((m, idx) => `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-slate-300'}"></span>
        ${m.name}
      </td>
      <td class="py-3.5 px-4 text-slate-600">${m.loc}</td>
      <td class="py-3.5 px-4 text-right font-mono font-bold ${idx === 2 ? 'text-emerald-700' : 'text-slate-900'}">
        ₹${(m.modal * mult).toFixed(unit === 'kg' ? 2 : 0)} ${unitSuffix}
      </td>
      <td class="py-3.5 px-4 text-right font-mono text-slate-600">
        ₹${(m.min * mult).toFixed(unit === 'kg' ? 2 : 0)} – ₹${(m.max * mult).toFixed(unit === 'kg' ? 2 : 0)}
      </td>
      <td class="py-3.5 px-4 text-right font-mono text-slate-800 font-medium">${m.vol} MT</td>
      <td class="py-3.5 px-4 text-center">
        <span class="inline-block px-2 py-0.5 rounded-full font-mono font-semibold ${m.chg >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}">
          ${m.chg >= 0 ? '+' : ''}${m.chg}%
        </span>
      </td>
      <td class="py-3.5 px-4 text-right text-slate-500">${m.dist}</td>
      <td class="py-3.5 px-4 text-center">
        <span class="text-xs font-semibold ${m.margin.includes('+') ? 'inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold' : (m.margin.includes('-') ? 'text-rose-600' : 'text-slate-500')}">
          ${m.margin}
        </span>
      </td>
    </tr>
  `).join('');
}

async function loadBestSellingWindow(commodity = 'wheat') {
  try {
    const res = await fetch(`${MARKET_API}/api/v1/predictions/best-selling-window?commodity=${commodity}`);
    if (!res.ok) return;
    const data = await res.json();

    const windowEl = document.getElementById('best-selling-window');
    if (windowEl && data.window) {
      windowEl.textContent = data.window;
    }

    const confidenceEl = document.getElementById('prediction-confidence');
    if (confidenceEl && data.confidence) {
      confidenceEl.textContent = `${Math.round(data.confidence * 100)}% conf`;
    }
  } catch (err) {
    console.warn('Best selling window fetch failed:', err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const commoditySelect = document.getElementById('commodity-select');
  const unitToggle = document.getElementById('unit-toggle');

  let currentCommodity = commoditySelect ? commoditySelect.value : 'wheat';
  let currentUnit = unitToggle ? unitToggle.value : 'quintal';

  function refresh() {
    loadCropPrices(currentCommodity, currentUnit);
    loadBestSellingWindow(currentCommodity);
  }

  if (commoditySelect) {
    commoditySelect.addEventListener('change', () => {
      currentCommodity = commoditySelect.value;
      refresh();
    });
  }

  if (unitToggle) {
    unitToggle.addEventListener('change', () => {
      currentUnit = unitToggle.value;
      refresh();
    });
  }

  // Initial load
  refresh();
  setInterval(refresh, 300000);
});
