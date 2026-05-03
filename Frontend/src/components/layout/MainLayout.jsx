import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function MainLayout() {

  const location = useLocation();

  const showFooter = location.pathname === "/";

  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      {/* 🔥 CONDITIONAL FOOTER */}
      {showFooter && <Footer />}
    </>
  );
}