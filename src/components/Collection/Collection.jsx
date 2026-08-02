import "./Collection.css";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../ProductCard/ProductCard";
import API from "../../config/api";

// Default images
import product1 from "../../assets/41RTqea0uAL.webp";
import product2 from "../../assets/61BK+sUTcHL.webp";
import product3 from "../../assets/121.webp";
import product4 from "../../assets/SS26_UF_Tshirts.webp";

// ==========================================
// DEFAULT PRODUCTS
// ==========================================
const defaultProducts = [
  {
    _id: "default-1",
    name: "Classic Everyday T-Shirt",
    category: "Men",
    price: 999,
    discount: 20,
    description: "Comfortable everyday casual T-shirt.",
    image: product1,
    localImage: product1,
    isDefault: true,
  },

  {
    _id: "default-2",
    name: "Premium Casual Wear",
    category: "Men",
    price: 1299,
    discount: 15,
    description: "Modern casual wear for everyday styling.",
    image: product2,
    localImage: product2,
    isDefault: true,
  },

  {
    _id: "default-3",
    name: "Everyday Essential",
    category: "Women",
    price: 1499,
    discount: 10,
    description: "Simple and stylish everyday fashion.",
    image: product3,
    localImage: product3,
    isDefault: true,
  },

  {
    _id: "default-4",
    name: "Fresh Studio T-Shirt",
    category: "Men",
    price: 1199,
    discount: 25,
    description: "Fresh modern T-shirt for everyday comfort.",
    image: product4,
    localImage: product4,
    isDefault: true,
  },
];

function Collection() {
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(API.products);
        const data = await response.json();

        if (
          response.ok &&
          Array.isArray(data.products)
        ) {
          // Admin ke products + default products
          const allProducts = [
            ...data.products,
            ...defaultProducts,
          ];

          // Homepage Latest Collection me max 8
          setProducts(allProducts.slice(0, 8));
        } else {
          setProducts(defaultProducts);
        }
      } catch (error) {
        console.error(
          "Collection fetch error:",
          error
        );

        // Backend unavailable ho tab bhi
        // default products show honge
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section
      className="home-collection"
      id="collection"
    >
      <div className="home-collection-header">
        <div>
          <span>CURATED FOR YOU</span>
          <h2>Latest Collection</h2>
        </div>

        <Link
          to="/collection"
          className="collection-view-all"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="collection-status">
          Loading collection...
        </div>
      ) : (
        <>
          <div className="home-collection-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>

          <div className="collection-mobile-action">
            <Link to="/collection">
              Explore Full Collection
              <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default Collection;