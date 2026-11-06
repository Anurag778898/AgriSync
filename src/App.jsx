import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { flushSync } from "react-dom";
import { setupMotion, slideNavIndicator, startPageTransition, startThemeTransition } from "./motion.js";
import i18n from "./i18n.js";

const translate = (language, text) => i18n.t(text, { lng: language });
function useT() {
  const { t } = useTranslation();
  return t;
}

const navigation = [
  {
    heading: "WORKSPACE",
    items: [
      { label: "Overview", icon: "bi-grid-1x2" },
      { label: "Market", icon: "bi-bar-chart-line" },
      { label: "My produce", icon: "bi-basket2" },
      { label: "Recommendations", icon: "bi-signpost-split" },
    ],
  },
  {
    heading: "MORE",
    items: [
      { label: "Weather", icon: "bi-cloud-sun" },
      { label: "Assistant", icon: "bi-chat-square-text" },
      { label: "Notifications", icon: "bi-bell", badge: "2" },
    ],
  },
];

const crops = [
  { name: "Onion", variety: "Red · Grade A", price: "₹2,180", change: "+4.2%", direction: "up", mandi: "Lasalgaon" },
  { name: "Tomato", variety: "Hybrid · Grade A", price: "₹1,640", change: "−2.1%", direction: "down", mandi: "Pimpalgaon" },
  { name: "Soybean", variety: "Yellow · FAQ", price: "₹4,720", change: "+1.4%", direction: "up", mandi: "Nashik" },
];

const produce = [
  { crop: "Red onion", detail: "Grade A · 18 quintals", price: "₹2,200 / qtl", status: "Active", color: "green" },
  { crop: "Tomato", detail: "Hybrid · 6 quintals", price: "₹1,700 / qtl", status: "Buyer interest · 2", color: "gold" },
];

function Icon({ name, className = "" }) {
  return <i aria-hidden="true" className={`bi ${name} ${className}`} />;
}

function CropSymbol({ name }) {
  let shape;
  if (name === "Onion") {
    shape = <><path d="M16 4.5c-1.2 2.8-4.3 4.4-6.6 7.1-2.1 2.4-2.7 6.2-1.2 9.2 1.4 3 4.5 4.8 7.8 4.8s6.4-1.8 7.8-4.8c1.5-3 .9-6.8-1.2-9.2C20.3 8.9 17.2 7.3 16 4.5Z" /><path d="M16 4.5V2m0 9c-2 1.8-4.1 2.8-6.5 3.5m6.5-3.5c2 1.8 4.1 2.8 6.5 3.5m-6.5-2v13m-3 1.5-1.5 2m4.5-2v2m3-2 1.5 2" /></>;
  } else if (name === "Tomato") {
    shape = <><path d="M16 9c-2.5-2.2-5.8-2-7.8-.2-2.8 2.4-3.8 6.7-2.2 10.4 1.5 3.7 5.1 6.2 10 6.2s8.5-2.5 10-6.2c1.6-3.7.6-8-2.2-10.4-2-1.8-5.3-2-7.8.2Z" /><path d="M16 9c-1.8-2-1.7-4.1-.8-5.7m.8 5.7c-.8-2.5-3.3-3.5-5.4-3.1 1 2 2.7 3 5.4 3.1Zm0 0c.8-2.5 3.3-3.5 5.4-3.1-1 2-2.7 3-5.4 3.1Zm0 0c1.8-2 1.7-4.1.8-5.7" /></>;
  } else {
    shape = <><path d="M5.5 23.5c-.8-6.8 3.3-13.9 10.2-15.9 4.1-1.2 8.7.2 10.4 3.4 2 3.7.1 8.7-4.5 12.1-4.2 3.1-10.6 4.3-16.1.4Z" /><ellipse cx="11.6" cy="17.3" rx="2.1" ry="3" transform="rotate(24 11.6 17.3)" /><ellipse cx="17" cy="14.6" rx="2.1" ry="3" transform="rotate(24 17 14.6)" /><ellipse cx="21.1" cy="18.7" rx="2.1" ry="3" transform="rotate(24 21.1 18.7)" /><path d="m5.5 23.5-2 1.3" /></>;
  }

  return <svg aria-hidden="true" className="crop-symbol" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{shape}</svg>;
}

