import "./Navbar.css";

import {
  useEffect,
  useState
} from "react";

import {
  Menu,
  X,
  ShoppingBag,
  LogIn
} from "lucide-react";

import {
  Link,
  useLocation
} from "react-router-dom";

import logo from "../../assets/LOGO2-modified.png";

function Navbar() {
  const [menu, setMenu] =
    useState(false);

  const [scroll, setScroll] =
    useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScroll(
        window.scrollY > 40
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    setMenu(false);
  }, [
    location.pathname,
    location.search
  ]);

  const active = path =>
    location.pathname === path;

  return (
    <nav
      className={
        scroll
          ? "navbar active"
          : "navbar"
      }
    >
      <Link
        to="/"
        className="logo"
      >
        <img
          src={logo}
          alt="Fresh Fashion Logo"
        />

        <div>
          <h2>
            Fresh Fashion
          </h2>

          <span>Studio</span>
        </div>
      </Link>

      <ul
        className={
          menu
            ? "nav-links show"
            : "nav-links"
        }
      >
        <li>
          <Link
            className={
              active("/")
                ? "current"
                : ""
            }
            to="/"
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            className={
              active("/about")
                ? "current"
                : ""
            }
            to="/about"
          >
            About
          </Link>
        </li>

        <li>
          <Link
            className={
              active("/collection")
                ? "current"
                : ""
            }
            to="/collection"
          >
            Collection
          </Link>
        </li>

        <li>
          <Link
            to="/collection?category=Men"
          >
            Men
          </Link>
        </li>

        <li>
          <Link
            to="/collection?category=Kids"
          >
            Kids
          </Link>
        </li>

        <li>
          <Link
            className={
              active("/contact")
                ? "current"
                : ""
            }
            to="/contact"
          >
            Contact
          </Link>
        </li>
      </ul>

      <div className="nav-btn">
        <a
          className="login-btn"
          href="/login"
        >
          <LogIn size={17} />
          Admin
        </a>

        <Link
          className="store-btn"
          to="/collection"
        >
          <ShoppingBag size={17} />
          Shop
        </Link>
      </div>

      <button
        type="button"
        className="menu"
        aria-label="Toggle menu"
        onClick={() =>
          setMenu(prev => !prev)
        }
      >
        {menu ? <X /> : <Menu />}
      </button>
    </nav>
  );
}

export default Navbar;