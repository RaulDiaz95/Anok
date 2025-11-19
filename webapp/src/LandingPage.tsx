import Navbar from "./components/NavBar";
import Hero from "./components/Hero";
import DiscoverSection from "./components/DiscoverSection";
import UpcomingShows from "./components/UpcomingShows";
import AboutUs from "./components/AboutUs";
import LatestEvents from "./components/LatestEvents";
import Footer from "./components/Footer";
import "/src/styles/landing.css";
import "/src/styles/layout.css";
import LatestNews from "./components/LatestNews";

export default function LandingPage() {
  return (
    <div className="landing-page bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white">
      <Navbar />
      <Hero id="home" />
      <DiscoverSection id="discover" />
      <UpcomingShows id="events" />
      <AboutUs id="about" />
      <LatestEvents />
      <LatestNews id="news" />
      <Footer />
    </div>
  );
}
