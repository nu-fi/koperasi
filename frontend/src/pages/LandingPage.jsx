import Home from './Home';
import About from './About';
import Services from './Services';
import Contact from './Contact';

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* 1. Assign unique IDs to each section */}
      
      <section id="home">
        <Home />
      </section>

      <section id="produk">
        <Services />
      </section>

      <section id="tentang">
        <About />
      </section>

      <section id="kontak">
        <Contact />
      </section>
    </div>
  );
};

export default LandingPage;