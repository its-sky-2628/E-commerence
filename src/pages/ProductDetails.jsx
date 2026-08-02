import "./ProductDetails.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Sparkles,
  Truck
} from "lucide-react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import API from "../config/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          API.productById(id)
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Product not found"
          );
        }

        setProduct(data.product);
        setActiveImage(0);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const pricing = useMemo(() => {
    const price = Number(product?.price || 0);
    const discount =
      Number(product?.discount || 0);

    const finalPrice =
      discount > 0
        ? price - (price * discount) / 100
        : price;

    return {
      price,
      discount,
      finalPrice
    };
  }, [product]);

  const images = product?.images || [];

  return (
    <>
      <Navbar />

      <main className="details-page">
        <button
          type="button"
          className="details-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back to collection
        </button>

        {loading && (
          <div className="details-state">
            Loading product...
          </div>
        )}

        {!loading && error && (
          <div className="details-state">
            <h2>Product unavailable</h2>
            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                navigate("/collection")
              }
            >
              View Collection
            </button>
          </div>
        )}

        {!loading && !error && product && (
          <section className="details-layout">
            <div className="details-gallery">
              <div className="details-main-image">
                {images.length > 0 ? (
                  <img
                    src={API.image(
                      images[activeImage]
                    )}
                    alt={product.name}
                  />
                ) : (
                  <div className="details-placeholder">
                    No Image Available
                  </div>
                )}

                {pricing.discount > 0 && (
                  <span className="details-discount">
                    {pricing.discount}% OFF
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="details-thumbnails">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={
                        activeImage === index
                          ? "details-thumb active"
                          : "details-thumb"
                      }
                      onClick={() =>
                        setActiveImage(index)
                      }
                    >
                      <img
                        src={API.image(image)}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="details-content">
              <span className="details-category">
                {product.category || "Fashion"}
              </span>

              <h1>{product.name}</h1>

              <div className="details-price">
                <strong>
                  ₹
                  {Math.round(
                    pricing.finalPrice
                  ).toLocaleString("en-IN")}
                </strong>

                {pricing.discount > 0 && (
                  <>
                    <del>
                      ₹
                      {pricing.price.toLocaleString(
                        "en-IN"
                      )}
                    </del>

                    <span>
                      Save {pricing.discount}%
                    </span>
                  </>
                )}
              </div>

              <div className="details-line" />

              <p className="details-description">
                {product.description}
              </p>

              <div className="details-benefits">
                <div>
                  <Check size={17} />
                  <span>
                    Carefully selected quality
                  </span>
                </div>

                <div>
                  <Sparkles size={17} />
                  <span>
                    Fresh Fashion Studio collection
                  </span>
                </div>

                <div>
                  <Truck size={17} />
                  <span>
                    Delivery availability may vary
                  </span>
                </div>

                <div>
                  <ShieldCheck size={17} />
                  <span>
                    Quality-first selection
                  </span>
                </div>
              </div>

              <button
                className="details-collection-btn"
                type="button"
                onClick={() =>
                  navigate("/collection")
                }
              >
                Explore More Products
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default ProductDetails;