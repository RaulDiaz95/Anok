import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface DiscoverSectionProps {
  id?: string;
}

export default function DiscoverSection({ id }: DiscoverSectionProps) {
  const featuredEvents = [
    {
      title: "Madama Butterfly",
      artist: "Giacomo Puccini",
      date: "January 24 - February 16, 2025",
      location: "Four Seasons Center for the Performing Arts",
      img: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee",
    },
    {
      title: "EDM Explosion 2025",
      artist: "Various Artists",
      date: "March 3 - March 5, 2025",
      location: "Tomorrowland Main Stage",
      img: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae",
    },
    {
      title: "Jazz Under the Stars",
      artist: "Smooth Collective",
      date: "April 8, 2025",
      location: "Sunset Amphitheater, Los Angeles",
      img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    },
    {
      title: "Rock Legends Reunion",
      artist: "Classic Rock Heroes",
      date: "June 10, 2025",
      location: "Wembley Arena, London",
      img: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    },
  ];

  return (
    <section id="discover" className="py-24 bg-[#0f0f1a] text-white text-center">
      <h2 className="text-4xl font-bold text-[#b11226] mb-12 tracking-wide">
        DISCOVER THE BEST EVENTS
      </h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={3}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="max-w-7xl mx-auto"
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
      >
        {featuredEvents.map((event, index) => (
          <SwiperSlide key={index}>
            <div className="bg-[#1a1a28] rounded-2xl overflow-hidden shadow-lg hover:shadow-[#b11226]/40 transition-all duration-300">
              <div className="relative">
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
              <div className="text-left p-6">
                <h3 className="text-2xl font-bold text-white">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-400">{event.artist}</p>
                <p className="text-sm mt-1 font-medium text-[#b11226]">
                  {event.date}
                </p>
                <hr className="border-gray-700 my-3" />
                <p className="text-sm text-gray-300">{event.location}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