function SectionHeading({ eyebrow, title, detail, action, farmBackdrop = false }) {
  const t = useT();
  return (
    <div className="section-heading">
      {farmBackdrop && <svg className="greeting-landscape" viewBox="0 0 620 220" fill="none" aria-hidden="true">
        <path className="landscape-sun-path" d="M310 136a112 112 0 0 1 224 0" />
        <circle className="landscape-sun-halo" cx="422" cy="54" r="39" />
        <circle className="landscape-sun" cx="422" cy="54" r="22" />
        <g className="landscape-cloud landscape-cloud-one"><path d="M326 54c4-12 20-16 30-8 5-16 29-18 37-2 15-2 23 16 11 25h-66c-12-2-17-9-12-15Z" /></g>
        <g className="landscape-cloud landscape-cloud-two"><path d="M493 91c4-9 16-11 23-4 5-12 22-14 29-2 12-1 18 12 9 19h-49c-10-1-15-7-12-13Z" /></g>
        <path className="landscape-ridge" d="M12 151c77-34 127-42 195-25 56 14 82 9 133-13 61-27 115-27 174-8 40 13 69 16 98 8" />
        <path className="landscape-ridge landscape-ridge-back" d="M153 159c70-21 120-18 179-1 52 15 95 18 151 2 43-12 77-13 121-2" />
        <path className="landscape-field" d="M8 175c120-31 225-35 319-14 93 21 188 24 282-2M16 190c120-27 223-29 312-10 98 21 188 22 277 0M53 205c105-21 192-22 272-7 91 18 175 18 257 2" />
        <path className="landscape-market-route" d="M33 178c91 4 174-4 247-23 68-18 126-35 211-43" />
        <g className="landscape-market-pin"><circle cx="496" cy="112" r="9" /><circle cx="496" cy="112" r="2.5" /></g>
        <g className="landscape-sprout landscape-sprout-one"><path d="M356 174v-26m0 15c-12-2-17-8-18-17 11 0 17 6 18 17Zm0-7c3-10 9-14 19-13-1 9-8 14-19 13Z" /></g>
        <g className="landscape-sprout landscape-sprout-two"><path d="M401 174v-35m0 19c-15-2-21-10-22-21 14 0 21 7 22 21Zm0-10c4-12 12-17 23-16-2 11-10 17-23 16Z" /></g>
        <g className="landscape-sprout landscape-sprout-three"><path d="M451 174v-27m0 15c-12-1-18-8-19-17 11 0 18 6 19 17Zm0-7c3-10 9-14 19-13-1 9-8 14-19 13Z" /></g>
      </svg>}
      <div>
        {eyebrow && <p className="eyebrow">{t(eyebrow)}</p>}
        <h1>{t(title)}</h1>
        {detail && <p className="heading-detail">{t(detail)}</p>}
      </div>
      {action}
    </div>
  );
}

