import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BellIcon } from "lucide-react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "@/redux/features/user/userActions";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Category", href: "/sport-category" },
  { name: "Community", href: "/community" },
  { name: "Recent News", href: "/recent-new" },
  { name: "Events", href: "/live-events" },
  { name: "Services", href: "/services" },
  { name: "Live", href: "/live-learning" },
];

const isTokenValid = (token) => {
  try {
    if (!token || token === "undefined" || token === "null") return false;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);

  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user || {});

  const token = localStorage.getItem("token");
  const isLoggedIn = isTokenValid(token);

  // ✅ GET ROLES
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = roles.includes("ADMIN");

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getProfileAction());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    document.body.style.overflow = openProfile ? "hidden" : "auto";
  }, [openProfile]);

  const profileImage =
    userProfile?.profileImageUrl ||
    "https://i.pravatar.cc/150?img=12";

  return (
    <>
      <Disclosure as="nav" className="sticky top-0 z-40 backdrop-blur-xl bg-white/80">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4">
              <div className="flex h-16 justify-between items-center">

                {/* LEFT */}
                <div className="flex items-center">
                  <div className="sm:hidden mr-2">
                    <DisclosureButton className="p-2 rounded-lg hover:bg-slate-100">
                      {open ? (
                        <XMarkIcon className="h-6 w-6" />
                      ) : (
                        <Bars3Icon className="h-6 w-6" />
                      )}
                    </DisclosureButton>
                  </div>

                  <NavLink to="/" className="text-xl sm:text-2xl font-bold text-[#010F31]">
                    ATHLETE
                    <span className="bg-linear-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                      ARENA
                    </span>
                  </NavLink>

                  <div className="hidden sm:flex sm:ml-10 space-x-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center space-x-3">
                  <div className="relative p-2 rounded-full hover:bg-slate-100 cursor-pointer">
                    <BellIcon className="h-6 w-6 text-slate-600" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </div>

                  {!isLoggedIn && (
                    <NavLink
                      to="/auth"
                      className="px-4 py-2 rounded-full bg-black text-white text-sm"
                    >
                      Login
                    </NavLink>
                  )}

                  {isLoggedIn && !openProfile && (
                    <div
                      onClick={() => setOpenProfile(true)}
                      className="flex items-center gap-2 rounded-full p-1 pr-3 cursor-pointer hover:bg-slate-100 transition"
                    >
                      <img
                        src={profileImage}
                        className="h-9 w-9 rounded-full"
                        alt="profile"
                      />
                      <span className="hidden sm:block text-sm font-medium">
                        My Profile
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DisclosurePanel className="sm:hidden px-4 pb-4 space-y-2 bg-white shadow-md">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {item.name}
                </NavLink>
              ))}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {isLoggedIn && openProfile &&
  createPortal(
    <>
      {/* BACKDROP */}
      <div
        onClick={() => setOpenProfile(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998 transition-opacity duration-300"
      />

      {/* DRAWER */}
      <div className={`fixed inset-y-0 right-0 w-85 bg-white z-9999 shadow-2xl
        transform transition-transform duration-300 ease-out
        ${openProfile ? "translate-x-0" : "translate-x-full"}`}>

        {/* HEADER */}
        <div className="flex items-center gap-3 p-5 border-b bg-linear-to-r from-slate-50 to-white">
          <img
            src={profileImage}
            className="h-11 w-11 rounded-full ring-2 ring-slate-200"
            alt="profile"
          />

          <div className="flex-1">
            <p className="font-semibold text-[15px] text-slate-800 flex items-center gap-2">
              Account
              {isAdmin && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  ADMIN
                </span>
              )}
            </p>

            <p className="text-xs text-slate-500">
              {isAdmin
                ? "You have administrative privileges"
                : "Manage your account settings"}
            </p>
          </div>

          <button
            onClick={() => setOpenProfile(false)}
            className="text-slate-500 hover:text-black text-lg cursor-pointer font-semibold"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-2">

          <NavLink
            to="/userProfile"
            onClick={() => setOpenProfile(false)}
            className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Profile Settings
          </NavLink>

          <NavLink
            to="/registered-events"
            onClick={() => setOpenProfile(false)}
            className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            My Events
          </NavLink>

          <NavLink
            to="/mentors"
            onClick={() => setOpenProfile(false)}
            className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Mentorship
          </NavLink>

          {/* ADMIN SWITCH */}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setOpenProfile(false)}
              className="block px-4 py-3 rounded-lg text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
            >
              Admin Dashboard
            </NavLink>
          )}

          <div className="border-t my-3" />

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("roles");
              window.location.href = "/auth";
            }}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            Sign out
          </button>

        </div>
      </div>
    </>,
    document.body
  )}
    </>
  );
}