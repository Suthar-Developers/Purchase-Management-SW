import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayName, getInitials, getStoredUser, formatRole } from '../../utils/userPreferences'
import {logout} from "../../api/authApi"
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);

  const profileRef = useRef(null);

  const user = getStoredUser()
  const displayName = getDisplayName(user)
  const roleName = formatRole(user.role_id || user.role)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) { setOpenProfile(false); }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const openProfilePage = ()=> {
    navigate("/profile")
    setOpenProfile(false)
  }

  const handleLogout = async () => {

    try {
      await logout();
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="relative z-20 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm lg:px-8">
      <div>
        <h1 className="text-lg font-bold text-slate-950">Purchase Management</h1>
        <p className="text-xs text-slate-500">Projects, vendors, requests, and orders</p>
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
        >
          <div className="hidden text-right sm:block">
            <h3 className="text-sm font-semibold text-slate-900">{displayName}</h3>
            <h5 className="text-xs text-slate-500">{roleName}</h5>
          </div>

          <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 font-semibold text-white">{getInitials(displayName)}</div>

          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${openProfile ? "rotate-180" : ""
              }`}
          />
        </button>

        {/* Dropdown */}
        <div
          className={`absolute right-0 mt-3 w-72 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-xl transition-all duration-200 ${openProfile
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
            }`}
        >
          {/* User Info */}
          <div className="border-b border-slate-100 px-5 py-2">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-slate-900 text-lg font-bold text-white">{getInitials(displayName)}</div>
              <div>
                <h2 className="font-semibold text-slate-900">{displayName}</h2>

                <p className="text-sm text-slate-500">{roleName}</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-2">
            <button onClick={openProfilePage} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              <User size={18} />
              View Profile
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              <Settings size={18} />
              Account Settings
            </button>

            <div className="my-2 border-t border-slate-200"></div>

            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
