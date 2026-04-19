// src/components/Footer.jsx

export default function Footer() {
  return (
    <footer className="font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="text-lg font-bold text-[var(--text)] no-underline mb-3 block tracking-tight">
              SecureSeat
            </a>
            <p className="text-[var(--muted)] text-sm leading-relaxed mb-5 max-w-xs">
              The premium destination for live sports ticketing. Interactive stadium layouts, real-time availability, and secure checkout.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[var(--text)] font-semibold text-xs uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {["Upcoming Matches", "Stadium Directory", "VIP Experiences", "Corporate Bookings"].map(item => (
                <li key={item}>
                  <a href="/" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-[var(--text)] font-semibold text-xs uppercase tracking-wider mb-4">
              Your Account
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "My Tickets", href: "/my-tickets" },
                { label: "Sign In / Register", href: "/login" },
                { label: "Payment Methods", href: "#" },
                { label: "Help Center", href: "#" },
              ].map(item => (
                <li key={item.label}>
                  <a href={item.href} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[var(--text)] font-semibold text-xs uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <p className="text-[var(--muted)] text-sm mb-4">
              Get alerts for new matches and exclusive presales.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text)] text-sm rounded-md px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--text-secondary)] transition-all placeholder:text-[var(--muted)]"
                required
              />
              <button
                type="button"
                className="bg-[var(--primary)] text-[var(--bg)] font-medium rounded-md px-4 py-2 text-sm hover:bg-[var(--primary-hover)] transition-colors cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--muted)] text-xs">
            &copy; {new Date().getFullYear()} SecureSeat. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-[var(--muted)]">
            <a href="#" className="hover:text-[var(--text)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text)] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
