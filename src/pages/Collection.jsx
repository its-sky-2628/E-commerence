import "./Collection.css";

import {
  Search,
  SlidersHorizontal
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

import Navbar from
  "../components/Navbar/Navbar";

import Footer from
  "../components/Footer/Footer";

import ProductCard from
  "../components/ProductCard/ProductCard";

import API from "../config/api";

function CollectionPage() {
  const [searchParams] =
    useSearchParams();

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [sort, setSort] =
    useState("latest");

  const [category, setCategory] =
    useState(
      searchParams.get("category") || "All"
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const queryCategory =
      searchParams.get("category");

    if (queryCategory) {
      setCategory(queryCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(API.products);

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load products"
          );
        }

        setProducts(
          Array.isArray(data.products)
            ? data.products
            : []
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load collection"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const values = products
      .map(product => product.category)
      .filter(Boolean);

    return [
      "All",
      ...new Set(values)
    ];
  }, [products]);

  const filteredProducts =
    useMemo(() => {
      let result = [...products];

      if (category !== "All") {
        result = result.filter(
          product =>
            product.category
              ?.toLowerCase() ===
            category.toLowerCase()
        );
      }

      const query =
        search.trim().toLowerCase();

      if (query) {
        result = result.filter(
          product =>
            product.name
              ?.toLowerCase()
              .includes(query) ||
            product.description
              ?.toLowerCase()
              .includes(query) ||
            product.category
              ?.toLowerCase()
              .includes(query)
        );
      }

      if (sort === "low") {
        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
      }

      if (sort === "high") {
        result.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );
      }

      if (sort === "latest") {
        result.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
      }

      return result;
    }, [
      products,
      search,
      sort,
      category
    ]);

  return (
    <>
      <Navbar />

      <main className="catalogue-page">
        <header className="catalogue-header">
          <span>Fresh Fashion Studio</span>

          <h1>Our Collection</h1>

          <p>
            Explore carefully selected
            pieces designed for effortless
            everyday style.
          </p>
        </header>

        {categories.length > 1 && (
          <div className="catalogue-categories">
            {categories.map(item => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <section className="catalogue-tools">
          <div className="catalogue-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={event =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="catalogue-sort">
            <SlidersHorizontal size={17} />

            <select
              value={sort}
              onChange={event =>
                setSort(
                  event.target.value
                )
              }
            >
              <option value="latest">
                Latest
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>
            </select>
          </div>
        </section>

        <div className="catalogue-count">
          {filteredProducts.length}{" "}
          product
          {filteredProducts.length === 1
            ? ""
            : "s"}
        </div>

        {loading && (
          <div className="catalogue-message">
            Loading collection...
          </div>
        )}

        {!loading && error && (
          <div className="catalogue-message">
            <h2>
              Unable to load collection
            </h2>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="catalogue-message">
              <h2>No Products Found</h2>

              <p>
                Try another search or
                collection.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <section className="catalogue-grid">
              {filteredProducts.map(
                product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                )
              )}
            </section>
          )}
      </main>

      <Footer />
    </>
  );
}

export default CollectionPage;