import React from "react";

const categories = [
  {
    id: 1,
    name: "Football",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
    layout: "vertical",
  },
  {
    id: 2,
    name: "Basketball",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    layout: "normal",
  },
  {
    id: 3,
    name: "Car Sport",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
    layout: "vertical",
  },
  {
    id: 4,
    name: "Table Tennis",
    image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800",
    layout: "normal",
  },
  {
    id: 5,
    name: "Cricket",
    image: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800",
    layout: "normal",
  },
  {
    id: 6,
    name: "Tennis",
    image: "https://images.unsplash.com/photo-1622279457486-28f7a8b9d7c1?w=800",
    layout: "normal",
  },
  {
    id: 7,
    name: "Swimming",
    image: "https://images.unsplash.com/photo-1600965962102-9d260a71890d?w=800",
    layout: "vertical",
  },
  {
    id: 8,
    name: "Badminton",
    image: "https://images.unsplash.com/photo-1613918431703-aa5080d1a4b5?w=800",
    layout: "normal",
  },
  {
    id: 9,
    name: "Gym",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    layout: "normal",
  },
  {
    id: 10,
    name: "Boxing",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800",
    layout: "vertical",
  },
];

const layoutClasses = {
  vertical: "row-span-2",
  normal: "",
};

const SportsCategories = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Categories</h2>
        </div>

        {/* Grid */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            auto-rows-[220px]
            gap-4
            p-6
          "
        >
          {categories.map((item) => (
            <div
              key={item.id}
              className={`relative group overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer ${layoutClasses[item.layout]}`}
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-lg font-bold tracking-wide">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportsCategories;
