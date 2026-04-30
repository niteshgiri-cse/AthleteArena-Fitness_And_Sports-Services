import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUserX,
  FiEye,
  FiEyeOff,
  FiX,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import {
  registerAdminAction,
  getUsersDetailsAction,
} from "@/redux/features/Admin/adminActions";

const ManageUsers = () => {
  const dispatch = useDispatch();

  // ✅ REDUX STATE
  const { users = [], loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPass, setShowPass] = useState(false);

  // ✅ FORM (ONLY REQUIRED FIELDS)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ================= FETCH USERS =================
  useEffect(() => {
    dispatch(getUsersDetailsAction());
  }, [dispatch]);

  // ================= INPUT =================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ================= CREATE ADMIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) return;

    try {
      await dispatch(
        registerAdminAction({
          name: form.name,
          email: form.email,
          password: form.password,
        })
      );

      alert("✅ Admin created successfully");

      dispatch(getUsersDetailsAction()); // refresh list
      reset();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create admin");
    }
  };

  // ================= RESET =================
  const reset = () => {
    setForm({
      name: "",
      email: "",
      password: "",
    });
    setEditId(null);
    setOpen(false);
  };

  // ================= EDIT =================
  const handleEdit = (a) => {
    setForm({
      name: a.name || "",
      email: a.email || "",
      password: "",
    });
    setEditId(a.id);
    setOpen(true);
  };

  // ================= DELETE (UI only) =================
  const handleDelete = (id) => {
    alert("Delete API not connected yet");
  };

  // ================= BLOCK (UI only) =================
  const toggleStatus = (id) => {
    alert("Status API not connected yet");
  };

  // ================= FILTER (FIXED) =================
  const filtered = users.filter((a) => {
    const matchSearch = a.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const status = (a.status || "ACTIVE").toLowerCase();

    const matchFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? status === "active"
        : status === "disabled";

    return matchSearch && matchFilter;
  });

  // ================= STATS =================
  const total = users.length;
  const active = users.filter(
    (a) => (a.status || "ACTIVE") === "ACTIVE"
  ).length;
  const disabled = users.filter(
    (a) => a.status === "DISABLED"
  ).length;

  return (
    <div className="p-6 bg-slate-100 min-h-screen space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat title="Total Admins" value={total} />
        <Stat title="Active" value={active} />
        <Stat title="Disabled" value={disabled} />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Admin Management</h2>

        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <FiPlus /> Add Admin
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-3">
        <input
          placeholder="Search admin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg flex-1"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.name}</td>
                <td>{a.email}</td>
                <td>{a.role}</td>

                <td>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      a.status === "ACTIVE"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>

                <td className="text-right pr-4 space-x-2">
                  <button onClick={() => handleEdit(a)}>
                    <FiEdit2 />
                  </button>

                  <button onClick={() => toggleStatus(a.id)}>
                    <FiUserX />
                  </button>

                  <button onClick={() => handleDelete(a.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <p className="p-4">Loading...</p>}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <div className="flex justify-between mb-4">
              <h3>{editId ? "Edit Admin" : "Create Admin"}</h3>
              <button onClick={reset}><FiX /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-2 rounded"
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border p-2 rounded"
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2 cursor-pointer"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

              <button className="w-full bg-indigo-600 text-white py-2 rounded">
                Save Admin
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// STAT CARD
const Stat = ({ title, value }) => (
  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 rounded-xl">
    <p className="text-sm">{title}</p>
    <h3 className="text-xl font-bold">{value}</h3>
  </div>
);

export default ManageUsers;