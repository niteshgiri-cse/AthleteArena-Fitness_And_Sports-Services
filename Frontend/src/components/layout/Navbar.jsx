import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BellIcon, ChevronDown } from "lucide-react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Category", href: "/sport-category" },
  { name: "Community", href: "/community" },
  { name: "Recent News", href: "/recent-new" },
  { name: "Live Events", href: "/live-events" },
  {name: "Services", href: "/services" },
];

const resources = [
  { name: "Learning Center", href: "/learning-center" },
  { name: "Athlete Blog", href: "/athlete-blogs" },
  { name: "Training Guides", href: "/training-guides" },
];

export default function Navbar() {
  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 border-none backdrop-blur-xl"
    >
      {({ open }) => (
        <>
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
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-full text-sm font-medium transition ${
                          isActive
                            ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100">
                        Resource
                        <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48 font-semibold">
                      <DropdownMenuGroup>
                        {resources.map((item) => (
                          <DropdownMenuItem key={item.name} asChild>
                            <NavLink to={item.href}>{item.name}</NavLink>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Menu as="div" className="relative">
                  <MenuButton className="relative p-2 rounded-full hover:bg-slate-100 transition">
                    <BellIcon className="h-6 w-6 text-slate-600" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                  </MenuButton>

                  <MenuItems className="absolute right-0 mt-3 w-80 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <h3 className="font-semibold text-slate-800">
                        Notifications
                      </h3>
                      <button className="text-xs text-indigo-600 hover:underline">
                        Mark all as read
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      <MenuItem>
                        <div className="flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer">
                          <img
                            src="https://i.pravatar.cc/40?img=12"
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="text-sm">
                            <p className="text-slate-800 font-medium">
                              New event near you 🏃
                            </p>
                            <p className="text-slate-500 text-xs">
                              Marathon training camp starts tomorrow
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              2 min ago
                            </p>
                          </div>
                          <span className="ml-auto h-2 w-2 rounded-full bg-indigo-500 mt-2"></span>
                        </div>
                      </MenuItem>

                      <MenuItem>
                        <div className="flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer">
                          <img
                            src="https://i.pravatar.cc/40?img=5"
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="text-sm">
                            <p className="text-slate-800 font-medium">
                              New comment on your post
                            </p>
                            <p className="text-slate-500 text-xs">
                              Riya: Amazing progress 💪
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              10 min ago
                            </p>
                          </div>
                        </div>
                      </MenuItem>

                      <MenuItem>
                        <div className="flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
                            🎓
                          </div>
                          <div className="text-sm">
                            <p className="text-slate-800 font-medium">
                              Course enrollment successful
                            </p>
                            <p className="text-slate-500 text-xs">
                              Strength & Conditioning Pro
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              1 hour ago
                            </p>
                          </div>
                        </div>
                      </MenuItem>
                    </div>

                    <div className="text-center border-t p-2">
                      <NavLink
                        to="/notifications"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        View all notifications
                      </NavLink>
                    </div>
                  </MenuItems>
                </Menu>

                <NavLink
                  to="/userProfile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-full p-1 pr-3 transition cursor-pointer ${
                      isActive ? "bg-slate-100" : "hover:bg-slate-100"
                    }`
                  }
                >
                  <div className="relative">
                    <img
                      src="https://i.pravatar.cc/150?img=12"
                      alt="profile"
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent hover:ring-indigo-500 transition"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>

                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    My Profile
                  </span>
                </NavLink>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden px-4 pb-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className="block px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.name}
              </NavLink>
            ))}

            <div className="pt-2">
              <p className="px-4 text-sm font-semibold text-slate-500">
                Resources
              </p>

              {resources.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className="block px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <NavLink
              to="/userProfile"
              className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg hover:bg-slate-100"
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                className="h-9 w-9 rounded-full"
              />
              <span className="text-slate-700 font-medium">My Profile</span>
            </NavLink>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
