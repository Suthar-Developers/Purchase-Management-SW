import React, { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import { Bell, Check, LayoutDashboard, Moon, ShieldCheck, SlidersHorizontal, Sun, UserPlus, UserRound, Users, X, } from "lucide-react";
import { toast } from "react-hot-toast";

import { applyStoredTheme, getStoredPreferences, saveStoredPreferences, } from "../../utils/userPreferences";

import useAuth from "../../hooks/useAuth";

import CreateUser from "./users/CreateUser";
import EditUser from "./users/EditUser";
import ResetUserPassword from "./users/ResetUserPassword";
import ChangeUserPassword from "./users/ChangeUserPassword";
import UserManagement from "../../components/users/UserManagement";


// Profile Toggle
const ProfileToggle = ({ checked, label, note, icon, onChange, }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex w-full items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-cyan-300 hover:bg-slate-50"
  >
    <span className="flex min-w-0 items-center gap-3">

      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-950">
          {label}
        </span>

        <span className="block text-xs text-slate-500">
          {note}
        </span>
      </span>

    </span>

    <span
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${checked ? "bg-cyan-600" : "bg-slate-300"}`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : ""}`}
      />
    </span>
  </button>
);


// Profile
const Profile = () => {
  const { user } = useAuth(); // Authentication

  const [preferences, setPreferences,] = useState(getStoredPreferences); //Preferences


  // Modals
  const [showCreateUser, setShowCreateUser,] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [resettingUser, setResettingUser,] = useState(null);
  const [changingPasswordUser, setChangingPasswordUser] = useState(null);
  const [showUsers, setShowUsers,] = useState(false);

  // Current User
  const roleName = user?.role || "";
  const isAdmin = roleName === "Admin";
  const currentUserId = user?.user_id || user?.id;

  // Update Preferences
  const updatePreference = (key, value) => {
    setPreferences((current) =>
      saveStoredPreferences({
        ...current,
        [key]: value,
      })
    );
  };


  // Apply Theme
  useEffect(() => {
    applyStoredTheme(
      preferences.theme
    );
  }, [preferences.theme]);


  // Close users modal with Escape
  useEffect(() => {
    if (!showUsers) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowUsers(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, [showUsers]);


  // Close create user modal
  const handleCreateUserClose = () => {
    setShowCreateUser(false);
  };

  const handleUserUpdated = (updatedUser) => {
    setEditingUser(null);
  };


  /*
  |--------------------------------------------------------------------------
  | User Management Actions
  |--------------------------------------------------------------------------
  |
  | These are intentionally placeholders for the next parts.
  | We'll connect:
  |
  | Change Password
  | Activate / Deactivate
  | Delete
  |
  |--------------------------------------------------------------------------
  */

  const handleEditUser = (selectedUser) => {
    setEditingUser(selectedUser);
  };

  const handleResetPassword = (selectedUser) => {
    setResettingUser(selectedUser);
  };

  const handleChangePassword = (selectedUser) => {
    setChangingPasswordUser(selectedUser);
  };

  const handleToggleStatus = (selectedUser) => {
    console.log("Toggle status:", selectedUser);
    toast("Activate / Deactivate will be added next.");
  };

  const handleDeleteUser = (selectedUser) => {
    console.log("Delete user:", selectedUser);
    toast("Delete action will be updated next.");
  };

  // Account Details
  const detailItems = [
    {
      label: "Full name",
      value: user?.full_name || "-",
    },

    {
      label: "Username",
      value: user?.username || "-",
    },

    {
      label: "Role",
      value: user?.role || "-",
    },
  ];


  return (
    <main className="min-h-full bg-slate-50 px-5 py-5 lg:px-8">

      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Workspace profile</p>

          <h1 className="mt-1 text-2xl font-bold text-slate-950">Profile</h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Manage your profile, appearance,
            and day-to-day workspace preferences.
          </p>
        </div>


        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex flex-wrap gap-3">

            <Button
              lable="Create User"
              type="button"
              onClick={() => setShowCreateUser(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:cursor-pointer hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              preIcon={<UserPlus size={18} />}
            />

            <Button
              lable="Show Users"
              type="button"
              onClick={() => setShowUsers(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:cursor-pointer hover:border-cyan-300 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              preIcon={<Users size={18} />}
            />
          </div>
        )}
      </div>


      {/* Main Profile Layout */}
      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">

        {/* Account Details */}
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-cyan-100 text-cyan-700">
              <UserRound size={20} />
            </span>

            <div>
              <h2 className="text-base font-semibold text-slate-950">Account Details</h2>

              <p className="text-xs text-slate-500">Pulled from the logged-in session.</p>
            </div>
          </div>


          <div className="mt-5 space-y-3">
            {detailItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <span className="text-sm text-slate-500">
                  {item.label}
                </span>

                <strong className="max-w-47.5 truncate text-right text-sm font-semibold text-slate-950">
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        </section>


        {/* Preferences */}
        <section className="space-y-5">

          {/* Appearance */}
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-100 text-slate-700">
                <SlidersHorizontal size={20} />
              </span>

              <div>
                <h2 className="text-base font-semibold text-slate-950">Appearance</h2>
                <p className="text-xs text-slate-500">Choose the look that fits your workspace.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                {
                  value: "light",
                  label: "Light",
                  icon: Sun,
                },

                {
                  value: "dark",
                  label: "Dark",
                  icon: Moon,
                },
              ].map((option) => {

                const Icon = option.icon;

                const active = preferences.theme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updatePreference("theme", option.value)}
                    className={`flex items-center justify-between rounded-md border px-4 py-3 text-left transition ${active
                      ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"
                      }`}
                  >

                    <span className="flex items-center gap-3">
                      <Icon size={18} />

                      <span className="text-sm font-semibold">
                        {option.label}
                      </span>
                    </span>

                    {active && (<Check size={18} />)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workspace Preferences */}
          <div className="grid gap-3 md:grid-cols-2">
            <ProfileToggle checked={preferences.density === "compact"}
              label="Compact workspace"
              note="Tighter spacing for tables and busy screens."
              icon={<LayoutDashboard size={18} />}
              onChange={(checked) => updatePreference("density", checked ? "compact" : "comfortable")}
            />

            <ProfileToggle
              checked={preferences.notifications}
              label="Activity notifications"
              note="Keep purchase activity alerts enabled."
              icon={<Bell size={18} />}
              onChange={(checked) => updatePreference("notifications", checked)}
            />

            <ProfileToggle checked={preferences.reduceMotion}
              label="Reduce motion"
              note="Use calmer transitions where possible."
              icon={<ShieldCheck size={18} />}
              onChange={(checked) => updatePreference("reduceMotion", checked)}
            />
          </div>
        </section>
      </div>

      {/* Create User Modal */}
      {isAdmin && showCreateUser && (
        <CreateUser
          isModal
          onClose={
            handleCreateUserClose
          }
        />
      )}

      {/* User Management Modal */}
      {isAdmin && showUsers && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setShowUsers(false);
            }
          }}
        >

          <div className="flex max-h-[calc(100vh-48px)] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-2xl">

            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-cyan-100 text-cyan-700">
                  <Users size={20} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Admin action</p>
                  <h2 className="text-lg font-bold text-slate-950">User Management</h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowUsers(false)}
                aria-label="Close user management"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Management */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-5">
              <UserManagement
                onEditUser={handleEditUser}
                onResetPassword={handleResetPassword}
                onChangePassword={handleChangePassword}
                onToggleStatus={handleToggleStatus}
                onDeleteUser={handleDeleteUser}
              />
            </div>

            {isAdmin && editingUser && (
              <EditUser
                user={editingUser}
                onClose={() => setEditingUser(null)}
                onUpdated={handleUserUpdated}
              />
            )}

            {isAdmin && resettingUser && (
              <ResetUserPassword
                user={resettingUser}
                onClose={() => setResettingUser(null)}
                onReset={() => { setResettingUser(null); }}
              />
            )}

            {isAdmin && changingPasswordUser && (
              <ChangeUserPassword
                user={changingPasswordUser}
                onClose={() => setChangingPasswordUser(null)}
                onChanged={() => setChangingPasswordUser(null)}
              />
            )}

          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;