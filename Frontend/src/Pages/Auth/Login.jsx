import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "@/redux/features/auth/authReducer";
import { loginUser } from "@/api/authApi";

export default function Login({ setView }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // keep (no removal)

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors");
      return;
    }

    setErrors({});
    setLoading(true);
    dispatch(loginStart());

    try {
      const res = await loginUser({
        email: form.email.trim(),
        password: form.password.trim(),
      });

      console.log("LOGIN RESPONSE:", res);

      const data = res?.data ? res.data : res;

      const { jwt: token, roles, id } = data;

      let safeRoles = [];

      if (Array.isArray(roles)) {
        safeRoles = roles;
      } else if (typeof roles === "string") {
        safeRoles = roles
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map((r) => r.trim());
      }

      // 🔥 store token
      localStorage.setItem("token", token);

      dispatch(
        loginSuccess({
          user: { id, roles: safeRoles },
          token,
        })
      );

      toast.success("Login successful 🎉");

      // 🔥 FINAL FIX (IMPORTANT)
      const isAdmin = safeRoles.includes("ADMIN");

      if (isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      dispatch(loginFailure());
      toast.error(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md space-y-4 transition-all duration-200"
    >
      <h2 className="text-3xl font-semibold">Sign in to your account</h2>

      <div>
        <input
          name="email"
          type="email"
          value={form.email}
          placeholder="Email address"
          onChange={onChange}
          className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          placeholder="Password"
          onChange={onChange}
          className="w-full border p-3 rounded-lg pr-12 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-3 rounded-lg text-white transition-all duration-200
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
        }`}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <button
        type="button"
        className="w-full border p-3 rounded-lg flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-transform"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      <p
        onClick={() => setView("forgot")}
        className="text-indigo-600 text-sm cursor-pointer active:scale-95"
      >
        Forgot password?
      </p>

      <p className="text-sm">
        Not a member?{" "}
        <span
          onClick={() => setView("signup")}
          className="text-indigo-600 font-medium cursor-pointer active:scale-95 inline-block"
        >
          Sign up
        </span>
      </p>
    </form>
  );
}