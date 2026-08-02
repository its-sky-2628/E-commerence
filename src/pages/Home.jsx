import Navbar from
  "../components/Navbar/Navbar";

import Hero from
  "../components/Hero/Hero";

import Categories from
  "../components/Categories/Categories";

import Collection from
  "../components/Collection/Collection";

import About from
  "../components/About/About";

import Offer from
  "../components/Offers/Offers";

import Testimonials from
  "../components/Testimonials/Testimonials";

import Footer from
  "../components/Footer/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <Categories />

        <Collection />

        <section id="about">
          <About />
        </section>

        <Offer />

        <Testimonials />
      </main>

      <Footer />
    </>
  );
}

export default Home;