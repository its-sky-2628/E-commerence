import "./Offers.css";

import {
  ArrowRight,
  Sparkles
} from "lucide-react";

import {
  Link
} from "react-router-dom";

function Offers() {
  return (
    <section className="offer-section">
      <div className="offer-inner">
        <div className="offer-content">
          <div className="offer-label">
            <Sparkles size={14} />
            Fresh Fashion Edit
          </div>

          <h2>
            Style That
            <span>
              Speaks For You.
            </span>
          </h2>

          <p>
            Explore our latest
            collection of modern,
            comfortable and effortlessly
            stylish fashion.
          </p>

          <Link
            to="/collection"
            className="offer-button"
          >
            Explore Collection
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="offer-art">
          <div className="offer-circle">
            <span>Fresh</span>

            <strong>
              Fashion
            </strong>

            <small>
              Studio • 2026
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Offers;