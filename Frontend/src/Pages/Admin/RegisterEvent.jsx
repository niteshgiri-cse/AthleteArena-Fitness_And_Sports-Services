import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUsers } from "react-icons/fi";

const RegisterEvent = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "National Football Championship",
      date: "2026-02-20",
      location: "Delhi Stadium",
      status: "open",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
      registrations: 120,
      capacity: 200,
    },
    {
      id: 2,
      title: "State Level Marathon",
      date: "Live Now",
      location: "Mumbai",
      status: "live",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
      registrations: 500,
      capacity: "unlimited",
    },
    {
      id: 3,
      title: "Cricket League Trials",
      date: "2026-02-10",
      location: "Chennai",
      status: "closed",
      image: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=800&q=80",
      registrations: 300,
      capacity: 300,
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    status: "open",
    image: "",
    registrations: 0,
    capacity: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: URL.createObjectURL(file) });
  };

  const reset = () => {
    setForm({
      title: "",
      date: "",
      location: "",
      status: "open",
      image: "",
      registrations: 0,
      capacity: "",
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editId ? { ...form, id: editId } : ev
        )
      );
    } else {
      setEvents([...events, { ...form, id: Date.now() }]);
    }

    reset();
    setOpen(false);
  };

  const handleEdit = (ev) => {
    setForm(ev);
    setEditId(ev.id);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete event?")) return;
    setEvents(events.filter((ev) => ev.id !== id));
  };

  const filtered =
    filter === "all"
      ? events
      : events.filter((e) => e.status === filter);

  return (
    <div className="p-8 bg-slate-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-2xl font-semibold text-slate-800">
          Events & Competitions
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl flex gap-2 shadow hover:scale-105 transition"
        >
          <FiPlus /> New Event
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        {["all", "open", "live", "closed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
              filter === f
                ? "bg-blue-600 text-white shadow"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* EVENTS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={ev.image}
              className="h-48 w-full object-cover"
            />

            <div className="p-5 space-y-2">

              {/* STATUS */}
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                ev.status === "open"
                  ? "bg-green-100 text-green-600"
                  : ev.status === "live"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {ev.status}
              </span>

              <h3 className="font-semibold text-lg text-slate-800">
                {ev.title}
              </h3>

              <p className="text-sm text-gray-500">{ev.date}</p>
              <p className="text-sm text-gray-500">{ev.location}</p>

              {/* REGISTRATION */}
              <div className="flex items-center gap-2 mt-2 text-sm text-indigo-600 font-medium">
                <FiUsers />
                {ev.capacity === "unlimited"
                  ? `${ev.registrations} • Unlimited`
                  : `${ev.registrations}/${ev.capacity}`}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(ev)}
                  className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:scale-110 transition"
                >
                  <FiEdit2 />
                </button>

                <button
                  onClick={() => handleDelete(ev.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:scale-110 transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">
                {editId ? "Edit Event" : "Create Event"}
              </h3>

              <button onClick={() => { setOpen(false); reset(); }}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded-lg" />

              <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border p-2 rounded-lg" />

              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded-lg" />

              <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded-lg">
                <option value="open">Open</option>
                <option value="live">Live</option>
                <option value="closed">Closed</option>
              </select>

              <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity or unlimited" className="w-full border p-2 rounded-lg" />

              <input type="file" onChange={handleImage} />

              {form.image && <img src={form.image} className="h-32 w-full object-cover rounded-lg" />}

              <button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg">
                Save Event
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterEvent;