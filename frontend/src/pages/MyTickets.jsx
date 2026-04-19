import React, { useState, useEffect } from 'react';
import { backendAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const CalendarIcon = () => (
  <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await backendAPI.get('/bookings/my-tickets');
                setTickets(response.data);
            } catch (err) {
                setError('Failed to load tickets. Please log in again.');
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleDownloadPDF = async (ticket) => {
        setDownloadingId(ticket.ticket_id);
        try {
            const ticketElement = document.getElementById(`ticket-${ticket.ticket_id}`);
            if (!ticketElement) throw new Error("Could not find the ticket on the screen.");
            const btn = ticketElement.querySelector('.download-btn');
            if (btn) btn.style.display = 'none';
            await new Promise(resolve => setTimeout(resolve, 100));
            const dataUrl = await toPng(ticketElement, { quality: 1, pixelRatio: 2, backgroundColor: '#18181b' });
            if (btn) btn.style.display = 'flex';
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (ticketElement.offsetHeight * pdfWidth) / ticketElement.offsetWidth;
            pdf.addImage(dataUrl, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`SecureSeat_Ticket_${ticket.ticket_id}.pdf`);
        } catch (err) {
            console.error("PDF Error:", err);
            alert(`PDF Error: ${err.message}`);
        } finally {
            setDownloadingId(null);
            const ticketElement = document.getElementById(`ticket-${ticket.ticket_id}`);
            if (ticketElement) {
                const btn = ticketElement.querySelector('.download-btn');
                if (btn) btn.style.display = 'flex';
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[85vh] text-base" style={{ color: 'var(--muted)', background: 'var(--bg)' }}>
            <div className="w-6 h-6 border-[3px] rounded-full animate-spin mr-3" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--text)' }} />
            Locating your tickets...
        </div>
    );

    if (error) return (
        <div className="min-h-[85vh] flex justify-center pt-20 px-4" style={{ background: 'var(--bg)' }}>
            <div className="px-6 py-4 rounded-lg text-center" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="font-semibold">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-[85vh] pb-20 pt-8 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

            {/* Header */}
            <header className="max-w-5xl mx-auto mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3"
                      style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                        🎟️ Digital Wallet
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>My Tickets</h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto">
                {tickets.length === 0 ? (
                    <div className="rounded-xl p-14 text-center flex flex-col items-center border-dashed" style={{ background: 'var(--card-bg)', border: '2px dashed var(--border)' }}>
                        <svg className="w-14 h-14 mb-3" style={{ color: 'var(--muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <h3 className="text-xl font-bold mb-1.5" style={{ color: 'var(--text)' }}>No Tickets Found</h3>
                        <p className="mb-6 max-w-md text-sm" style={{ color: 'var(--muted)' }}>You haven't booked any matches yet.</p>
                        <Link to="/" className="font-semibold py-2.5 px-6 rounded-lg transition-all hover:opacity-90 inline-block"
                          style={{ background: 'var(--primary)', color: 'var(--bg)' }}>
                            Browse Matches
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {tickets.map(ticket => (
                            <div key={ticket.ticket_id} id={`ticket-${ticket.ticket_id}`}
                                className="rounded-xl flex flex-col md:flex-row overflow-hidden relative group transition-shadow duration-300"
                                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>

                                {/* Left: Details */}
                                <div className="p-0 md:w-[70%] flex flex-col relative" style={{ background: 'var(--card-bg)' }}>
                                    {/* Top Bar */}
                                    <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)' }}>
                                        <div className="flex items-center gap-2.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide`}
                                              style={{
                                                background: ticket.status === 'Valid' ? 'rgba(34,197,94,0.08)' : 'var(--surface-muted)',
                                                color: ticket.status === 'Valid' ? 'var(--success)' : 'var(--muted)',
                                                border: ticket.status === 'Valid' ? '1px solid rgba(34,197,94,0.2)' : '1px solid var(--border)',
                                              }}>
                                                {ticket.status === 'Valid' && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />}
                                                {ticket.status}
                                            </span>
                                            {ticket.tier_name === 'VIP' && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide"
                                                  style={{ background: 'rgba(234,179,8,0.08)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)' }}>
                                                    ★ VIP PASS
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--muted)' }}>
                                            SECURESEAT // #{String(ticket.ticket_id).padStart(6, '0')}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-grow flex flex-col justify-center">
                                        <div className="mb-6">
                                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none" style={{ color: 'var(--text)' }}>
                                                {ticket.team_a} <span className="font-normal text-xl md:text-3xl italic mx-1" style={{ color: 'var(--accent)' }}>vs</span> {ticket.team_b}
                                            </h3>
                                        </div>

                                        {/* Data Grid */}
                                        <div className="grid grid-cols-4 mb-6 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                                            {[
                                                { label: 'Stand', value: ticket.stand_name },
                                                { label: 'Tier', value: ticket.tier_name, isVip: ticket.tier_name === 'VIP' },
                                                { label: 'Block', value: ticket.block_name },
                                                { label: 'Row / Seat', value: `${ticket.row_id}-${ticket.seat_number}`, highlight: true },
                                            ].map((item, i) => (
                                                <div key={item.label} className="p-3 text-center" style={{
                                                    background: item.highlight ? 'rgba(59,130,246,0.06)' : 'var(--surface-muted)',
                                                    borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                                                }}>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5 font-mono" style={{ color: item.highlight ? 'var(--accent)' : 'var(--muted)' }}>{item.label}</p>
                                                    <p className={`text-sm font-bold truncate ${item.highlight ? 'text-base' : ''}`}
                                                      style={{ color: item.isVip ? '#eab308' : item.highlight ? 'var(--accent)' : 'var(--text)' }}>
                                                        {item.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Venue & Date */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
                                                    <CalendarIcon />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest mb-0" style={{ color: 'var(--muted)' }}>Date & Time</p>
                                                    <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text)' }}>
                                                        {new Date(ticket.match_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                                                        <br /><span className="font-normal" style={{ color: 'var(--text-secondary)' }}>{new Date(ticket.match_date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
                                                    <LocationIcon />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest mb-0" style={{ color: 'var(--muted)' }}>Venue</p>
                                                    <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text)' }}>{ticket.stadium_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Barcode Stub */}
                                <div className="md:w-[30%] relative flex flex-col justify-between items-center p-6 overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                                    {/* Watermark */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                                        <span className="text-5xl font-black transform -rotate-90 whitespace-nowrap tracking-widest" style={{ color: 'var(--text)' }}>SECURESEAT</span>
                                    </div>
                                    {/* Perforated edge */}
                                    <div className="hidden md:block absolute top-0 left-0 w-px h-full border-l-2 border-dashed" style={{ borderColor: 'var(--border)' }} />
                                    <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8 rounded-full z-10" style={{ background: 'var(--bg)' }} />
                                    <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 rounded-full z-10" style={{ background: 'var(--bg)' }} />

                                    {/* Stub content */}
                                    <div className="text-center w-full relative z-10 pt-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5 font-mono" style={{ color: 'var(--muted)' }}>Scan at Gate</p>
                                        <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>Have this ready for security</p>

                                        {/* Barcode */}
                                        <div className="w-full h-20 rounded-lg mb-2 flex items-center justify-between px-2.5 py-2 opacity-90" style={{ background: '#fff' }}>
                                            {[...Array(24)].map((_, i) => (
                                                <div key={i} style={{ background: '#18181b', borderRadius: '1px',
                                                    width: i % 7 === 0 ? '6px' : i % 5 === 0 ? '4px' : i % 3 === 0 ? '3px' : '2px',
                                                    height: i % 7 === 0 ? '100%' : i % 5 === 0 ? '100%' : i % 3 === 0 ? '80%' : '90%',
                                                }} />
                                            ))}
                                        </div>

                                        <p className="text-xl font-black tracking-[0.25em] font-mono mb-6" style={{ color: 'var(--text)' }}>
                                            {String(ticket.ticket_id).padStart(8, '0')}
                                        </p>
                                    </div>

                                    {/* Download */}
                                    <div className="w-full relative z-10">
                                        <button onClick={() => handleDownloadPDF(ticket)} disabled={downloadingId === ticket.ticket_id}
                                            className="download-btn w-full font-semibold py-3.5 px-4 rounded-lg flex items-center justify-center transition-all cursor-pointer hover:opacity-90"
                                            style={{ background: 'var(--accent)', color: '#fff' }}>
                                            {downloadingId === ticket.ticket_id ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <><DownloadIcon /> Save as PDF</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyTickets;