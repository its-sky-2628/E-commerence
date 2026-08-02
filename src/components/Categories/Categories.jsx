import "./Categories.css";

import {
  Link
} from "react-router-dom";

import {
  ArrowUpRight
} from "lucide-react";

const categories = [
  {
    title: "Women",
    subtitle: "Modern & elegant",
    query: "Women",
    number: "01"
  },
  {
    title: "Men",
    subtitle: "Clean everyday style",
    query: "Men",
    number: "02"
  },
  {
    title: "Kids",
    subtitle: "Comfort meets fun",
    query: "Kids",
    number: "03"
  }
];

function Categories() {
  return (
    <section className="categories-section">
      <div className="categories-heading">
        <div>
          <span>
            Shop By Category
          </span>

          <h2>
            Find Your Style.
          </h2>
        </div>

        <p>
          Explore curated collections
          made for every personality,
          moment and everyday lifestyle.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <Link
            key={category.title}
            to={`/collection?category=${category.query}`}
            className="category-card"
          >
            <span className="category-number">
              {category.number}
            </span>

            <div className="category-content">
              <span>
                {category.subtitle}
              </span>

              <h3>
                {category.title}
              </h3>
            </div>

            <div className="category-arrow">
              <ArrowUpRight size={20} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;