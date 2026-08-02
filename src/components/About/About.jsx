import "./About.css";
import {
  ArrowUpRight,
  Gem,
  Heart,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo1.png";

function About() {
  return (
    <section
      className="about-section"
      id="about"
    >
      <div className="about-layout">

        {/* LEFT LOGO AREA */}
        <div className="about-visual">
          <div className="about-visual-main">

            <div className="about-logo-wrapper">
              <img
                src={logo}
                alt="Fresh Fashion Studio"
                className="about-logo"
              />
            </div>

          </div>

          <div className="about-small-card">
            <Sparkles size={20} />

            <div>
              <strong>Modern Style</strong>
              <span>
                Made for everyday confidence
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">
          <span className="about-label">
            OUR STORY
          </span>

          <h2>
            Fashion should feel
            <span> personal.</span>
          </h2>

          <p>
            Fresh Fashion Studio brings together
            modern silhouettes, effortless style
            and carefully selected pieces designed
            for real everyday moments.
          </p>

          <p>
            From statement looks to simple
            essentials, our goal is to make
            discovering your next favourite outfit
            easy, inspiring and enjoyable.
          </p>

          <div className="about-values">
            <div>
              <Gem size={19} />

              <span>
                <strong>Quality First</strong>
                Carefully selected pieces
              </span>
            </div>

            <div>
              <Heart size={19} />

              <span>
                <strong>Made With Care</strong>
                Style centred around you
              </span>
            </div>
          </div>

          <Link
            to="/about"
            className="about-link"
          >
            Discover our story
            <ArrowUpRight size={17} />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default About;