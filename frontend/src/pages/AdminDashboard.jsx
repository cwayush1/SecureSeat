import React, { useState } from "react";
import { backendAPI } from "../services/api";
import { getStadium, getAllStadiumEntries } from "../stadiums";

export default function AdminDashboard() {
  const availableStadiums = getAllStadiumEntries();

  const [matchData, setMatchData] = useState({
    team_a: "", team_b: "", stadium_id: "", date: "",
  });
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddMatch = async (e) => {
    e.preventDefault();
    try {
      const stadiumLayout = getStadium(matchData.stadium_id);
      let pricing_tiers = [];
      if (stadiumLayout?.stands) {
        pricing_tiers = stadiumLayout.stands.map((stand) => ({
          stand_id: stand.id, base_price: stand.base,
        }));
      }
      await backendAPI.post("/matches", {
        team_a: matchData.team_a, team_b: matchData.team_b,
        stadium_id: matchData.stadium_id, date: matchData.date, pricing_tiers,
      });
      setMatchData({ team_a: "", team_b: "", stadium_id: "", date: "" });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Error adding match");
    }
  };

  const selectedStadium = matchData.stadium_id ? getStadium(matchData.stadium_id) : null;

  const inputStyle = { background: 'var(--input-bg)', color: 'var(--text)', borderColor: 'var(--border)' };
  const inputClass = "w-full border rounded-lg px-4 py-3.5 font-medium focus:outline-none focus:ring-1 transition-all text-sm";

  return (
    <div className="min-h-[85vh] pb-20 pt-8" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Header */}
      <header className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
          style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Admin Control Panel
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ color: 'var(--text)' }}>
          Admin Dashboard
        </h1>
        <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
          Create matches, configure stadium pricing, and manage event setup.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: Create Match */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--muted)' }}>01 // Create Match</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleAddMatch} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>Team A</label>
                      <input type="text" placeholder="e.g. India" value={matchData.team_a}
                        onChange={(e) => setMatchData({ ...matchData, team_a: e.target.value })} required
                        className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>Team B</label>
                      <input type="text" placeholder="e.g. Australia" value={matchData.team_b}
                        onChange={(e) => setMatchData({ ...matchData, team_b: e.target.value })} required
                        className={inputClass} style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>Stadium</label>
                    <select value={matchData.stadium_id}
                      onChange={(e) => setMatchData({ ...matchData, stadium_id: e.target.value })} required
                      className={`${inputClass} appearance-none cursor-pointer`} style={inputStyle}>
                      <option value="">Select Stadium</option>
                      {availableStadiums.map((s) => (
                        <option key={s.key} value={s.key}>{s.name} — {s.city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>Match Date &amp; Time</label>
                    <input type="datetime-local" value={matchData.date}
                      onChange={(e) => setMatchData({ ...matchData, date: e.target.value })} required
                      className={inputClass} style={inputStyle} />
                  </div>

                  {successMsg && (
                    <div className="flex items-center gap-3 p-3.5 rounded-lg animate-[fadeUp_0.3s_ease-out]"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(34,197,94,0.15)' }}>
                        <svg className="w-4 h-4" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--success)' }}>Match Created</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>Successfully added to the schedule.</p>
                      </div>
                    </div>
                  )}

                  <button type="submit"
                    className="w-full font-semibold py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-1 hover:opacity-90"
                    style={{ background: 'var(--primary)', color: 'var(--bg)' }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Match
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT: Pricing Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-xl overflow-hidden h-full min-h-[520px] flex flex-col" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--muted)' }}>02 // Pricing Preview</h2>
                {selectedStadium && (
                  <span className="flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-md"
                    style={{ color: 'var(--success)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
                    AUTO-CONFIGURED
                  </span>
                )}
              </div>

              <div className="p-6 md:p-8 flex-grow flex flex-col justify-center">
                {!selectedStadium && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <svg className="w-10 h-10 mb-3" style={{ color: 'var(--muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-lg font-bold mb-1.5" style={{ color: 'var(--text)' }}>No Stadium Selected</h3>
                    <p className="max-w-sm text-sm" style={{ color: 'var(--muted)' }}>
                      Select a stadium in Step 1 to preview auto-configured pricing.
                    </p>
                  </div>
                )}

                {selectedStadium && (
                  <div className="animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex items-center gap-3 mb-5 p-3.5 rounded-lg"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(34,197,94,0.15)' }}>
                        <svg className="w-4 h-4" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--success)' }}>Pricing auto-configured</p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--success)' }}>
                          {selectedStadium.name} — {selectedStadium.stands.length} stands detected
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedStadium.stands.map((s) => (
                        <div key={s.id} className="flex items-center justify-between rounded-lg px-4 py-3.5 transition-colors"
                          style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider font-mono mb-0.5" style={{ color: 'var(--muted)' }}>{s.type}</p>
                            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{s.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-mono mb-0.5" style={{ color: 'var(--muted)' }}>BASE PRICE</p>
                            <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>₹{s.base.toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}