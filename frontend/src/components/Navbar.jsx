import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/secureseatsmall.png";

const TicketLogo = () => (
  <img
    src={logo}
    alt="Criceco Logo"
    className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
  />
);

const UserIcon = () => (
  <svg
    className="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400 transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-300 transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export default function Navbar({ user, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const isLoggedIn = !!user;
  const userRole = user?.role ? user.role.toUpperCase() : "USER";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-slate-900 border-b ${
        scrolled ? "border-slate-700 shadow-lg shadow-black/20" : "border-slate-800"
      } font-['Inter',sans-serif]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <TicketLogo />
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
              Secure<span className="text-blue-500">Seat</span>
            </span>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-3">
            {userRole === "ADMIN" && (
              <Link
                to="/admin"
                className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  isActive("/admin")
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "text-amber-400 border-amber-500/20 hover:bg-amber-500/10"
                }`}
              >
                Admin Dashboard
              </Link>
            )}

            {userRole === "SECURITY" && (
              <Link
                to="/security"
                className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  isActive("/security")
                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                    : "text-red-400 border-red-500/20 hover:bg-red-500/10"
                }`}
              >
                Scanner Portal
              </Link>
            )}

            {userRole !== "ADMIN" && userRole !== "SECURITY" && (
              <>
                <Link
                  to="/"
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/")
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  Matches
                </Link>

                {isLoggedIn && (
                  <Link
                    to="/my-tickets"
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive("/my-tickets")
                        ? "bg-slate-800 text-white border border-slate-700"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    My Tickets
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors border border-blue-500/50 shadow-lg shadow-blue-900/30"
                >
                  {user.email.charAt(0).toUpperCase()}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-black/30 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-slate-200 text-sm font-medium truncate">{user.email}</p>
                    </div>

                    <div className="p-2">
                      {userRole !== "ADMIN" && userRole !== "SECURITY" && (
                        <Link
                          to="/my-tickets"
                          onClick={() => setIsMenuOpen(false)}
                          className="group flex items-center px-4 py-2.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm"
                        >
                          <UserIcon />
                          My Tickets
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="group flex items-center w-full px-4 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-sm mt-1"
                      >
                        <LogoutIcon />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-colors border border-blue-500/50"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}