import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StockList from "./components/StockList";
import Chat from "./components/Chat";
import GraphPlaceholder from "./components/GraphPlaceholder";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <h2>Stocks</h2>
          {/* StockList component renders list of stocks */}
          <StockList />
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Links or menu to navigate routes in the center area */}
          <nav className="nav-links">
            <Link to="/">Chat</Link>
            <Link to="/route2">Another Route</Link>
          </nav>

          {/* Routes for center column */}
          <div className="route-container">
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/route2" element={<div>Route 2 Content</div>} />
            </Routes>
          </div>
        </main>

        {/* Right Panel */}
        <section className="right-panel">
          <h2>Graph Visualization</h2>
          <GraphPlaceholder />
        </section>
      </div>
    </Router>
  );
};

export default App;
