import "./Owners.css";

const owners = [
  {
    name: "Israr Ansari",
    role: "CO-FOUNDER",
    image: "/Owner.jpeg",
    number: "01",
  },
  {
    name: "Irfan Ansari",
    role: "CO-FOUNDER",
    image: "/Front.jpeg",
    number: "02",
  },
];

function OwnersPage() {
  return (
    <main className="owners-page">
      <section className="owners-hero">
        <span className="owners-kicker">THE MINDS BEHIND THE BRAND</span>
        <h1>Meet The <em>Founders</em></h1>
        <p>
          Two people. One vision. A shared passion for making fashion
          feel personal, confident and accessible.
        </p>
        <div className="owners-gold-line" />
      </section>

      <section className="founders-section">
        <div className="founders-grid">
          {owners.map((owner) => (
            <article className="founder-card" key={owner.number}>
              <div className="founder-image-wrap">
                <img src={owner.image} alt={owner.name} />
                <span className="founder-number">{owner.number}</span>
              </div>
              <div className="founder-info">
                <span>{owner.role}</span>
                <h2>{owner.name}</h2>
                <div className="founder-underline" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="owners-story">
        <span className="owners-kicker">OUR WHY</span>
        <h2>It Started With A <em>Dream.</em></h2>
        <p>
          We started Fresh Fashion Studio with a simple belief:
          everyone deserves to look good, feel confident and express
          their own style.
        </p>
        <p>
          Fashion is more than what you wear. It is how you express
          yourself. Our aim is to bring style, quality and a welcoming
          shopping experience together under one roof.
        </p>
        <blockquote>
          “Our journey is driven by passion, built on trust, and inspired
          by every person who becomes a part of Fresh Fashion Studio.”
        </blockquote>
        <div className="owners-signoff">WITH STYLE & GRATITUDE</div>
        <h3>Israr Ansari <span>&</span> Irfan Ansari</h3>
        <span className="owners-brand-name">FRESH FASHION STUDIO</span>
      </section>
    </main>
  );
}

export default OwnersPage;
