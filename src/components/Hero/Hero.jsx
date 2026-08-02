import "./Hero.css";

import {
  ArrowRight,
  Sparkles
} from "lucide-react";

import {
  Link
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import API from "../../config/api";


function Hero() {

  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);


  // ==========================================
  // GET HIGHLIGHTED PRODUCTS
  // ==========================================

  useEffect(() => {

    const loadSlides = async () => {

      try {

        const response = await fetch(
          API.products
        );

        const data = await response.json();

        if (data.success) {

          const highlightedProducts =
            data.products
              .filter(
                product =>
                  product.highlighted === true &&
                  product.images &&
                  product.images.length > 0
              )
              .sort(
                (a, b) =>
                  (a.sliderOrder || 999) -
                  (b.sliderOrder || 999)
              );

          setSlides(
            highlightedProducts
          );

        }

      } catch (error) {

        console.error(
          "Hero products error:",
          error
        );

      }

    };

    loadSlides();

  }, []);


  // ==========================================
  // AUTO SLIDE EVERY 3 SECONDS
  // ==========================================

  useEffect(() => {

    if (slides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {

      setCurrentSlide(
        previous =>
          (previous + 1) %
          slides.length
      );

    }, 3000);


    return () =>
      clearInterval(interval);

  }, [slides]);


  // ==========================================
  // CURRENT PRODUCT
  // ==========================================

  const currentProduct =
    slides[currentSlide];


  const currentImage =
    currentProduct?.images?.length > 0
      ? API.image(
          currentProduct.images[0]
        )
      : null;


  return (

    <section className="hero">

      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />


      {/* LEFT SIDE */}

      <div className="hero-content">

        <div className="hero-eyebrow">

          <Sparkles size={14} />

          New Season • Fresh Styles

        </div>


        <h1>

          Wear What

          <span>
            Feels Like You.
          </span>

        </h1>


        <p>
          Discover modern fashion
          designed for everyday
          confidence, effortless
          comfort and a style that
          stays uniquely yours.
        </p>


        <div className="hero-actions">

          <Link
            to="/collection"
            className="hero-primary"
          >

            Explore Collection

            <ArrowRight size={17} />

          </Link>


          <Link
            to="/about"
            className="hero-secondary"
          >
            Our Story
          </Link>

        </div>


        <div className="hero-trust">

          <div>
            <strong>Fresh</strong>
            <span>Collections</span>
          </div>

          <div>
            <strong>Modern</strong>
            <span>Designs</span>
          </div>

          <div>
            <strong>Everyday</strong>
            <span>Comfort</span>
          </div>

        </div>

      </div>


      {/* RIGHT SIDE HERO SLIDER */}

      <div className="hero-visual">

        <div className="hero-image-frame">

          {currentImage ? (

            <img
              key={currentImage}
              src={currentImage}
              alt={
                currentProduct?.name ||
                "Fresh Fashion"
              }
              className="hero-slide-image"
            />

          ) : (

            <div className="hero-image-placeholder">

              <span>
                Fresh Fashion
              </span>

              <strong>
                Studio
              </strong>

            </div>

          )}


          {currentProduct && (

            <div className="hero-floating-card">

              <span>
                Featured Collection
              </span>

              <strong>
                {currentProduct.name}
              </strong>

            </div>

          )}


          {/* DOTS */}

          {slides.length > 1 && (

            <div className="hero-slider-dots">

              {slides.map(
                (product, index) => (

                  <button
                    key={product._id}
                    type="button"
                    aria-label={
                      `Go to slide ${index + 1}`
                    }
                    className={
                      index === currentSlide
                        ? "hero-dot active"
                        : "hero-dot"
                    }
                    onClick={() =>
                      setCurrentSlide(index)
                    }
                  />

                )
              )}

            </div>

          )}

        </div>

      </div>

    </section>

  );
}

export default Hero;