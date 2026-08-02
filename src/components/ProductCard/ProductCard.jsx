import "./ProductCard.css";

import {
  ArrowUpRight
} from "lucide-react";

import {
  useNavigate
} from "react-router-dom";

import API from "../../config/api";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const price =
    Number(product?.price || 0);

  const discount =
    Number(product?.discount || 0);

  const finalPrice =
    discount > 0
      ? price -
        (price * discount) / 100
      : price;

  const image = product?.localImage
  ? product.localImage
  : product?.images?.length > 0
    ? API.image(product.images[0])
    : null;

  const openProduct = () => {
    if (!product?._id) return;

    navigate(
      `/product/${product._id}`
    );
  };

  return (
    <article
      className="product-card"
      onClick={openProduct}
    >
      <div className="product-card-image">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="product-card-placeholder">
            Fresh Fashion
          </div>
        )}

        {discount > 0 && (
          <span className="product-card-discount">
            -{discount}%
          </span>
        )}

        <button
          className="product-card-open"
          type="button"
          aria-label={`View ${
            product?.name || "product"
          }`}
          onClick={event => {
            event.stopPropagation();
            openProduct();
          }}
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="product-card-content">
        <span className="product-card-category">
          {product?.category ||
            "Fresh Fashion"}
        </span>

        <h3>
          {product?.name ||
            "Untitled Product"}
        </h3>

        <div className="product-card-price">
          <strong>
            ₹
            {Math.round(
              finalPrice
            ).toLocaleString("en-IN")}
          </strong>

          {discount > 0 && (
            <del>
              ₹
              {price.toLocaleString(
                "en-IN"
              )}
            </del>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;