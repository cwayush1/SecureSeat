import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { backendAPI } from '../services/api';

const CameraIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Checkout = () => {
    const { matchId, seatId, tierName } = useParams();
    const navigate = useNavigate();
    const webcamRef = useRef(null);

    const [lockStatus, setLockStatus] = useState('Acquiring lock...');
    const [timeLeft, setTimeLeft] = useState(600);
    const [imageSrc, setImageSrc] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(null);

    useEffect(() => {
        const lockSeat = async () => {
            try {
                await backendAPI.post('/bookings/lock-seat', { matchId, seatId });
                setLockStatus('Seat Locked! You have 10 minutes to complete checkout.');
            } catch (error) {
                console.error(error);
                setLockStatus(error.response?.data?.message || 'Failed to lock seat.');
                setTimeLeft(0);
            }
        };
        lockSeat();
    }, [matchId, seatId]);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (lockStatus.includes('Locked')) setLockStatus('Time expired. Seat lock released.');
            return;
        }
        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, lockStatus]);

    const capture = useCallback(() => {
        const imageBase64 = webcamRef.current.getScreenshot();
        setImageSrc(imageBase64);
    }, [webcamRef]);

    const handleConfirmBooking = async () => {
        if (!imageSrc) return alert("Please capture your photo for biometric security.");
        setIsBooking(true);
        try {
            const response = await backendAPI.post('/bookings/confirm', { matchId, seatId, tierName, photoBase64: imageSrc });
            setBookingSuccess(response.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Checkout failed.");
        } finally {
            setIsBooking(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const isUrgent = timeLeft > 0 && timeLeft <= 120;

    // Success State
    if (bookingSuccess) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
                <div className="max-w-md w-full rounded-xl p-9 text-center animate-[fadeUp_0.4s_ease-out]" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <svg className="w-16 h-16 mb-5 mx-auto" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 className="text-2xl font-bold tracking-tight mb-3" style={{ color: 'var(--text)' }}>Ticket Confirmed!</h1>
                    <p className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{bookingSuccess}</p>
                    <p className="text-sm mb-8 p-3.5 rounded-lg" style={{ color: 'var(--muted)', background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
                        Your biometric data is now securely encrypted and locked to this ticket.
                    </p>
                    <button onClick={() => navigate('/my-tickets')}
                        className="w-full font-semibold py-3.5 px-6 rounded-lg transition-all cursor-pointer hover:opacity-90"
                        style={{ background: 'var(--primary)', color: 'var(--bg)' }}
                    >
                        View My Tickets
                    </button>
                </div>
            </div>
        );
    }

    // Checkout State
    return (
        <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
            <div className="max-w-3xl mx-auto">
                
                {/* Header & Timer */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Secure Checkout</h2>
                        <p className="font-medium mt-1 text-sm" style={{ color: 'var(--muted)' }}>
                            Completing booking for <span className="font-bold" style={{ color: 'var(--text)' }}>Seat {seatId}</span>
                        </p>
                    </div>
                    <div className={`inline-flex items-center px-3.5 py-2 rounded-lg font-bold font-mono text-sm border transition-colors ${
                        timeLeft === 0 ? '' : isUrgent ? 'animate-pulse' : ''
                    }`} style={{
                        background: timeLeft === 0 ? 'rgba(239,68,68,0.1)' : isUrgent ? 'var(--danger)' : 'var(--surface-muted)',
                        color: timeLeft === 0 ? 'var(--danger)' : isUrgent ? '#fff' : 'var(--text)',
                        borderColor: timeLeft === 0 ? 'rgba(239,68,68,0.2)' : isUrgent ? 'var(--danger)' : 'var(--border)',
                    }}>
                        <ClockIcon />
                        {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
                    </div>
                </div>

                {/* Status */}
                <div className="p-3.5 rounded-lg mb-7 border flex items-center justify-center font-medium text-sm" style={{
                    background: lockStatus.includes('Locked') ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                    borderColor: lockStatus.includes('Locked') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                    color: lockStatus.includes('Locked') ? 'var(--success)' : 'var(--danger)',
                }}>
                    {lockStatus.includes('Locked') && <span className="w-2 h-2 rounded-full mr-2.5 animate-pulse" style={{ background: 'var(--success)' }} />}
                    {lockStatus}
                </div>

                {/* Biometric */}
                {timeLeft > 0 && lockStatus.includes('Locked') && (
                    <div className="rounded-xl p-6 md:p-9 animate-[fadeIn_0.3s_ease-out]" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                        <div className="text-center mb-7">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3" style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>
                                <ShieldIcon />
                            </div>
                            <h3 className="text-xl font-bold mb-1.5" style={{ color: 'var(--text)' }}>Biometric Identity Lock</h3>
                            <p className="max-w-md mx-auto text-sm" style={{ color: 'var(--muted)' }}>
                                Capture your face to prevent scalping and ensure seamless stadium entry.
                            </p>
                        </div>
                        
                        {!imageSrc ? (
                            <div className="max-w-md mx-auto">
                                <div className="relative rounded-xl overflow-hidden shadow-lg mb-5" style={{ background: '#000' }}>
                                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-auto block opacity-90" />
                                </div>
                                <button onClick={capture}
                                    className="w-full font-semibold py-3.5 px-6 rounded-lg transition-all flex items-center justify-center cursor-pointer hover:opacity-90"
                                    style={{ background: 'var(--primary)', color: 'var(--bg)' }}
                                >
                                    <CameraIcon /> Capture Photo
                                </button>
                            </div>
                        ) : (
                            <div className="max-w-md mx-auto animate-[fadeIn_0.2s_ease-out]">
                                <div className="relative rounded-xl overflow-hidden shadow-lg mb-5 border-2" style={{ borderColor: 'var(--border)' }}>
                                    <img src={imageSrc} alt="Captured face" className="w-full h-auto block" />
                                    <div className="absolute bottom-0 left-0 w-full text-xs font-semibold text-center py-1.5 uppercase tracking-wider" style={{ background: 'var(--success)', color: '#fff' }}>
                                        Scan Successful
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setImageSrc(null)}
                                        className="flex-1 font-semibold py-3.5 px-4 rounded-lg transition-colors cursor-pointer"
                                        style={{ background: 'var(--surface-muted)', color: 'var(--text)', border: '1px solid var(--border)' }}
                                    >
                                        Retake
                                    </button>
                                    <button onClick={handleConfirmBooking} disabled={isBooking}
                                        className={`flex-[2] font-semibold py-3.5 px-6 rounded-lg flex items-center justify-center transition-all ${isBooking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
                                        style={{ background: 'var(--success)', color: '#fff' }}
                                    >
                                        {isBooking ? (
                                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Processing...</>
                                        ) : (
                                            <><ShieldIcon /> Confirm & Pay</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scanline {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(300px); }
                    100% { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Checkout;