function Overview({ onNavigate, illustrationRef }) {
  const t = useT();
  return (
    <>
      <SectionHeading
        eyebrow="WEDNESDAY · NASHIK, MAHARASHTRA"
        title="Good morning, Prasanna."
        farmBackdrop
      />

      <section className="market-note" aria-labelledby="market-note-title">
        <div className="market-note-copy">
          <p className="eyebrow light-eyebrow">{t("TODAY’S MARKET NOTE")} <span className="sample-label">{t("SAMPLE")}</span></p>
          <h2 id="market-note-title">{t("Onion prices are firmer across nearby mandis.")}</h2>
          <p>{t("Sample trend: Lasalgaon is up 4.2% from the previous market day. Compare nearby prices before deciding where to sell.")}</p>
          <button className="button button-light" onClick={() => onNavigate("Market")}>
            {t("Compare markets")} <Icon name="bi-arrow-up-right" />
          </button>
        </div>
        <div className="market-note-art" aria-hidden="true">
          <div className="sun-disc" />
          <div className="field-line field-line-one" />
          <div className="field-line field-line-two" />
          <div className="field-line field-line-three" />
          <div className="market-illustration" ref={illustrationRef} />
          <div className="note-crop-label"><Icon name="bi-graph-up-arrow" /> {t("Onion")} <strong data-countup>+4.2%</strong></div>
          <span className="note-index">01 / MARKET</span>
        </div>
      </section>

      <div className="overview-grid">
        <section className="surface watchlist" aria-labelledby="watchlist-title">
          <div className="surface-heading">
            <div><p className="eyebrow">{t("LOCAL PRICE WATCH")}</p><h2 id="watchlist-title">{t("Crops to keep an eye on")}</h2></div>
            <button className="text-button" onClick={() => onNavigate("Market")}>{t("All markets")} <Icon name="bi-arrow-right" /></button>
          </div>
          <div className="crop-list">
            {crops.map((crop, index) => (
              <div className="crop-row" key={crop.name}>
                <div className={`crop-mark crop-mark-${index + 1}`} aria-hidden="true"><CropSymbol name={crop.name} /></div>
                <div className="crop-name"><strong>{t(crop.name)}</strong><span>{t(crop.variety)}</span></div>
                <div className="crop-market"><span>{crop.mandi}</span><strong data-countup>{crop.price}</strong></div>
                <span className={`change-pill ${crop.direction}`} data-countup><Icon name={crop.direction === "up" ? "bi-arrow-up-right" : "bi-arrow-down-right"} />{crop.change}</span>
              </div>
            ))}
          </div>
          <p className="data-caption">{t("Illustrative sample values · No live market feed connected")}</p>
        </section>

        <section className="attention-panel" aria-labelledby="attention-title">
          <p className="eyebrow">{t("YOUR NEXT STEP")}</p>
          <div className="attention-icon"><Icon name="bi-inbox" /></div>
          <h2 id="attention-title">{t("Two buyers showed interest.")}</h2>
          <p>{t("There are sample enquiries on your tomato listing waiting for a response.")}</p>
          <button className="button button-outline" onClick={() => onNavigate("My produce")}>{t("Review enquiries")} <Icon name="bi-arrow-right" /></button>
          <span className="attention-foot">{t("Your produce · Sample activity")}</span>
        </section>
      </div>

      <div className="lower-grid">
        <button className="quick-link" onClick={() => onNavigate("Recommendations")}>
          <span className="quick-icon"><Icon name="bi-signpost-split" /></span>
          <span><strong>{t("Plan a better sale")}</strong><small>{t("Explore sample selling windows and buyer matches")}</small></span>
          <Icon name="bi-arrow-up-right" className="quick-arrow" />
        </button>
        <button className="quick-link" onClick={() => onNavigate("Weather")}>
          <span className="quick-icon weather-icon"><Icon name="bi-cloud-sun" /></span>
          <span><strong>{t("Check local conditions")}</strong><small>{t("Weather insights for your growing area")}</small></span>
          <Icon name="bi-arrow-up-right" className="quick-arrow" />
        </button>
      </div>
    </>
  );
}

