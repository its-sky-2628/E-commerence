import "./Footer.css";

import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
  ShoppingBag
} from "lucide-react";

import {
  Link
} from "react-router-dom";

function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer">
      <div className="footer-main">

        <div className="footer-brand">
          <div className="footer-brand-title">
            <ShoppingBag size={22} />

            <div>
              <strong>
                Fresh Fashion
              </strong>

              <span>Studio</span>
            </div>
          </div>

          <p>
            Modern fashion designed
            for confidence, comfort
            and everyday style.
          </p>
        </div>


        <div className="footer-column">
          <h4>Explore</h4>

          <Link to="/">
            Home
          </Link>

          <Link to="/collection">
            Collection
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/contact">
            Contact
          </Link>
        </div>


        <div className="footer-column">
          <h4>Collections</h4>

          <Link to="/collection?category=Women">
            Women
          </Link>

          <Link to="/collection?category=Men">
            Men
          </Link>

          <Link to="/collection?category=Kids">
            Kids
          </Link>
        </div>


        <div className="footer-column footer-contact">
          <h4>Contact</h4>

          {/* EMAIL */}
          <a href="mailto:admin.freshfashion.com">
            <Mail size={15} />

            <span>
              admin.freshfashion.com
            </span>
          </a>


          {/* PHONE 1 */}
          <a href="tel:+918400913189">
            <Phone size={15} />

            <span>
              +91 84009 13189
            </span>
          </a>


          {/* PHONE 2 */}
          <a href="tel:+917905555650">
            <Phone size={15} />

            <span>
              +91 79055 55650
            </span>
          </a>


          {/* LOCATION */}
          <a
  href="https://www.google.com/maps/search/?api=1&query=Fresh+Fashion+Studio+Kasia+Gorakhpur+Road+Kasia+Bazaar+Kushinagar+Uttar+Pradesh+274403"
  target="_blank"
  rel="noopener noreferrer"
>
  <MapPin size={15} />

  <span>
    Kasia - Gorakhpur Rd, Kasia Bazaar,
    Kushinagar, Uttar Pradesh 274403
  </span>
</a>
        </div>

      </div>


      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()}{" "}
          Fresh Fashion Studio. All
          rights reserved.
        </p>

        <button
          type="button"
          onClick={scrollTop}
          aria-label="Back to top"
        >
          <ArrowUp size={17} />
        </button>
      </div>
    </footer>
  );
}

export default Footer;