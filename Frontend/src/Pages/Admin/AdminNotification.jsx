import React, { useState, useEffect, useRef } from "react";
import {
  FiSend,
  FiCheckCircle,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

const initialData = [
  {
    id: 1,
    user: {
      id: "USR-1001",
      name: "Rahul Sharma",
      email: "rahul@mail.com",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
    status: "open",
    messages: [
      {
        from: "user",
        text: "Unable to register event",
        time: "10:30 AM",
      },
    ],
  },
];

export const AdminNotification = () => {
  const [tickets, setTickets] = useState(initialData);
  const [activeId, setActiveId] = useState(initialData[0].id);
  const [input, setInput] = useState("");

  const chatRef = useRef(null);
  const active = tickets.find((t) => t.id === activeId);

  // Auto scroll
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages]);

  // Send message
  const sendMessage = () => {
    if (!input.trim() || active.status === "closed") return;

    const newMsg = {
      from: "admin",
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, messages: [...t.messages, newMsg] }
          : t
      )
    );

    setInput("");
  };

  const resolveTicket = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeId ? { ...t, status: "resolved" } : t
      )
    );
  };

  const closeTicket = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeId ? { ...t, status: "closed" } : t
      )
    );
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-slate-100 rounded-xl overflow-hidden">

      {/* LEFT PANEL */}
      <div className="w-80 bg-white border-r">
        {tickets.map((t) => (
          <div
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`p-4 cursor-pointer ${
              activeId === t.id ? "bg-indigo-50" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <img src={t.user.avatar} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-medium">{t.user.name}</p>
                <p className="text-xs text-gray-500">{t.user.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="p-4 bg-white border-b flex justify-between items-center">
          <div>
            <p className="font-semibold">{active.user.name}</p>
            <p className="text-xs text-gray-500">
              {active.user.id} • {active.user.email}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resolveTicket}
              className="text-green-600 text-sm flex items-center gap-1"
            >
              <FiCheckCircle /> Resolve
            </button>

            <button
              onClick={closeTicket}
              className="text-red-600 text-sm flex items-center gap-1"
            >
              <FiXCircle /> Close
            </button>

            <button className="text-sm flex items-center gap-1">
              <FiUser /> Assign
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">

          {active.messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.from === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              {/* USER MESSAGE */}
              {m.from === "user" && (
                <div className="flex items-end gap-2 max-w-md">
                  <img
                    src={active.user.avatar}
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div className="bg-gray-200 px-4 py-2 rounded-2xl text-sm text-gray-800">
                      {m.text}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{m.time}</p>
                  </div>
                </div>
              )}

              {/* ADMIN MESSAGE */}
              {m.from === "admin" && (
                <div className="flex items-end gap-2 max-w-md flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">
                    A
                  </div>

                  <div className="text-right">
                    <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl text-sm">
                      {m.text}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{m.time}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={chatRef}></div>
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              active.status === "closed"
                ? "Ticket closed"
                : "Reply..."
            }
            disabled={active.status === "closed"}
            className="flex-1 border px-3 py-2 rounded-lg"
          />

          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-4 rounded-lg"
          >
            <FiSend />
          </button>
        </div>

      </div>
    </div>
  );
};