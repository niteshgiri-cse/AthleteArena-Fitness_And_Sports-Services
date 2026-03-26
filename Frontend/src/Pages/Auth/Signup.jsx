import { useState } from "react";

export default function Signup({ setView }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-4">
      <h2 className="text-3xl font-semibold">Create an account</h2>

      <input
        name="name"
        placeholder="Full name"
        onChange={onChange}
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="email"
        type="email"
        placeholder="Email address"
        onChange={onChange}
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={onChange}
        className="w-full border p-3 rounded-lg"
      />

      <button className="w-full bg-indigo-600 text-white p-3 rounded-lg">
        Sign up
      </button>

      <button
        type="button"
        className="w-full border p-3 rounded-lg flex items-center justify-center gap-3"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      <p className="text-sm">
        Already have an account?{" "}
        <span
          onClick={() => setView("login")}
          className="text-indigo-600 font-medium cursor-pointer"
        >
          Sign in
        </span>
      </p>
    </form>
  );
}