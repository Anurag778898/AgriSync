import { useState } from "react";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const menuGroups = [
    {
      title: "MAIN MENU",
      items: [
        { name: "Dashboard", icon: "bi-tv" },
        { name: "Marketplace", icon: "bi-shop" },
        { name: "My Listings", icon: "bi-list-ol" },
      ],
    },
    {
      items: [
        { name: "Settings", icon: "bi-gear" },
      ],
    },
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">

      {/* Mobile Header */}
      <header className="mobile-header d-lg-none">
        <div className="mobile-brand">AgriSync</div>

        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation"
          aria-expanded={sidebarOpen}
        >
          ☰
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">A</div>

          <div className="brand-info">
            <h2>AgriSync</h2>
            <span>Agriculture Platform</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-navigation">
          {menuGroups.map((group) => (
            <div className="menu-group" key={group.title}>
              <p className="menu-heading">{group.title}</p>

              {group.items.map((item) => (
                <button
                  key={item.name}
                  className={`menu-item ${
                    activePage === item.name ? "active" : ""
                  }`}
                  onClick={() => handleNavigation(item.name)}
                >
                  <i className={`bi ${item.icon} menu-icon`}></i>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="sidebar-profile">
          <div className="profile-avatar">PU</div>

          <div className="profile-info">
            <h4>Prasanna Unde</h4>
            <span>Administrator</span>
          </div>

          <button className="profile-options" aria-label="Profile options">
            ⋮
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1>{activePage}</h1>
        <p>Welcome to AgriSync.</p>
      </main>

    </div>
  );
}

export default App;