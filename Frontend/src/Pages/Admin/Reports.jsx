import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllEventsAction } from "@/redux/features/event/eventAction";
import { getUsersDetailsAction } from "@/redux/features/Admin/adminActions";

const Reports = () => {

  const dispatch = useDispatch();

  // ✅ REDUX DATA
  const { events = [] } = useSelector((state) => state.event);
  const { users = [] } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("desc");

  // ================= FETCH =================
  useEffect(() => {
    dispatch(getAllEventsAction());
    dispatch(getUsersDetailsAction());
  }, [dispatch]);

  // ================= NORMALIZE =================
  const formattedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    status: (e.status || "open").toLowerCase(),
    registrations: 0,
    capacity: e.capacity || "unlimited",
  }));

  const formattedUsers = users.map((u, i) => ({
    id: u.id || i,
    role: (u.role || "user").toLowerCase(),
  }));

  // ================= STATS =================
  const totalEvents = formattedEvents.length;
  const totalUsers = formattedUsers.length;
  const totalRegs = formattedEvents.reduce((a, e) => a + e.registrations, 0);
  const admins = formattedUsers.filter(u => u.role === "admin").length;

  const activeEvents = formattedEvents.filter(e => e.status !== "closed").length;
  const closedEvents = formattedEvents.filter(e => e.status === "closed").length;

  const unlimitedEvents = formattedEvents.filter(e => e.capacity === "unlimited").length;

  const topEvent = [...formattedEvents].sort((a,b)=>b.registrations-a.registrations)[0];
  const lowEvent = [...formattedEvents].sort((a,b)=>a.registrations-b.registrations)[0];

  const adminRatio = totalUsers
    ? ((admins / totalUsers) * 100).toFixed(1)
    : 0;

  const overbooked = formattedEvents.filter(e =>
    e.capacity !== "unlimited" && e.registrations > e.capacity
  );

  // ================= FILTER =================
  let filtered = formattedEvents.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (filter !== "all") {
    filtered = filtered.filter(e => e.status === filter);
  }

  filtered = filtered.sort((a, b) =>
    sort === "asc"
      ? a.registrations - b.registrations
      : b.registrations - a.registrations
  );

  const resetFilters = () => {
    setSearch("");
    setFilter("all");
    setSort("desc");
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Advanced Reports</h2>

        <button
          onClick={resetFilters}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Reset Filters
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <Stat title="Events" value={totalEvents} />
        <Stat title="Users" value={totalUsers} />
        <Stat title="Registrations" value={totalRegs} />
        <Stat title="Admins %" value={adminRatio + "%"} />
      </div>

      {/* INSIGHTS */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card title="Active Events">{activeEvents}</Card>
        <Card title="Closed Events">{closedEvents}</Card>
        <Card title="Unlimited Events">{unlimitedEvents}</Card>
        <Card title="Overbooked">{overbooked.length}</Card>
      </div>

      {/* TOP / LOW */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Top Event">
          {topEvent?.title} ({topEvent?.registrations})
        </Card>

        <Card title="Low Performance">
          {lowEvent?.title} ({lowEvent?.registrations})
        </Card>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />

        <select onChange={(e) => setFilter(e.target.value)} className="border px-2">
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="live">Live</option>
          <option value="closed">Closed</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)} className="border px-2">
          <option value="desc">High → Low</option>
          <option value="asc">Low → High</option>
        </select>
      </div>

      {/* CHART */}
      <div className="bg-white p-5 rounded shadow">
        <h3 className="mb-3 font-semibold">Registrations Chart</h3>

        {formattedEvents.map(e => {
          const percent =
            e.capacity === "unlimited"
              ? 100
              : Math.round((e.registrations / e.capacity) * 100);

          return (
            <div key={e.id} className="mb-3">
              <div className="text-sm flex justify-between">
                <span>{e.title}</span>
                <span>{percent}%</span>
              </div>

              <div className="bg-gray-200 h-3 rounded">
                <div
                  className="h-3 rounded bg-indigo-600"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm border-collapse">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-3 text-left">Event</th>
      <th className="p-3 text-left">Status</th>
      <th className="p-3 text-left">Regs</th>
      <th className="p-3 text-left">Capacity</th>
      <th className="p-3 text-left">Utilization</th>
    </tr>
  </thead>

  <tbody>
    {filtered.map((e) => (
      <tr key={e.id} className="border-t hover:bg-gray-50">
        <td className="p-3">{e.title}</td>
        <td className="p-3 capitalize">{e.status}</td>
        <td className="p-3">{e.registrations}</td>
        <td className="p-3">
          {e.capacity === "unlimited" ? "∞" : e.capacity}
        </td>
        <td className="p-3">
          {e.capacity === "unlimited"
            ? "100%"
            : Math.round((e.registrations / e.capacity) * 100) + "%"}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>

    </div>
  );
};

// UI
const Stat = ({ title, value }) => (
  <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white p-4 rounded">
    <p>{title}</p>
    <h3 className="text-xl font-bold">{value}</h3>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-lg font-semibold">{children}</h3>
  </div>
);

export default Reports;