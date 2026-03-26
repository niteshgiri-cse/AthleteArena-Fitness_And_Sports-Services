import React from "react";
import { Link, useNavigate} from "react-router-dom";

const services = [
  {
    category: "CONNECT",
    title: "Social Community",
    desc: "Connect with athletes, share updates, build your sports network.",
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNwb3J0cyUyMHRlYW18ZW58MHx8MHx8fDA%3D",
    link: "/community",
  },
  {
    category: "CONNECT",
    title: "Live Online Training ",
    desc: "Join real-time interactive training sessions with professionals.",
    image:
      "https://plus.unsplash.com/premium_photo-1727450578586-eefc750c8f6f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link:"/sport-category",
  },
  {
    category: "GROW",
    title: "Recent Sports News",
    desc: "Stay updated with trending sports stories.",
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e",
    link: "/recent-new",
  },
  {
    category: "COMPETE",
    title: "Live Events",
    desc: "Participate in tournaments and live competitions.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    link: "/live-events",
  },
  {
    category: "GROW",
    title: "Placed Training Videos",
    desc: "Structured video programs to level up your game.",
    image:
      "https://images.unsplash.com/photo-1659081443046-268bee889587?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNwb3J0cyUyMHRlYWNoaW5nfGVufDB8fDB8fHww",
    link:"/sport-category",
  },
  {
    category: "CONNECT",
    title: "Book a Session with Expert",
    desc: "Schedule one-on-one training and mentorship.",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  },
  
  {
    category: "COMPETE",
    title: "Live Scores",
    desc: "Real-time updates and match statistics.",
    image:
      "https://images.unsplash.com/photo-1563947917928-f7902975e12e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2NvcmVib2FyZHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    category: "COMPETE",
    title: "Nearby Sports Clubs & Turfs",
    desc: "Discover local clubs, shops and sports facilities.",
    image:
      "https://plus.unsplash.com/premium_photo-1764412324484-c7bbd7a19fec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmVhcmJ5JTIwbWFwc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  
  
  {
    category: "GROW",
    title: "Promote Your Products",
    desc: "Advertise your sports gear and services.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
  },
];



const Services = () => {
const navigate = useNavigate();
  return (
    <section className="bg- text-white px-6 md:px-20 py-12">
      {/* Heading */}
      <div className="max-w-4xl mb-20">
        <p className=" text-[#364152] uppercase tracking-widest text-3xl font-semibold  mb-8">
            Our Services
        </p>
        <h2 className="text-4xl text-[#364152] md:text-6xl font-bold leading-tight">
          Everything an Athlete  
          <br />
          <span className="text-gray-400">Needs in One Place</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        

{services.map((service, index) => (
  <div
    key={index}
    onClick={() =>
      service.link
        ? navigate(service.link)
        : alert("🚧 Working on this Feature")
    }
    className="relative group rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-lg cursor-pointer transition duration-300 hover:scale-[1.02]"
  >
    {/* Image */}
    <img
      src={`${service.image}?auto=format&fit=crop&w=900&q=80`}
      alt={service.title}
      className="w-full h-105 object-cover transition-transform duration-700 group-hover:scale-110"
    />

    {/* Always Visible Bottom Title */}
    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-6">
      <h3 className="text-2xl font-semibold">
        {service.title}
      </h3>
      <p className="text-xs text-gray-400 uppercase mt-1">
        {service.category}
      </p>
    </div>

    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-center items-center text-center px-8">
      
      <h3 className="text-2xl font-bold mb-4">
        {service.title}
      </h3>

      <p className="text-gray-300 text-sm mb-6">
        {service.desc}
      </p>

      {service.link ? (
        <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-full font-medium transition duration-300">
          Explore Now
        </button>
      ) : (
        <button className="bg-gray-600 px-6 py-3 rounded-full font-medium opacity-80">
          Working on this Feature
        </button>
      )}
    </div>
  </div>
))}
      </div>
    </section>
  );
};

export default Services;