import React from "react";

const courses = [
  {
    id: 1,
    title: "Football Dribbling Masterclass",
    level: "Beginner",
    duration: "3h 20m",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
  },
  {
    id: 2,
    title: "Strength Training for Athletes",
    level: "Intermediate",
    duration: "5h 10m",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
  },
  {
    id: 3,
    title: "Professional Cricket Batting Techniques",
    level: "Advanced",
    duration: "4h 45m",
    image:
      "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800",
  },
  {
    id: 4,
    title: "Speed & Agility Training",
    level: "All Levels",
    duration: "2h 30m",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
  },
];

const LearningCenter = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-14">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold">Learning Hub</h2>
        <button className="text-blue-600 font-semibold hover:underline">
          View All Courses
        </button>
      </div>

      {/* Featured Course */}
      <div className="relative rounded-xl overflow-hidden mb-12 group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200"
          alt=""
          className="w-full h-105 object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 p-8 text-white">
          <p className="text-sm">Featured Program</p>
          <h3 className="text-3xl font-bold">
            Complete Football Training Bootcamp
          </h3>
          <p className="text-sm mt-2">Beginner to Advanced • 12h Content</p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer"
          >
            <img
              src={course.image}
              alt=""
              className="rounded-t-xl h-40 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold mb-2">{course.title}</h3>

              <div className="flex justify-between text-sm text-gray-500">
                <span>{course.level}</span>
                <span>{course.duration}</span>
              </div>

              <button className="mt-4 text-blue-600 font-semibold hover:underline">
                Start Learning →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningCenter;
