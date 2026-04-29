  import React, { useState } from "react";
  import { useDispatch } from "react-redux";
  import { FiPlus, FiEdit2, FiTrash2, FiX, FiUsers } from "react-icons/fi";
  import { createEventAction } from "@/redux/features/Admin/adminActions";

  const RegisterEvent = () => {
    const dispatch = useDispatch();

    const [events, setEvents] = useState([]);

    const [filter, setFilter] = useState("all");
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
      title: "",
      date: "",
      location: "",
      status: "open",
      image: "",
      file: null, // ✅ NEW (real file)
      registrationFees: "", // ✅ NEW
      capacity: "",
    });

    const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

    const handleImage = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setForm({
        ...form,
        file, // ✅ store real file
        image: URL.createObjectURL(file),
      });
    };

    const reset = () => {
      setForm({
        title: "",
        date: "",
        location: "",
        status: "open",
        image: "",
        file: null,
        registrationFees: "",
        capacity: "",
      });
      setEditId(null);
    };

    // ✅ CONVERT DATE → LocalDateTime
    const formatDateTime = (date) => {
      return date ? `${date}T00:00:00` : "";
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (
        !form.title ||
        !form.date ||
        !form.location ||
        !form.capacity ||
        !form.registrationFees ||
        !form.file
      ) {
        alert("All fields are required");
        return;
      }

      const formData = new FormData();

      // ✅ MATCH BACKEND DTO
      formData.append("title", form.title);
      formData.append("dataAndTime", formatDateTime(form.date));
      formData.append("location", form.location);
      formData.append("status", form.status);
      formData.append("registrationFees", form.registrationFees);
      formData.append("capacity", form.capacity);
      formData.append("imageUrl", form.file);

      // ✅ DEBUG
      console.log("===== EVENT DATA =====");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      try {
        setLoading(true);

        const res = await dispatch(createEventAction(formData));

        if (res?.error) throw new Error();

        alert("✅ Event created");

        reset();
        setOpen(false);

      } catch (err) {
        console.error(err);
        alert("❌ Failed to create event");
      } finally {
        setLoading(false);
      }
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
              className={`px-4 py-1.5 rounded-full text-sm capitalize ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md">

              <div className="flex justify-between mb-4">
                <h3 className="font-semibold text-lg">
                  Create Event
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

                {/* ✅ NEW FIELD */}
                <input
                  name="registrationFees"
                  value={form.registrationFees}
                  onChange={handleChange}
                  placeholder="Registration Fees"
                  className="w-full border p-2 rounded-lg"
                />

                <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity" className="w-full border p-2 rounded-lg" />

                <input type="file" onChange={handleImage} />

                {form.image && (
                  <img src={form.image} className="h-32 w-full object-cover rounded-lg" />
                )}

                <button
                  disabled={loading}
                  className={`w-full py-2 rounded-lg text-white ${
                    loading
                      ? "bg-gray-400"
                      : "bg-linear-to-r from-blue-600 to-indigo-600"
                  }`}
                >
                  {loading ? "Creating..." : "Save Event"}
                </button>

              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default RegisterEvent;