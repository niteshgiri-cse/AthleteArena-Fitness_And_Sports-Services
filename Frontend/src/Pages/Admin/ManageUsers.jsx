import React, { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUserX,
  FiEye,
  FiEyeOff,
  FiX,
} from "react-icons/fi";

const ManageUsers = () => {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "Super Admin",
      email: "admin@mail.com",
      role: "super",
      status: "active",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "moderator",
    status: "active",
  });

  // INPUT
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) return;

    if (editId) {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === editId ? { ...form, id: editId } : a
        )
      );
    } else {
      setAdmins([...admins, { ...form, id: Date.now() }]);
    }

    reset();
  };

  const reset = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "moderator",
      status: "active",
    });
    setEditId(null);
    setOpen(false);
  };

  // EDIT
  const handleEdit = (a) => {
    setForm(a);
    setEditId(a.id);
    setOpen(true);
  };

  // DELETE
  const handleDelete = (id) => {
    if (!window.confirm("Delete admin?")) return;
    setAdmins(admins.filter((a) => a.id !== id));
  };

  // BLOCK
  const toggleStatus = (id) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "disabled" : "active" }
          : a
      )
    );
  };

  // FILTER
  const filtered = admins.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? a.status === "active"
        : a.status === "disabled";

    return matchSearch && matchFilter;
  });

  // 📊 STATS
  const total = admins.length;
  const active = admins.filter((a) => a.status === "active").length;
  const disabled = admins.filter((a) => a.status === "disabled").length;

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

                <td>
                  <span className={`px-2 py-1 text-xs rounded ${
                    a.role === "super"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100"
                  }`}>
                    {a.role}
                  </span>
                </td>

                <td>
                  <span className={`px-2 py-1 text-xs rounded ${
                    a.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}>
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

              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" />

              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />

              {/* PASSWORD */}
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

              <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="moderator">Moderator</option>
                <option value="super">Super Admin</option>
              </select>

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

/* STAT */
const Stat = ({ title, value }) => (
  <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white p-5 rounded-xl">
    <p className="text-sm">{title}</p>
    <h3 className="text-xl font-bold">{value}</h3>
  </div>
);

export default ManageUsers;