import { useState } from "react";

export default function ForgotPassword({ setView }) {
  const [email, setEmail] = useState("");

  const submit = e => {
    e.preventDefault();
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-4">
      <h2 className="text-3xl font-semibold">Reset password</h2>

      <input
        type="email"
        placeholder="Email address"
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-3 rounded-lg"
      />

      <button className="w-full bg-indigo-600 text-white p-3 rounded-lg">
        Send reset link
      </button>

      <p
        onClick={() => setView("login")}
        className="text-indigo-600 text-sm cursor-pointer"
      >
        Back to login
      </p>
    </form>
  );
}