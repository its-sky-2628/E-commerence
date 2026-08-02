import "./About.css";

import Navbar from
  "../components/Navbar/Navbar";

import Footer from
  "../components/Footer/Footer";

import {
  Heart,
  ShieldCheck,
  Shirt,
  Sparkles
} from "lucide-react";

function AboutPage() {
  const values = [
    {
      icon: Shirt,
      title: "Modern Style",
      text:
        "Contemporary collections designed for effortless everyday wear."
    },
    {
      icon: Heart,
      title: "Made With Care",
      text:
        "Every collection focuses on comfort, simplicity and confidence."
    },
    {
      icon: ShieldCheck,
      title: "Quality First",
      text:
        "We believe great fashion begins with thoughtful quality."
    }
  ];

  return (
    <>
      <Navbar />

      <main className="about-page">
        <section className="about-hero">
          <div className="about-label">
            <Sparkles size={14} />
            Our Story
          </div>

          <h1>
            Fashion Made For
            <br />
            Real Life.
          </h1>

          <p>
            Fresh Fashion Studio brings
            together modern style,
            everyday comfort and
            thoughtfully curated
            collections for people who
            want to look good without
            making fashion complicated.
          </p>
        </section>

        <section className="about-story">
          <div className="about-story-number">
            01
          </div>

          <div>
            <span>WHO WE ARE</span>

            <h2>
              Fashion should feel
              personal.
            </h2>
          </div>

          <div className="about-story-copy">
            <p>
              Fresh Fashion Studio brings
              together modern silhouettes,
              effortless style and
              carefully selected pieces
              designed for real everyday
              moments.
            </p>

            <p>
              From statement looks to
              simple essentials, our goal
              is to make discovering your
              next favourite outfit easy,
              inspiring and enjoyable.
            </p>
          </div>
        </section>

        <section className="about-values">
          {values.map(item => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="about-value-card"
              >
                <div className="about-value-icon">
                  <Icon size={21} />
                </div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </article>
            );
          })}
        </section>

        <section className="about-quote">
          <span>FRESH FASHION STUDIO</span>

          <h2>
            Style centred
            around you.
          </h2>

          <p>
            Simple. Modern. Thoughtful.
            Fashion for the moments that
            make up everyday life.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AboutPage;