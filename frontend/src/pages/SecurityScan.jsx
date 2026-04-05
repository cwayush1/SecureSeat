import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { backendAPI, aiAPI } from '../services/api';

const SecurityScan = () => {
    const [ticketId, setTicketId] = useState('');
    const [ticketData, setTicketData] = useState(null);
    const [liveImage, setLiveImage] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const webcamRef = useRef(null);

    // Step 1: Security guard types/scans the ticket ID
    const handleLookupTicket = async (e) => {
        e.preventDefault();
        try {
            const res = await backendAPI.get(`/security/ticket/${ticketId}`);
            setTicketData(res.data);
            setLiveImage(null);
            setVerificationResult(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Ticket not found');
            setTicketData(null);
        }
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setLiveImage(imageSrc);
    }, [webcamRef]);

    // Step 2: Send live photo and stored database vector to Python AI
    const handleVerify = async () => {
        setIsProcessing(true);
        try {
            // Parse the vector string from PostgreSQL back into a JavaScript array
            const storedEmbedding = JSON.parse(ticketData.face_embedding);

            const res = await aiAPI.post('/verify-face', {
                live_image_base64: liveImage,
                stored_embedding: storedEmbedding
            });

            setVerificationResult(res.data);
        } catch (error) {
            alert('AI Verification failed. Ensure the face is clearly visible.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: 'red' }}>🛡️ Security Checkpoint</h2>
            
            <form onSubmit={handleLookupTicket} style={{ marginBottom: '20px' }}>
                <input 
                    type="number" 
                    placeholder="Enter Ticket ID" 
                    value={ticketId} 
                    onChange={(e) => setTicketId(e.target.value)}
                    required
                    style={{ padding: '10px', width: '200px', marginRight: '10px' }}
                />
                <button type="submit" className="btn-primary">Lookup Ticket</button>
            </form>

            {ticketData && (
                <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
                    <h3>Ticket Valid for: {ticketData.user_name}</h3>
                    <p>Seat: {ticketData.seat_id} | Status: {ticketData.status}</p>

                    {!liveImage ? (
                        <>
                            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: '100%', borderRadius: '8px' }} />
                            <button onClick={capture} className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>📸 Capture Live Face</button>
                        </>
                    ) : (
                        <>
                            <img src={liveImage} alt="Live Capture" style={{ width: '100%', borderRadius: '8px' }} />
                            <button onClick={() => setLiveImage(null)} className="btn-secondary" style={{ marginTop: '10px', marginRight: '10px' }}>Retake</button>
                            <button onClick={handleVerify} disabled={isProcessing} className="btn-primary">
                                {isProcessing ? 'Analyzing AI Biometrics...' : 'Verify Identity'}
                            </button>
                        </>
                    )}

                    {verificationResult && (
                        <div style={{ marginTop: '20px', padding: '20px', borderRadius: '8px', color: '#fff', backgroundColor: verificationResult.match ? 'green' : 'red' }}>
                            <h1>{verificationResult.match ? '✅ MATCH APPROVED' : '❌ MATCH DENIED'}</h1>
                            <p>Similarity Score: {(verificationResult.similarity_score * 100).toFixed(2)}%</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SecurityScan;