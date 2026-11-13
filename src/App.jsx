import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CollectionPage from "./pages/Collection";
import ProductDetails from "./pages/ProductDetails";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import "./IntroAnimation.css";

function IntroAnimation({ onComplete }) {
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => setOpening(true), 1400);
    const finish = setTimeout(onComplete, 2700);

    return () => {
      clearTimeout(start);
      clearTimeout(finish);
    };
  }, [onComplete]);

  return (
    <div className={`intro-screen ${opening ? "intro-opening" : ""}`}>
      <div className="intro-label intro-brand">
        <span className="brand-eyebrow">THE STYLE DESTINATION</span>
        <span className="brand-fresh">FRESH</span>
        <span className="brand-fashion">FASHION</span>
        <span className="brand-point">POINT<span className="brand-dot">.</span></span>
        <span className="brand-line"></span>
        <span className="brand-tagline">STYLE THAT DEFINES YOU</span>
      </div>

      <div className="intro-label intro-owner">
        <span className="owner-line"></span>
        <span className="owner-letters">O<br />W<br />N<br />E<br />R</span>
        <span className="owner-caption">THE VISIONARY</span>
      </div>

      <div className="intro-half intro-left">
        <img src="/Front.jpeg" alt="Fresh Fashion" />
      </div>
      <div className="intro-half intro-right">
        <img src="/Front.jpeg" alt="Fresh Fashion" />
      </div>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
