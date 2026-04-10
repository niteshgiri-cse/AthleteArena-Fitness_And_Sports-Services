import { signupUser } from "@/api/authApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup({ setView }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors");
      return;
    }

    setErrors({});

    try {
      await signupUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });

      toast.success("Signup successful 🎉");
      setView("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-4">
      <h2 className="text-3xl font-semibold">Create an account</h2>

      {/* Name */}
      <div>
        <input
          name="name"
          value={form.name}
          placeholder="Full name"
          onChange={onChange}
          className="w-full border p-3 rounded-lg"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          name="email"
          type="email"
          value={form.email}
          placeholder="Email address"
          onChange={onChange}
          className="w-full border p-3 rounded-lg"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          placeholder="Password"
          onChange={onChange}
          className="w-full border p-3 rounded-lg pr-12"
        />

        {/* FIXED: single click handler only */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password}
          </p>
        )}
      </div>

      {/* Signup Button */}
      <button
        type="submit"
        disabled={!form.name || !form.email || !form.password}
        className={`w-full p-3 rounded-lg text-white transition-all duration-100
          ${
            !form.name || !form.email || !form.password
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer active:scale-95"
          }`}
      >
        Sign up
      </button>

      {/* Login redirect */}
      <p className="text-sm">
        Already have an account?{" "}
        <span
          onClick={() => setView("login")}
          className="text-indigo-600 font-semibold cursor-pointer active:scale-95 inline-block"
        >
          Sign in
        </span>
      </p>
    </form>
  );
}