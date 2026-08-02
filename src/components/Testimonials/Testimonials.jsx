import "./Testimonials.css";

import {
  Quote,
  Star
} from "lucide-react";

const reviews = [
  {
    name: "Aarav",
    role: "Fresh Fashion Customer",
    text:
      "The collection feels modern, clean and easy to wear. I really liked the overall quality and styling."
  },
  {
    name: "Riya",
    role: "Fresh Fashion Customer",
    text:
      "Simple designs with a premium feel. The styles are exactly what I look for in everyday fashion."
  },
  {
    name: "Kabir",
    role: "Fresh Fashion Customer",
    text:
      "I loved how easy it was to explore the collection. The products look fresh and thoughtfully curated."
  }
];

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-heading">
        <span>
          Customer Stories
        </span>

        <h2>
          Loved By People
          Who Love Style.
        </h2>
      </div>

      <div className="testimonials-grid">
        {reviews.map(review => (
          <article
            className="testimonial-card"
            key={review.name}
          >
            <Quote
              className="testimonial-quote"
              size={30}
            />

            <div className="testimonial-stars">
              {Array.from({
                length: 5
              }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  fill="currentColor"
                />
              ))}
            </div>

            <p>
              “{review.text}”
            </p>

            <div className="testimonial-person">
              <div className="testimonial-avatar">
                {review.name.charAt(0)}
              </div>

              <div>
                <strong>
                  {review.name}
                </strong>

                <span>
                  {review.role}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;