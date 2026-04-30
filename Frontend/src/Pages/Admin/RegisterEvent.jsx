import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import {
  createEventAction,
  deleteEventAction,
  updateEventAction,
} from "@/redux/features/Admin/adminActions";

import axios from "axios";
import BASE_URL from "@/config/api";

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
    file: null,
    registrationFees: "",
    capacity: "",
  });

  // ✅ FETCH EVENTS (FIXED ENDPOINT)
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/event`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("EVENTS:", res.data); // debug

      setEvents(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      file,
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

  const formatDateTime = (date) => {
    return date ? `${date}T00:00:00` : "";
  };
const formatDate = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("dataAndTime", formatDateTime(form.date));
    formData.append("location", form.location);
    formData.append("status", form.status);
    formData.append("registrationFees", form.registrationFees);
    formData.append("capacity", form.capacity);

    if (form.file) {
      formData.append("imageUrl", form.file);
    }

    try {
      setLoading(true);

      if (editId) {
        await dispatch(updateEventAction(editId, formData));
        alert("✅ Updated");
      } else {
        await dispatch(createEventAction(formData));
        alert("✅ Created");
      }

      await fetchEvents(); // ✅ refresh list

      reset();
      setOpen(false);

    } catch (err) {
      console.error(err);
      alert("❌ Failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await dispatch(deleteEventAction(id));
      await fetchEvents(); // ✅ refresh after delete
      alert("✅ Deleted");
    } catch {
      alert("❌ Delete failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (event) => {
    setForm({
      title: event.title,
      date: event.dataAndTime?.split("T")[0],
      location: event.location,
      status: event.status,
      registrationFees: event.registrationFees,
      capacity: event.capacity,
      image: event.imageUrl,
      file: null,
    });

    setEditId(event.id);
    setOpen(true);
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
          className="bg-blue-600 text-white px-5 py-2 rounded-xl flex gap-2"
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
            className={`px-4 py-1.5 rounded-full text-sm ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ✅ EVENT CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((event) => (
          <div key={event.id} className="bg-white p-4 rounded-xl shadow">

            <img
              src={event.imageUrl}
              className="h-40 w-full object-cover rounded"
            />

            <h3 className="font-bold mt-2">{event.title}</h3>

            <p className="text-sm text-gray-500">{event.location}</p>

            <p className="text-xs text-gray-400">
             <p>{formatDate(event.dataAndTime)}</p>
            </p>

            <div className="flex justify-between mt-2 text-sm">
              <span>{event.status}</span>
              <span>₹{event.registrationFees}</span>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(event)}
                className="bg-yellow-400 px-3 py-1 rounded text-sm"
              >
                <FiEdit2 /> Edit
              </button>

              <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">

            <div className="flex justify-between mb-4">
              <h3>{editId ? "Edit Event" : "Create Event"}</h3>
              <button onClick={() => { setOpen(false); reset(); }}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2" placeholder="Event Title" />

              <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border p-2" />

              <input name="location" value={form.location} onChange={handleChange} className="w-full border p-2" placeholder="Location" />

              <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2">
                <option value="open">Open</option>
                <option value="live">Live</option>
                <option value="closed">Closed</option>
              </select>

              <input name="registrationFees" value={form.registrationFees} onChange={handleChange} className="w-full border p-2" placeholder="Fees" />

              <input name="capacity" value={form.capacity} onChange={handleChange} className="w-full border p-2" placeholder="Capacity" />

              <input type="file" onChange={handleImage} />

              {form.image && (
                <img src={form.image} className="h-32 w-full object-cover rounded" />
              )}

              <button
                disabled={loading}
                className={`w-full py-2 text-white ${
                  loading ? "bg-gray-400" : "bg-blue-600"
                }`}
              >
                {loading ? "Saving..." : "Save Event"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RegisterEvent;