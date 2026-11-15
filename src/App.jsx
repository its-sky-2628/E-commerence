import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CollectionPage from "./pages/Collection";
import ProductDetails from "./pages/ProductDetails";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import OwnersPage from "./pages/Owners";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import "./IntroAnimation.css";

function IntroAnimation({ onComplete }) {
  const [stage, setStage] = useState("welcome");
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const ownersTimer = setTimeout(() => setStage("owners"), 2400);
    const openingTimer = setTimeout(() => setOpening(true), 5600);
    const finishTimer = setTimeout(onComplete, 7000);

    return () => {
      clearTimeout(ownersTimer);
      clearTimeout(openingTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className={`intro-screen ${stage === "owners" ? "show-owners" : "show-welcome"} ${opening ? "intro-opening" : ""}`}>
      <section className="welcome-stage">
        <div className="welcome-content">
          <img src="/CompanyLogo.png" alt="Fresh Fashion Studio Logo" />
          <span className="welcome-eyebrow">WELCOME TO</span>
          <h1>FRESH FASHION</h1>
          <span className="welcome-subtitle">STUDIO</span>
          <div className="welcome-line" />
          <p>STYLE THAT DEFINES YOU</p>
        </div>
      </section>

      <section className="owners-stage">
        <div className="owners-heading">
          <span>THE PEOPLE BEHIND THE STYLE</span>
          <h2>MEET OUR OWNERS</h2>
        </div>

        <div className="owners-panels">
          <div className="owner-panel owner-first">
            <img src="/Owner.png" alt="First owner" />
            <span className="owner-tag">OWNER</span>
          </div>

          <div className="owner-panel owner-second">
            <img src="/Front.jpeg" alt="Second owner" />
            <span className="owner-tag">CO-OWNER</span>
          </div>
        </div>

        <p className="owners-footer">A VISION FOR STYLE. A PASSION FOR FASHION.</p>
      </section>
    </div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      )}

      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/owners" element={<OwnersPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
