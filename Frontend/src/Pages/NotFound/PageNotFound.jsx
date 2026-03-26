import { NavLink, useNavigate } from "react-router-dom";
import { Dumbbell, Home, ArrowLeft } from "lucide-react";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-[120px] font-extrabold bg-linear-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent leading-none">
          404
        </h1>

        <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-10 border border-white/20">
          <div className="flex justify-center mb-4">
            <Dumbbell className="h-10 w-10 text-indigo-500" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            You’ve Lost Your Route
          </h2>

          <p className="text-slate-600 mb-6">
            No worries — let’s get you back to the{" "}
            <NavLink
              to="/"
              className="text-indigo-600 font-semibold hover:underline"
            >
              home page
            </NavLink>{" "}
            and continue your training journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium bg-linear-to-r from-indigo-500 to-violet-500 hover:scale-105 transition"
            >
              <Home className="h-5 w-5" />
              Go to Home
            </NavLink>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Stay focused. Stay strong. Your goals are waiting.
        </p>
      </div>
    </div>
  );
}
