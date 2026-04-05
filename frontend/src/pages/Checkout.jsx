import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { backendAPI } from '../services/api';

const Checkout = () => {
    // Grab the parameters we passed in the URL from the SeatMap
    const { matchId, seatId, tierName } = useParams();
    const navigate = useNavigate();
    const webcamRef = useRef(null);

    const [lockStatus, setLockStatus] = useState('Acquiring lock...');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [imageSrc, setImageSrc] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(null);

    // 1. Trigger the Redis Lock immediately when the page loads
    useEffect(() => {
        const lockSeat = async () => {
            try {
                await backendAPI.post('/bookings/lock-seat', { matchId, seatId });
                setLockStatus('Seat Locked! You have 10 minutes to complete checkout.');
            } catch (error) {
                console.error(error);
                setLockStatus(error.response?.data?.message || 'Failed to lock seat. Someone else might be holding it.');
                setTimeLeft(0); // Stop timer if lock fails
            }
        };
        lockSeat();
    }, [matchId, seatId]);

    // 2. Handle the Countdown Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            if (lockStatus.includes('Locked')) {
                setLockStatus('Time expired. Seat lock released.');
            }
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, lockStatus]);

    // 3. Webcam Capture Function
    const capture = useCallback(() => {
        const imageBase64 = webcamRef.current.getScreenshot();
        setImageSrc(imageBase64);
    }, [webcamRef]);

    // 4. Finalize Booking
    const handleConfirmBooking = async () => {
        if (!imageSrc) return alert("Please capture your photo for biometric security.");
        
        setIsBooking(true);
        try {
            const response = await backendAPI.post('/bookings/confirm', {
                matchId,
                seatId,
                tierName,
                photoBase64: imageSrc
            });
            
            setBookingSuccess(response.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Checkout failed.");
        } finally {
            setIsBooking(false);
        }
    };

    // Helper to format seconds into MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // UI Render
    if (bookingSuccess) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1 style={{ color: 'green' }}>✅ Ticket Confirmed!</h1>
                <p>{bookingSuccess}</p>
                <p>Your biometric data is securely locked to this ticket.</p>
                <button onClick={() => navigate('/')}>Return to Matches</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Checkout: Seat {seatId}</h2>
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px', marginBottom: '20px' }}>
                <strong>Status:</strong> {lockStatus}
                <br />
                <strong>Time Remaining:</strong> <span style={{ color: 'red', fontSize: '1.2em', fontWeight: 'bold' }}>{formatTime(timeLeft)}</span>
            </div>

            {timeLeft > 0 && lockStatus.includes('Locked') && (
                <div>
                    <h3>Security Setup: Biometric Lock</h3>
                    <p>Please look at the camera to bind this ticket to your face.</p>
                    
                    {!imageSrc ? (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                style={{ width: '100%', borderRadius: '8px' }}
                            />
                            <button onClick={capture} style={{ marginTop: '10px', width: '100%', padding: '10px' }}>
                                📸 Capture Photo
                            </button>
                        </>
                    ) : (
                        <>
                            <img src={imageSrc} alt="Captured face" style={{ width: '100%', borderRadius: '8px' }} />
                            <button onClick={() => setImageSrc(null)} style={{ marginTop: '10px', marginRight: '10px', padding: '10px' }}>
                                Retake Photo
                            </button>
                            <button 
                                onClick={handleConfirmBooking} 
                                disabled={isBooking}
                                style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
                            >
                                {isBooking ? 'Processing AI Data...' : 'Confirm & Pay'}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Checkout;