function MarketPage() {
  const t = useT();
  const [query, setQuery] = useState("");
  const filteredCrops = crops.filter((crop) => `${t(crop.name)} ${crop.mandi}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <SectionHeading eyebrow="MARKET INTELLIGENCE" title="Know your market." detail="Nearby mandi prices, side by side."  />
      <section className="surface market-table-wrap">
        <div className="surface-heading market-tools">
          <div><p className="eyebrow">{t("NEARBY MANDIS")}</p><h2>{t("Price board")}</h2></div>
          <label className="search-box"><Icon name="bi-search" /><span className="visually-hidden">{t("Search crop or mandi")}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search crop or mandi")} /></label>
        </div>
        <div className="table-scroll"><table className="market-table"><thead><tr><th>{t("Crop & grade")}</th><th>{t("Market")}</th><th>{t("Modal price")}</th><th>{t("Day change")}</th><th>{t("Data type")}</th></tr></thead>
          <tbody>{filteredCrops.map((crop) => <tr key={crop.name}><td><strong>{t(crop.name)}</strong><span>{t(crop.variety)}</span></td><td>{crop.mandi}</td><td className="price-cell" data-countup>{crop.price}<small>{t("per quintal")}</small></td><td><span className={`change-pill ${crop.direction}`} data-countup><Icon name={crop.direction === "up" ? "bi-arrow-up-right" : "bi-arrow-down-right"} />{crop.change}</span></td><td><span className="sample-tag">{t("Sample")}</span></td></tr>)}</tbody>
        </table>{filteredCrops.length === 0 && <p className="empty-state">{t("No matching crops found. Try a crop or mandi name.")} {query && <strong>({query})</strong>}</p>}</div>
        <p className="data-caption table-caption">{t("Values are illustrative only. A live market data source is not connected to this prototype.")}</p>
      </section>
      <aside className="info-strip"><Icon name="bi-info-circle" /><p><strong>{t("Use prices as a guide, not a guarantee.")}</strong> {t("Actual prices vary by date, market, variety, grade, and quality.")}</p></aside>
    </>
  );
}

function ProducePage({ onNavigate }) {
  const t = useT();
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [items, setItems] = useState(produce);
  const [cropName, setCropName] = useState("");
  const addProduce = (event) => {
    event.preventDefault();
    if (!cropName.trim()) return;
    setItems([{ crop: cropName.trim(), price: t("Not set"), status: "Draft", color: "gold" }, ...items]);
    setCropName("");
    setShowForm(false);
    setNotice(t("Draft added to this sample workspace."));
  };
  return (
    <>
      <SectionHeading eyebrow="YOUR SUPPLY" title="My produce."action={<button className="button button-primary" onClick={() => { setShowForm(!showForm); setNotice(""); }}><Icon name="bi-plus-lg" /> {t("Add produce")}</button>} />
      {showForm && <form className="inline-form" onSubmit={addProduce}><label htmlFor="crop-name">{t("Crop name")}</label><input id="crop-name" value={cropName} onChange={(event) => setCropName(event.target.value)} placeholder={t("e.g. Green chilli")} required /><button className="button button-primary" type="submit">{t("Save draft")}</button><button className="text-button" type="button" onClick={() => setShowForm(false)}>{t("Cancel")}</button><span className="form-note">{t("This creates a local draft only. Nothing is sent to a server.")}</span></form>}
      {notice && <p className="inline-notice" role="status">{notice}</p>}
      <section className="surface produce-surface"><div className="surface-heading"><div><p className="eyebrow">{t("LISTINGS")}</p><h2>{t("Available produce")} <span className="count-badge">{items.length}</span></h2></div></div>
        <div className="produce-list">{items.map((item, index) => <article className="produce-row" key={`${item.crop}-${index}`}><div className="produce-emblem"><Icon name="bi-basket2" /></div><div className="produce-info"><strong>{t(item.crop)}</strong><span>{t(item.detail)}</span></div><div className="produce-price"><span>{t("Asking price")}</span><strong data-countup>{item.price}</strong></div><span className={`status-label ${item.color}`}><span />{t(item.status)}</span><button className="icon-button" aria-label={`${t("More options for {crop}").replace("{crop}", t(item.crop))}`} onClick={() => setNotice(t("Options for {crop} are a prototype placeholder.").replace("{crop}", t(item.crop)))}><Icon name="bi-three-dots-vertical" /></button></article>)}</div>
        <button className="text-button lower-action" onClick={() => onNavigate("Notifications")}>{t("See buyer activity")} <Icon name="bi-arrow-right" /></button>
      </section>
    </>
  );
}

function RecommendationsPage() {
  const t = useT();
  return <>
    <SectionHeading eyebrow="DECISION SUPPORT" title="Consider your next move." detail="Key points to weigh before choosing when to sell." />
    <div className="recommendation-layout"><section className="recommendation-feature"><p className="eyebrow light-eyebrow">{t("SAMPLE SELLING WINDOW")}</p><div className="rec-date"><span data-countup>07</span><span>{t("NOV")}</span></div><div><h2>{t("Onion · Lasalgaon")}</h2><p>{t("Illustrative suggestion based on a sample trend. No forecast model or live data is connected.")}</p></div><div className="rec-price"><span>{t("Sample market price")}</span><strong data-countup>₹2,180 <small>/ {t("per quintal")}</small></strong></div></section>
      <section className="surface why-panel"><p className="eyebrow">{t("WHY THIS SUGGESTION?")}</p><h2>{t("What to weigh before selling")}</h2><ul className="reason-list"><li><span className="reason-mark up"><Icon name="bi-arrow-up" /></span><span><strong>{t("Recent market movement")}</strong><small>{t("Sample prices have moved up over the last few market days.")}</small></span></li><li><span className="reason-mark neutral"><Icon name="bi-box-seam" /></span><span><strong>{t("Storage and quality")}</strong><small>{t("Factor in holding costs and how long your produce keeps.")}</small></span></li><li><span className="reason-mark neutral"><Icon name="bi-geo-alt" /></span><span><strong>{t("Compare nearby buyers")}</strong><small>{t("Transport and buyer requirements affect the final return.")}</small></span></li></ul></section></div>
    <div className="info-strip"><Icon name="bi-exclamation-circle" /><p><strong>{t("Illustration only.")}</strong> {t("This sample recommendation is not a price guarantee or a trained model prediction.")}</p></div>
  </>;
}

function WeatherPage() {
  const t = useT();
  return <>
    <SectionHeading eyebrow="WEATHER INTELLIGENCE" title="Plan around the conditions." detail="Local conditions for your crops and location."  />
    <section className="weather-panel"><div className="weather-location"><p className="eyebrow light-eyebrow">{t("SAMPLE LOCATION")}</p><h2>{t("Nashik district")}</h2><span>{t("Maharashtra · Location not verified")}</span></div><div className="weather-reading"><Icon name="bi-cloud-sun" /><strong>28°</strong><span>{t("Illustrative only")}</span></div><div className="weather-detail"><span className="weather-detail-label"><Icon name="bi-droplet" />{t("Rainfall")}</span><strong>{t("Not available")}</strong><span>{t("Forecast connection needed")}</span></div><div className="weather-detail"><span className="weather-detail-label"><Icon name="bi-journal-text" />{t("Field note")}</span><strong>{t("Check local conditions")}</strong><span>{t("Before planning harvest or transport")}</span></div></section>
    <div className="info-strip"><Icon name="bi-info-circle" /><p><strong>{t("No weather service is connected.")}</strong> {t("Do not use this placeholder to make planting, spraying, or harvest decisions.")}</p></div>
  </>;
}

function AssistantPage() {
  const t = useT();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const sendMessage = (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setMessages([...messages, question.trim()]);
    setQuestion("");
  };
  return <>
    <SectionHeading eyebrow="AGRI ASSISTANT" title="Ask about your next step." detail="Questions about markets and AgriSync, in one place."  />
    <section className="assistant-shell"><div className="assistant-intro"><div className="assistant-emblem"><Icon name="bi-chat-square-text" /></div><div><p className="eyebrow">{t("AGRI SYNC ASSISTANT")}</p><h2>{t("Good questions start with good data.")}</h2><p>{t("This chat is a visual prototype. It does not connect to an AI service or use live AgriSync data.")}</p></div></div>
      <div className="suggestion-row"><span>{t("Try asking")}</span><button onClick={() => setQuestion(t("How do I compare nearby mandi prices?"))}><Icon name="bi-bar-chart-line" />{t("How do I compare nearby mandi prices?")}</button><button onClick={() => setQuestion(t("What should I check before accepting an offer?"))}><Icon name="bi-check2-square" />{t("What should I check before accepting an offer?")}</button></div>
      {messages.map((message, index) => <div className="local-message" key={`${message}-${index}`}><span>{t("You")}</span><p>{message}</p><small>{t("Saved in this browser session only · No response service connected")}</small></div>)}
      <form className="chat-composer" onSubmit={sendMessage}><label className="visually-hidden" htmlFor="assistant-question">{t("Ask a question")}</label><input id="assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t("Ask a question about markets or your produce…")} /><button className="button button-primary" type="submit" aria-label={t("Add question locally")}><Icon name="bi-arrow-up" /></button></form><p className="composer-note">{t("Questions are displayed locally for this prototype. No advice is generated.")}</p>
    </section>
  </>;
}

function NotificationsPage() {
  const t = useT();
  const [read, setRead] = useState([]);
  const notifications = [{ id: "interest", icon: "bi-hand-thumbs-up", title: "Buyer interest on your tomato listing", detail: "2 sample buyer enquiries · Today", group: "PRODUCE" }, { id: "market", icon: "bi-graph-up-arrow", title: "Onion prices moved in nearby markets", detail: "Sample market update · Yesterday", group: "MARKET" }, { id: "weather", icon: "bi-cloud-sun", title: "Weather update for Nashik", detail: "Placeholder notification · 2 days ago", group: "WEATHER" }];
  return <><SectionHeading eyebrow="UPDATES" title="Your activity." detail="Buyer interest and market changes, gathered in one place." /><section className="surface notification-list">{notifications.map((item) => <article className={`notification-row ${read.includes(item.id) ? "is-read" : ""}`} key={item.id}><span className="notification-icon"><Icon name={item.icon} /></span><div className="notification-copy"><span className="eyebrow">{t(item.group)} · {t("SAMPLE")}</span><strong>{t(item.title)}</strong><small>{t(item.detail)}</small></div>{!read.includes(item.id) && <button className="text-button" onClick={() => setRead([...read, item.id])}>{t("Mark read")}</button>}</article>)}</section></>;
}

function SettingsPage({ language, onLanguageChange }) {
  const t = useT();
  return <>
    <SectionHeading eyebrow="PREFERENCES" title="Make AgriSync yours." detail="Language, location, and profile preferences."  />
    <section className="surface settings-list">
      <div className="setting-row">
        <div className="setting-label"><span className="setting-symbol"><Icon name="bi-geo-alt" /></span><span className="setting-copy"><strong>{t("Workspace location")}</strong><small>{t("Used for nearby market and weather context")}</small></span></div>
        <span>{t("Nashik, Maharashtra")} <small>{t("Sample profile")}</small></span>
      </div>
      <div className="setting-row">
        <div className="setting-label"><span className="setting-symbol"><Icon name="bi-translate" /></span><span className="setting-copy"><strong>{t("Language")}</strong><small>{t("Choose how information is presented")}</small></span></div>
        <select value={language} onChange={(event) => onLanguageChange(event.target.value)} aria-label={t("Language")}><option value="en" lang="en">{t("English")}</option><option value="hi" lang="hi">{t("Hindi")}</option><option value="mr" lang="mr">{t("Marathi")}</option></select>
      </div>
      <div className="setting-row">
        <div className="setting-label"><span className="setting-symbol"><Icon name="bi-person-vcard" /></span><span className="setting-copy"><strong>{t("Profile")}</strong><small>{t("Personal and farm details")}</small></span></div>
        <span>{t("Sample farmer profile")} <small>{t("Account features not connected")}</small></span>
      </div>
    </section>
    <p className="settings-note">{t("Preference changes are local to this prototype and are not saved to an account.")}</p>
  </>;
}

const pageComponents = {
  Overview,
  Market: MarketPage,
  "My produce": ProducePage,
  Recommendations: RecommendationsPage,
  Weather: WeatherPage,
  Assistant: AssistantPage,
  Notifications: NotificationsPage,
  Settings: SettingsPage,
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(() => document.documentElement.dataset.sidebar === "open");
  const [activePage, setActivePage] = useState("Overview");
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem("agrisync-theme") === "dark");
  const [language, setLanguage] = useState(() => {
    const savedLanguage = window.localStorage.getItem("agrisync-language");
    return ["en", "hi", "mr"].includes(savedLanguage) ? savedLanguage : "en";
  });
  const sidebarRef = useRef(null);
  const sidebarToggleRef = useRef(null);
  const overviewIllustrationRef = useRef(null);
  const overviewFieldRef = useRef(null);
  const overviewAmbientRef = useRef(null);
  const previousSidebarOpen = useRef(sidebarOpen);
  const Page = pageComponents[activePage];

  useEffect(() => {
    document.documentElement.dataset.sidebar = sidebarOpen ? "open" : "closed";
    if (window.matchMedia("(min-width: 900px)").matches) {
      window.localStorage.setItem("agrisync-sidebar", sidebarOpen ? "open" : "closed");
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    const onBreakpointChange = () => {
      if (desktop.matches) {
        setSidebarOpen(window.localStorage.getItem("agrisync-sidebar") !== "closed");
      } else {
        setSidebarOpen(false);
      }
    };
    desktop.addEventListener("change", onBreakpointChange);
    return () => desktop.removeEventListener("change", onBreakpointChange);
  }, []);

  useEffect(() => {
    const wasOpen = previousSidebarOpen.current;
    const isMobile = window.matchMedia("(max-width: 899px)").matches;
    if (isMobile && sidebarOpen && !wasOpen) {
      const firstVisible = [...(sidebarRef.current?.querySelectorAll("button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled)") || [])].find((item) => item.getClientRects().length);
      firstVisible?.focus();
    } else if (isMobile && !sidebarOpen && wasOpen) {
      sidebarToggleRef.current?.focus();
    }
    previousSidebarOpen.current = sidebarOpen;
  }, [sidebarOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const isTyping = target instanceof Element && target.closest("input, textarea, [contenteditable]:not([contenteditable='false'])");
      if (event.key === "[" && !isTyping) {
        event.preventDefault();
        setSidebarOpen((open) => !open);
        return;
      }
      if (!sidebarOpen || window.matchMedia("(min-width: 900px)").matches) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setSidebarOpen(false);
        return;
      }
      if (event.key !== "Tab" || !sidebarRef.current) return;
      const focusable = [...sidebarRef.current.querySelectorAll("a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])")].filter((item) => item.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        sidebarRef.current.focus();
      } else if (event.shiftKey && (document.activeElement === first || !sidebarRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("agrisync-theme", theme);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("agrisync-language", language);
    i18n.changeLanguage(language);
    document.title = `${translate(language, "AgriSync overview")} — ${translate(language, "Market, in sync.")}`;
  }, [language]);

  const navigate = (page) => {
    const closeDrawer = window.matchMedia("(max-width: 899px)").matches;
    if (page === activePage) {
      if (closeDrawer) setSidebarOpen(false);
      return;
    }
    const previousRect = document.querySelector(".menu-item.active[data-page]")?.getBoundingClientRect();
    startPageTransition(() => {
      flushSync(() => {
        setActivePage(page);
        if (closeDrawer) setSidebarOpen(false);
      });
      slideNavIndicator(page, previousRect);
    });
  };

  const toggleTheme = (button) => startThemeTransition(button, () => flushSync(() => setDarkMode((enabled) => !enabled)));

  useEffect(() => setupMotion(document.querySelector(".page-content")), [activePage]);

  useEffect(() => {
    if (activePage !== "Overview") return undefined;
    let cancelled = false;
    let unmountIllustration;
    import("./overview-illustration.js").then(({ mountOverviewIllustration }) => {
      if (cancelled || !overviewIllustrationRef.current) return;
      unmountIllustration = mountOverviewIllustration(overviewIllustrationRef.current);
    }).catch(() => {});
    return () => {
      cancelled = true;
      unmountIllustration?.();
    };
  }, [activePage]);

  useEffect(() => {
    if (activePage !== "Overview") return undefined;
    let cancelled = false;
    let unmountAmbient;
    import("./overview-ambient.js").then(({ mountOverviewAmbient }) => {
      if (cancelled || !overviewAmbientRef.current) return;
      unmountAmbient = mountOverviewAmbient(overviewAmbientRef.current);
    }).catch(() => {});
    return () => {
      cancelled = true;
      unmountAmbient?.();
    };
  }, [activePage]);

  useEffect(() => {
    if (activePage !== "Overview") return undefined;
    let cancelled = false;
    let unmountField;
    import("./floating-produce-field.js").then(({ mountFloatingProduceField }) => {
      if (cancelled || !overviewFieldRef.current) return;
      unmountField = mountFloatingProduceField(overviewFieldRef.current);
    }).catch(() => {});
    return () => {
      cancelled = true;
      unmountField?.();
    };
  }, [activePage]);

  return (
    <div className={`app-container ${darkMode ? "theme-dark" : ""}`} lang={language}>
      <header className="mobile-header">
        <button className="mobile-brand" onClick={() => navigate("Overview")} aria-label={translate(language, "Go to overview")}><img src="/public/favicon.svg" alt="AgriSync" className="brand-mark"/> AgriSync</button>
        <button className="menu-toggle" onClick={() => setSidebarOpen((open) => !open)} aria-label={translate(language, sidebarOpen ? "Close navigation" : "Open navigation")} aria-expanded={sidebarOpen} aria-controls="app-sidebar"><Icon name={sidebarOpen ? "bi-x-lg" : "bi-list"} /></button>
      </header>

      <aside className="sidebar" id="app-sidebar" ref={sidebarRef} inert={!sidebarOpen} tabIndex="-1">
        <button className="sidebar-brand" onClick={() => navigate("Overview")} aria-label={translate(language, "AgriSync overview")}>
          <img src="/public/favicon.svg" alt="AgriSync" className="brand-mark"/><span className="brand-info"><strong>AgriSync</strong><small>{translate(language, "Market, in sync.")}</small></span>
        </button>
        <div className="workspace-switch"><span className="workspace-avatar">P</span><span><strong>Prasanna Unde</strong><small>{translate(language, "Farmer workspace")}</small></span><Icon name="bi-chevron-expand" /></div>
        <nav id="app-navigation" className="sidebar-navigation" aria-label={translate(language, "Main navigation")}>
          {navigation.map((group) => <div className="menu-group" key={group.heading}><p className="menu-heading">{translate(language, group.heading)}</p>{group.items.map((item) => <button key={item.label} data-page={item.label} className={`menu-item ${activePage === item.label ? "active" : ""}`} onClick={() => navigate(item.label)} aria-current={activePage === item.label ? "page" : undefined}><Icon name={item.icon} className="menu-icon" /><span>{translate(language, item.label)}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}</button>)}</div>)}
        </nav>
        <div className="sidebar-bottom">
          
          <div className="theme-switch-row">
            <span className="theme-switch-label"><Icon name={darkMode ? "bi-moon-stars" : "bi-sun"} /><span><strong>{translate(language, "Night colors")}</strong></span></span>
            <button className={`theme-toggle ${darkMode ? "is-on" : ""}`} type="button" role="switch" aria-checked={darkMode} aria-label={translate(language, "Toggle night colors")} onClick={(event) => toggleTheme(event.currentTarget)}><span /></button>
          </div>
          <button className={`menu-item ${activePage === "Settings" ? "active" : ""}`} data-page="Settings" onClick={() => navigate("Settings")} aria-current={activePage === "Settings" ? "page" : undefined}><Icon name="bi-sliders2" className="menu-icon" /><span>{translate(language, "Settings")}</span></button>
          {/* <div className="sidebar-footer"></div> */}
        </div>
      </aside>

      <main className="main-content"><div className="page-topline"><div className="page-topline-start"><span><Icon name="bi-geo-alt" /> {translate(language, "Nashik region")}</span></div><span className="preview-status"><span /> {translate(language, "Preview mode · Data is illustrative")}</span></div>{activePage === "Overview" && <><div className="overview-ambient" ref={overviewAmbientRef} aria-hidden="true" /><div className="overview-produce-field" ref={overviewFieldRef} aria-hidden="true" /></>}<div className="page-content"><Page onNavigate={navigate} language={language} onLanguageChange={setLanguage} illustrationRef={overviewIllustrationRef} /></div><footer className="app-footer"><span>AgriSync</span></footer></main>
    </div>
  );
}

export default App;
