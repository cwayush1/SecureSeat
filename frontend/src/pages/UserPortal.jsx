import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStadium } from "../stadiums";
import "../index.css";
import { backendAPI } from "../services/api";

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function UserPortal() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2805&auto=format&fit=crop";

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await backendAPI.get('/matches');
        const apiData = response.data;
        setMatches(apiData);
        if (apiData && apiData.length > 0) setSelectedMatch(apiData[0]);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
        setError("Unable to load matches at this time. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMatches();
  }, []);

  const handleBookNow = () => {
    if (selectedMatch) navigate(`/book/${selectedMatch.id}`);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      <style>{`
        .slider-container::-webkit-scrollbar { display: none; }
        .slider-container { -ms-overflow-style: none; scrollbar-width: none; }
        .hero-img { transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .hero-card:hover .hero-img { transform: scale(1.03); }
        .match-card { transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease; }
        .match-card:hover:not(.match-card--selected) { transform: translateY(-3px); border-color: var(--text-secondary); }
        .match-card--selected { border: 2px solid var(--text) !important; }
        .match-thumb { transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .match-card:hover .match-thumb { transform: scale(1.05); }
        .book-btn { transition: all 0.2s ease; }
        .book-btn:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>

      {/* Header */}
      <header className="pt-14 pb-10 px-6 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-5" style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live Ticketing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Select Your Match
        </h1>
        <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
          Discover upcoming fixtures and secure your perfect seat in the stadium.
        </p>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-7 h-7 border-[3px] rounded-full animate-spin mb-4" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--text)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Loading matches...</p>
          </div>
        )}
        {error && (
          <div className="px-5 py-3.5 rounded-lg text-sm font-medium text-center max-w-lg mx-auto" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}
        {!isLoading && !error && matches.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: 'var(--muted)' }}>No upcoming matches found.</div>
        )}

        {/* Hero Card */}
        {selectedMatch && (
          <section className="mb-14">
            <div className="hero-card rounded-xl overflow-hidden flex flex-col md:flex-row" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div className="md:w-[55%] h-64 md:h-auto relative overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                <img
                  src={selectedMatch.image_url || DEFAULT_IMAGE}
                  alt={`${selectedMatch.team_a} vs ${selectedMatch.team_b}`}
                  className="hero-img w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>
              <div className="md:w-[45%] p-8 md:p-10 flex flex-col justify-center">
                <div className="mb-3">
                  <span className="inline-block text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-md uppercase" style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>
                    Featured Event
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3" style={{ color: 'var(--text)' }}>
                  {selectedMatch.team_a}{" "}
                  <span className="font-normal text-2xl mx-1" style={{ color: 'var(--muted)' }}>vs</span>{" "}
                  {selectedMatch.team_b}
                </h2>
                <p className="text-sm md:text-base leading-relaxed mb-7 line-clamp-3" style={{ color: 'var(--muted)' }}>
                  {selectedMatch.description || "Experience the thrill of live cricket. Book your seats now for an unforgettable match-day experience."}
                </p>
                <div className="space-y-2.5 pt-5 mb-7" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2.5 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <CalendarIcon />
                    {new Date(selectedMatch.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {getStadium(selectedMatch.stadium_id) && (
                    <div className="flex items-center gap-2.5 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      <LocationIcon />
                      {getStadium(selectedMatch.stadium_id).name}, {getStadium(selectedMatch.stadium_id).city}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBookNow}
                  className="book-btn mt-auto flex items-center justify-center w-full md:w-auto py-3.5 px-8 rounded-lg font-semibold text-[15px]"
                  style={{ background: 'var(--primary)', color: 'var(--bg)' }}
                >
                  Book Tickets Now
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        {matches.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Upcoming Fixtures</h3>
            </div>
            <div className="slider-container flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
              {matches.map((match) => {
                const isSelected = selectedMatch?.id === match.id;
                const stadium = getStadium(match.stadium_id);
                return (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className={`match-card group flex-none w-[270px] snap-start rounded-xl cursor-pointer overflow-hidden flex flex-col ${isSelected ? "match-card--selected" : ""}`}
                    style={{ background: 'var(--card-bg)', border: isSelected ? undefined : '1px solid var(--border)' }}
                  >
                    <div className="h-36 w-full overflow-hidden relative" style={{ background: 'var(--surface-muted)' }}>
                      <img src={match.image_url || DEFAULT_IMAGE} className="match-thumb w-full h-full object-cover" alt="Thumbnail" />
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide" style={{ background: 'var(--primary)', color: 'var(--bg)' }}>
                          Selected
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h4 className="text-base font-bold mb-1 leading-tight" style={{ color: 'var(--text)' }}>
                        {match.team_a}{" "}
                        <span className="font-normal text-sm" style={{ color: 'var(--muted)' }}>vs</span>{" "}
                        {match.team_b}
                      </h4>
                      <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--muted)' }}>
                        {match.description || "Join the excitement and cheer for your favorite team."}
                      </p>
                      <div className="mt-auto space-y-1.5 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                          <CalendarIcon />
                          {new Date(match.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </div>
                        {stadium && (
                          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            <LocationIcon />
                            <span className="truncate">{stadium.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}