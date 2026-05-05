import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgetForm";


export default function Auth() {
  const [view, setView] = useState("login");

  return (
    <div className="min-h-screen flex">
      
      <div className="hidden md:block md:w-1/2 h-screen">
        <img
          src="https://images.unsplash.com/photo-1554344728-77cf90d9ed26?q=80&w=1170&auto=format&fit=crop"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          {view === "login" && <Login setView={setView} />}
          {view === "signup" && <SignUp setView={setView} />}
          {view === "forgot" && <ForgotPassword setView={setView} />}
        </div>
      </div>

    </div>
  );
}