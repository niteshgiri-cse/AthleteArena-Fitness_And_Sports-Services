import {
  Disclosure,
  DisclosureButton,
} from "@headlessui/react";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BellIcon } from "lucide-react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { href, NavLink } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "@/redux/features/user/userAction";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Category", href: "/sport-category" },
  { name: "Community", href: "/community" },
  { name: "Recent News", href: "/recent-new" },
  { name: "Events", href: "/live-events" },
  { name: "Services", href: "/services" },
  {name:"Live",href:"/live-learning"}
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
      <Disclosure as="nav" className="sticky top-0 z-40 backdrop-blur-xl">
        {({ open }) => (
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-16 justify-between">

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

                <NavLink to="/" className="text-2xl font-bold text-[#010F31]">
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
                      className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

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
                    className="flex items-center gap-2 rounded-full p-1 pr-3 cursor-pointer hover:bg-slate-100"
                  >
                    <img
                      src={profileImage}
                      className="h-9 w-9 rounded-full"
                    />
                    <span className="hidden sm:block text-sm font-medium">
                      My Profile
                    </span>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </Disclosure>

      {isLoggedIn && openProfile &&
        createPortal(
          <>
            <div
              onClick={() => setOpenProfile(false)}
              className="fixed inset-0 bg-black/60 z-9998"
            />

            <div className="fixed inset-y-0 right-0 w-[320px] bg-white z-9999 shadow-2xl transition-transform duration-300">

              <div className="flex items-center gap-3 p-4 border-b bg-white">
                <img
                  src={profileImage}
                  className="h-10 w-10 rounded-full"
                />

                <div className="flex-1">
                  <p className="font-semibold">My Profile</p>
                  <p className="text-sm text-slate-500">User Panel</p>
                </div>

                <button
                  onClick={() => setOpenProfile(false)}
                  className="text-xl cursor-pointer font-semibold"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-3 bg-white">

                <NavLink
                  to="/userProfile"
                  onClick={() => setOpenProfile(false)}
                  className="block p-3 border-b font-semibold hover:bg-slate-200 rounded-lg"
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/registered-events"
                  onClick={() => setOpenProfile(false)}
                  className="block p-3 border-b font-semibold hover:bg-slate-200 rounded-lg"
                >
                  Registered Events
                </NavLink>

                <NavLink
                  to="/mentors"
                  onClick={() => setOpenProfile(false)}
                  className="block p-3 border-b font-semibold hover:bg-slate-200 rounded-lg"
                >
                  Mentors
                </NavLink>

                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/auth";
                  }}
                  className="w-full text-left p-3 border-b text-red-500 font-semibold hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Logout
                </button>

              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}