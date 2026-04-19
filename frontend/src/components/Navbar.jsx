import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const TicketLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9V15C2 16.6569 3.34315 18 5 18H19C20.6569 18 22 16.6569 22 15V9C22 7.34315 20.6569 6 19 6H5C3.34315 6 2 7.34315 2 9Z" />
    <path d="M7 6V18" strokeDasharray="2 4" />
  </svg>
);

export default function Navbar({ user, handleLogout, darkMode, onToggleTheme }) {
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

  const navLinkClass = (path) =>
    `text-[13px] font-medium px-3.5 py-2 rounded-md transition-all duration-200 ${
      isActive(path)
        ? "bg-[var(--surface-muted)] text-[var(--text)]"
        : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "nav-header nav-header-scrolled" : "nav-header"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ─── LEFT: Brand ─── */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group shrink-0">
            <span className="text-[var(--text)] opacity-70 group-hover:opacity-100 transition-opacity">
              <TicketLogo />
            </span>
            <span className="text-[15px] font-bold text-[var(--text)] tracking-tight">
              SecureSeat
            </span>
          </Link>

          {/* ─── RIGHT: Nav + Actions ─── */}
          <div className="flex items-center gap-1 md:gap-2">

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 mr-2">
              {userRole === "ADMIN" && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  Dashboard
                </Link>
              )}

              {userRole === "SECURITY" && (
                <Link to="/security" className={navLinkClass("/security")}>
                  Scanner
                </Link>
              )}

              {userRole !== "ADMIN" && userRole !== "SECURITY" && (
                <>
                  <Link to="/" className={navLinkClass("/")}>
                    Matches
                  </Link>
                  {isLoggedIn && (
                    <Link to="/my-tickets" className={navLinkClass("/my-tickets")}>
                      My Tickets
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Separator */}
            <div className="hidden md:block w-px h-5 bg-[var(--border)] mx-1" />

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="theme-toggle-button"
              aria-label="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-9 h-9 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text)] text-sm font-semibold flex items-center justify-center hover:bg-[var(--border)] transition-all cursor-pointer"
                >
                  {user.email.charAt(0).toUpperCase()}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-lg overflow-hidden animate-[fadeIn_0.15s_ease-out]">
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider mb-0.5">
                        Signed in as
                      </p>
                      <p className="text-[13px] font-medium text-[var(--text)] truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-1.5">
                      {userRole !== "ADMIN" && userRole !== "SECURITY" && (
                        <>
                          <Link
                            to="/my-tickets"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-left px-3 py-2 rounded-md text-[13px] text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors"
                          >
                            Manage Tickets
                          </Link>
                          <div className="h-px bg-[var(--border)] my-1" />
                        </>
                      )}
                      <button
                        onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                        className="block w-full text-left px-3 py-2 rounded-md text-[13px] text-[var(--danger)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[var(--primary)] text-[var(--bg)] hover:bg-[var(--primary-hover)] px-4 py-2 rounded-md text-[13px] font-semibold transition-all"
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
