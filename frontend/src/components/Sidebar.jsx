import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isActive = (path) => {
    return location.pathname === path;
  };

  // ==========================================
  // LOAD UNREAD NOTIFICATION COUNT
  // ==========================================

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUnreadCount(0);
          return;
        }

        const data = await api.get(
          "/notifications/unread-count"
        );

        setUnreadCount(
          data.unreadCount || 0
        );
      } catch (error) {
        console.error(
          "Notification count error:",
          error
        );
      }
    };

    loadUnreadCount();
  }, [location.pathname]);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    setIsOpen(false);
  };

  return (
    <>
      {/* ==========================================
          MOBILE TOP BAR
      ========================================== */}

      <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-slate-950 px-5 py-4 lg:hidden">

        <button
          onClick={() =>
            handleNavigation("/dashboard")
          }
          className="text-xl font-bold text-white"
        >
          SupportSphere
          <span className="text-cyan-400">
            AI
          </span>
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 hover:bg-white/10"
          aria-label="Toggle navigation"
        >
          {isOpen ? "✕" : "☰"}
        </button>

      </div>


      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}


      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950 transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* ==========================================
            LOGO
        ========================================== */}

        <div className="border-b border-white/10 px-6 py-6">

          <button
            onClick={() =>
              handleNavigation("/dashboard")
            }
            className="text-2xl font-bold text-white"
          >
            SupportSphere
            <span className="text-cyan-400">
              AI
            </span>
          </button>

          <p className="mt-1 text-xs text-slate-500">
            Customer Support Platform
          </p>

        </div>


        {/* ==========================================
            USER
        ========================================== */}

        <div className="border-b border-white/10 px-6 py-5">

          <p className="font-semibold text-white">
            {user?.name || "User"}
          </p>

          <p className="mt-1 text-sm capitalize text-slate-500">
            {user?.role || "user"}
          </p>

        </div>


        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">

          {/* Dashboard */}

          <SidebarItem
            label="Dashboard"
            active={isActive("/dashboard")}
            onClick={() =>
              handleNavigation("/dashboard")
            }
          />


          {/* Tickets */}

          <SidebarItem
            label="Tickets"
            active={
              location.pathname === "/tickets" ||
              location.pathname.startsWith(
                "/tickets/"
              )
            }
            onClick={() =>
              handleNavigation("/tickets")
            }
          />


          {/* Customers */}

          <SidebarItem
            label="Customers"
            active={isActive("/customers")}
            onClick={() =>
              handleNavigation("/customers")
            }
          />


          {/* Team - Admin Only */}

          {user?.role === "admin" && (
            <SidebarItem
              label="Team"
              active={isActive("/team")}
              onClick={() =>
                handleNavigation("/team")
              }
            />
          )}


          {/* Notifications */}

          <SidebarItem
            label="Notifications"
            active={isActive(
              "/notifications"
            )}
            onClick={() =>
              handleNavigation(
                "/notifications"
              )
            }
            badge={unreadCount}
          />


          {/* Profile */}

          <SidebarItem
            label="Profile"
            active={isActive("/profile")}
            onClick={() =>
              handleNavigation("/profile")
            }
          />

        </nav>


        {/* ==========================================
            LOGOUT
        ========================================== */}

        <div className="border-t border-white/10 p-4">

          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}


// ==========================================
// SIDEBAR ITEM
// ==========================================

function SidebarItem({
  label,
  active,
  onClick,
  badge,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-cyan-500/10 text-cyan-400"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >

      <span>{label}</span>

      {/* Notification Badge */}

      {badge > 0 && (
        <span className="flex min-w-6 items-center justify-center rounded-full bg-cyan-500 px-2 py-0.5 text-xs font-bold text-slate-950">
          {badge > 99 ? "99+" : badge}
        </span>
      )}

    </button>
  );
}

export default Sidebar;