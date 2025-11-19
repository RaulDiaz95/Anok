import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Discover", href: "#discover" },
    { label: "Events", href: "#events" },
    { label: "About", href: "#about" },
    { label: "News", href: "#news" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0f0f1a]/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4 text-white">
        <a
          href="#home"
          className="text-2xl font-bold text-[#b11226] hover:text-[#d31a33] transition"
        >
          Anok<span className="text-white">Events</span>
        </a>

        <ul className="hidden md:flex gap-8 font-medium tracking-wide">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.querySelector(item.href);
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-[#b11226] transition cursor-pointer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0f0f1a]/95 backdrop-blur-lg border-t border-[#b11226]/20">
          <ul className="flex flex-col items-center py-4 space-y-4 text-lg font-medium">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const section = document.querySelector(item.href);
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                    setMenuOpen(false);
                  }}
                  className="hover:text-[#b11226] transition"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.nav>
  );
}
