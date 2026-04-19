import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStadium } from "../stadiums";
import StadiumViewer from "../components/StadiumViewer";
import { backendAPI } from "../services/api";

const CalendarIcon = () => (
  <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function BookingPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2805&auto=format&fit=crop";

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setIsLoading(true);
        const response = await backendAPI.get("/matches");
        const foundMatch = response.data.find((m) => String(m.id) === String(matchId));
        if (foundMatch) setMatch(foundMatch);
        else setError("Match not found.");
      } catch (err) {
        console.error("Failed to fetch match details", err);
        setError("Failed to load match data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatchDetails();
  }, [matchId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-[3px] rounded-full animate-spin mb-4" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--text)' }} />
        <p className="font-medium" style={{ color: 'var(--muted)' }}>Preparing event details...</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 rounded-xl text-center" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Oops!</h2>
        <p className="mb-6" style={{ color: 'var(--muted)' }}>{error || "Could not load this match."}</p>
        <button onClick={() => navigate("/")}
          className="px-6 py-2.5 rounded-lg font-medium cursor-pointer transition-all hover:opacity-90"
          style={{ background: 'var(--primary)', color: 'var(--bg)' }}
        >
          Back to Matches
        </button>
      </div>
    );
  }

  const stadiumData = getStadium(match.stadium_id);
  const matchLabel = `${match.team_a} vs ${match.team_b} · ${new Date(match.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <div className="mb-6">
        <button onClick={() => navigate("/")}
          className="inline-flex items-center font-medium transition-colors cursor-pointer text-sm"
          style={{ color: 'var(--muted)' }}
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Matches
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-[28vh] md:h-[42vh] rounded-xl overflow-hidden mb-8 group" style={{ background: 'var(--surface-muted)' }}>
        <img src={match.image_url || DEFAULT_IMAGE} alt={`${match.team_a} vs ${match.team_b}`}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-md uppercase tracking-wide mb-3 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live Ticketing Open
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none">
            {match.team_a}{" "}
            <span className="font-normal mx-2 text-2xl md:text-4xl opacity-60">vs</span>{" "}
            {match.team_b}
          </h1>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 rounded-xl p-7" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <h3 className="text-lg font-bold mb-3 tracking-tight" style={{ color: 'var(--text)' }}>About this Match</h3>
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
            {match.description || "The stage is set for an epic clash between these two titans. Secure your seats now to witness the action live."}
          </p>
        </div>
        <div className="rounded-xl p-7 flex flex-col justify-center space-y-6" style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <CalendarIcon />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--muted)' }}>Date & Time</p>
              <p className="text-base font-semibold leading-tight" style={{ color: 'var(--text)' }}>
                {new Date(match.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" })}
                <br />
                <span className="font-normal text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(match.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </p>
            </div>
          </div>
          {stadiumData && (
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <LocationIcon />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--muted)' }}>Venue</p>
                <p className="text-base font-semibold leading-tight" style={{ color: 'var(--text)' }}>
                  {stadiumData.name}<br />
                  <span className="font-normal text-sm" style={{ color: 'var(--text-secondary)' }}>{stadiumData.city}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stadium Map */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Interactive Seat Map</h3>
        <span className="text-xs font-medium hidden sm:block px-3 py-1.5 rounded-md" style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          Select a stand to view blocks
        </span>
      </div>

      {stadiumData ? (
        <div className="relative z-0 p-4 md:p-8 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <StadiumViewer stadiumData={stadiumData} matchLabel={matchLabel} matchId={match.id} />
        </div>
      ) : (
        <div className="rounded-xl p-12 text-center border-dashed" style={{ background: 'var(--card-bg)', border: '2px dashed var(--border)' }}>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>
            Stadium layout not found for ID <span className="font-bold" style={{ color: 'var(--text)' }}>{match.stadium_id}</span>
          </p>
        </div>
      )}
    </div>
  );
}
