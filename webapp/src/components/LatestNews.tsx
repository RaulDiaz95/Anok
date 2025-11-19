interface LatestNewsProps {
  id?: string;
}

export default function LatestNews({ id }: LatestNewsProps) {
  const news = [
    {
      title: "New Festival Announced in Mexico City",
      img: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
      desc: "An exclusive event that promises to bring together the best of Latin and international artists.",
    },
    {
      title: "Billie Eilish Drops New Album",
      img: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
      desc: "The artist surprises fans with a more experimental sound that breaks expectations.",
    },
    {
      title: "The Rise of Indie Pop",
      img: "https://images.unsplash.com/photo-1521334884684-d80222895322",
      desc: "Independent artists are redefining the sound of the new generation.",
    },
  ];

  return (
    <section id="news" className="py-24 bg-[#12121c] text-white">
      <h2 className="text-4xl font-bold text-center text-[#b11226] mb-12">
        LATEST NEWS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-[90%] max-w-6xl mx-auto">
        {news.map((item, index) => (
          <div
            key={index}
            className="bg-[#1a1a28] rounded-2xl overflow-hidden shadow-lg hover:shadow-[#b11226]/40 transition-all duration-300"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-52 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
              <button className="text-[#b11226] hover:text-[#8e0f1e] font-medium transition-colors">
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
