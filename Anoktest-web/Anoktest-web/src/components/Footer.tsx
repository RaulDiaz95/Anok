import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] py-12 text-gray-400">
      <div className="w-[90%] max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Anok</h3>
          <p className="text-sm">
            Discover the best music events, concerts, and festivals around the
            world. Experience sound like never before.
          </p>
        </div>

        <div>
          <h4 className="text-white text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Home</a></li>
            <li><a href="#">Discover</a></li>
            <li><a href="#">Upcoming Shows</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-semibold mb-3">Follow Us</h4>
          <div className="flex justify-center sm:justify-start gap-4">
            <a href="#" className="bg-[#b11226] p-2 rounded-full hover:bg-[#8e0f1e] transition">
              <Facebook size={18} />
            </a>
            <a href="#" className="bg-[#b11226] p-2 rounded-full hover:bg-[#8e0f1e] transition">
              <Instagram size={18} />
            </a>
            <a href="#" className="bg-[#b11226] p-2 rounded-full hover:bg-[#8e0f1e] transition">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs mt-10 text-gray-500 border-t border-gray-800 pt-6">
        © {new Date().getFullYear()} Anok Music. All rights reserved.
      </div>
    </footer>
  );
}
