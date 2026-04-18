import AdminNavbar from "@/components/layout/AdminNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <div className="fixed top-0 left-0 h-screen w-64">
        <AdminNavbar />
      </div>
      
      <div className="ml-64 bg-gray-100 min-h-screen p-6">
        <Outlet />
      </div>
    </div>
  );
}