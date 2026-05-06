import React, { useState, useEffect } from "react";
import {
  FiEdit2,
  FiShield,
  FiLock,
  FiSave,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import {
  getAdminProfileAction,
  updateAdminProfileAction,
} from "@/redux/features/Admin/adminActions";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff";

const AdminProfile = () => {

  const dispatch = useDispatch();

  const { adminProfile } = useSelector(
    (state) => state.admin || {}
  );

  console.log("ADMIN PROFILE:", adminProfile);

  const [edit, setEdit] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    profileUrl: "",
  });

  const [imageFile, setImageFile] =
    useState(null);

  // ================= FETCH PROFILE =================

  useEffect(() => {

    dispatch(getAdminProfileAction());

  }, [dispatch]);

  // ================= SET USER =================

  useEffect(() => {

    if (adminProfile) {

      setUser({
        name:
          adminProfile?.name || "",

        email:
          adminProfile?.email || "",

        phone:
          adminProfile?.phone || "",

        location:
          adminProfile?.location || "",

        role:
          adminProfile?.role || "",

        // ✅ FIXED
        profileUrl:
          adminProfile?.profileUrl || "",
      });
    }

  }, [adminProfile]);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setUser((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  // ================= IMAGE CHANGE =================

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    // preview image instantly
    const previewUrl =
      URL.createObjectURL(file);

    setUser((prev) => ({
      ...prev,
      profileUrl: previewUrl,
    }));
  };

  // ================= SAVE =================

  const handleSave = async () => {

    try {

      const formData =
        new FormData();

      formData.append(
        "name",
        user.name || ""
      );

      formData.append(
        "email",
        user.email || ""
      );

      formData.append(
        "phone",
        user.phone || ""
      );

      formData.append(
        "location",
        user.location || ""
      );

      // ✅ IMPORTANT FIX
      // backend expects profileUrl
      if (imageFile) {

        formData.append(
          "profileUrl",
          imageFile
        );
      }

      console.log(
        "IMAGE FILE:",
        imageFile
      );

      // update profile
      await dispatch(
        updateAdminProfileAction(
          formData
        )
      );

      // refresh profile
      await dispatch(
        getAdminProfileAction()
      );

      setEdit(false);

    } catch (err) {

      console.log(
        "PROFILE UPDATE ERROR:",
        err
      );
    }
  };

  // ================= SAFE IMAGE =================

  const profileImage =

    user?.profileUrl &&
    typeof user.profileUrl ===
      "string" &&
    user.profileUrl.trim() !== ""

      ? user.profileUrl

      : DEFAULT_AVATAR;

  // ================= UI =================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-semibold text-gray-900">

            Admin Profile

          </h1>

          <p className="text-sm text-gray-500">

            Manage your account settings

          </p>

        </div>

        <button
          onClick={() => {

            if (edit) {

              handleSave();

            } else {

              setEdit(true);
            }
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
        >

          {edit
            ? <FiSave />
            : <FiEdit2 />}

          {edit
            ? "Save Changes"
            : "Edit Profile"}

        </button>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">

          <div className="text-center">

            <div className="relative w-24 h-24 mx-auto">

              {/* PROFILE IMAGE */}
              <img
                src={profileImage}
                alt="profile"
                onError={(e) => {

                  e.currentTarget.src =
                    DEFAULT_AVATAR;
                }}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />

              {/* EDIT IMAGE */}
              {edit && (

                <label className="absolute bottom-0 right-0 bg-white text-black p-1 rounded-full cursor-pointer shadow">

                  📷

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                </label>

              )}
            </div>

            {/* NAME */}
            <h2 className="mt-4 text-lg font-semibold">

              {user?.name || "Admin"}

            </h2>

            {/* ROLE */}
            <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full mt-2">

              <FiShield />

              {user?.role || "ADMIN"}

            </span>
          </div>

          {/* STATS */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">

            <div>

              <p className="text-lg font-bold">
                1,240
              </p>

              <p className="text-xs opacity-80">
                Users
              </p>

            </div>

            <div>

              <p className="text-lg font-bold">
                320
              </p>

              <p className="text-xs opacity-80">
                Events
              </p>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* ACCOUNT */}
          <Section title="Account Information">

            <FormField
              label="Full Name"
              name="name"
              value={user.name}
              edit={edit}
              onChange={handleChange}
            />

            <FormField
              label="Email"
              name="email"
              value={user.email}
              edit={edit}
              onChange={handleChange}
            />

            <FormField
              label="Phone"
              name="phone"
              value={user.phone}
              edit={edit}
              onChange={handleChange}
            />

            <FormField
              label="Location"
              name="location"
              value={user.location}
              edit={edit}
              onChange={handleChange}
            />

          </Section>

          {/* SECURITY */}
          <Section title="Security">

            <div className="flex justify-between items-center">

              <span className="flex items-center gap-2 text-sm text-gray-600">

                <FiLock />

                Password

              </span>

              <button className="text-sm text-indigo-600 hover:underline">

                Change

              </button>

            </div>

            <div className="flex justify-between items-center">

              <span className="text-sm text-gray-600">

                Two-Factor Authentication

              </span>

              <button className="text-sm text-indigo-600 hover:underline">

                Enable

              </button>

            </div>

          </Section>
        </div>
      </div>
    </div>
  );
};

// ================= SECTION =================

const Section = ({
  title,
  children,
}) => (

  <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm">

    <h3 className="text-sm font-semibold text-gray-800">

      {title}

    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {children}

    </div>
  </div>
);

// ================= FORM FIELD =================

const FormField = ({
  label,
  name,
  value,
  edit,
  onChange,
}) => (

  <div className="flex flex-col gap-1">

    <label className="text-xs text-gray-500">

      {label}

    </label>

    {edit ? (

      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />

    ) : (

      <div className="text-sm text-gray-800">

        {value || "-"}

      </div>

    )}
  </div>
);

export default AdminProfile;