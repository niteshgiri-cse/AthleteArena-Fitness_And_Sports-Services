import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEventsAction } from "@/redux/features/event/eventAction";

const Event = () => {
  const dispatch = useDispatch();

  // ✅ REDUX DATA
  const { events: reduxEvents, loading, error } = useSelector(
    (state) => state.event
  );

  const [activeTab, setActiveTab] = useState("All");
  const [registered, setRegistered] = useState([]);

  // ✅ FIX: MOVE THIS ABOVE (IMPORTANT)
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  // ✅ CALL API
  useEffect(() => {
    dispatch(getAllEventsAction());
  }, [dispatch]);

  // ✅ FORMAT DATA
  const events = reduxEvents.map((e) => ({
    id: e.id,
    title: e.title,
    date:
      e.status === "live"
        ? "Live Now"
        : new Date(e.dataAndTime).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
    location: e.location,
    status: capitalize(e.status),
    image: e.imageUrl,
  }));

  const handleRegister = (id) => {
    if (!registered.includes(id)) {
      setRegistered([...registered, id]);
    }
  };

  // ✅ FILTER (UNCHANGED)
  const filteredEvents =
    activeTab === "All"
      ? events
      : events.filter((event) => event.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Events & Competitions</h2>
        <button className="text-blue-600 font-semibold hover:underline">
          View All
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 mb-8">
        {["All", "Open", "Live", "Closed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full border ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LOADING / ERROR */}
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">Failed to load events</p>}

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={event.image}
              alt=""
              className="h-48 w-full object-cover"
            />

            <div className="p-4 space-y-2">
              {/* STATUS BADGE */}
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  event.status === "Live"
                    ? "bg-red-100 text-red-600"
                    : event.status === "Open"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {event.status}
              </span>

              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="text-sm text-gray-500">{event.location}</p>

              {/* BUTTONS */}
              {event.status === "Open" && (
                <button
                  onClick={() => handleRegister(event.id)}
                  className={`w-full mt-3 py-2 rounded-lg ${
                    registered.includes(event.id)
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {registered.includes(event.id)
                    ? "Registered"
                    : "Register Now"}
                </button>
              )}

              {event.status === "Live" && (
                <button className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg animate-pulse">
                  🔴 Watch Live
                </button>
              )}

              {event.status === "Closed" && (
                <button className="w-full mt-3 bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed">
                  Registration Closed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* NO DATA */}
      {!loading && filteredEvents.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No events available
        </p>
      )}

      {/* STATIC UPDATES */}
      <div className="mt-14">
        <h3 className="text-2xl font-bold mb-6">Event Updates</h3>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow flex justify-between">
            <p>🏆 Football Championship registrations extended till Feb 18</p>
            <span className="text-sm text-gray-500">2h ago</span>
          </div>

          <div className="p-4 bg-white rounded-lg shadow flex justify-between">
            <p>🔥 Marathon is now LIVE – Track runners in real time</p>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;