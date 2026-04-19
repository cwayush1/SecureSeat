import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { backendAPI, aiAPI } from "../services/api";

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

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

export default function SecurityScan() {
  const [ticketId, setTicketId] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [liveImage, setLiveImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const webcamRef = useRef(null);

  const handleLookupTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await backendAPI.get(`/security/ticket/${ticketId}`);
      setTicketData(res.data);
      setLiveImage(null);
      setVerificationResult(null);
    } catch (error) {
      alert(error.response?.data?.message || "Ticket not found");
      setTicketData(null);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setLiveImage(imageSrc);
  }, [webcamRef]);

  const handleVerify = async () => {
    setIsProcessing(true);
    try {
      const storedEmbedding = JSON.parse(ticketData.face_embedding);
      const res = await aiAPI.post("/verify-face", {
        live_image_base64: liveImage,
        stored_embedding: storedEmbedding,
      });
      setVerificationResult(res.data);
    } catch (error) {
      alert("AI Verification failed. Ensure the face is clearly visible.");
    } finally {
      setIsProcessing(false);
    }
  };

  const inputStyle = { background: 'var(--input-bg)', color: 'var(--text)', borderColor: 'var(--border)' };

  return (
    <div className="min-h-[85vh] pb-20 pt-8" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
          style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Access Control System
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ color: 'var(--text)' }}>
          Security Scanner
        </h1>
        <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
          Verify passenger biometrics against secure database records.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT */}
          <div className="lg:col-span-4 space-y-5">
            {/* Lookup */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div className="p-6">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono mb-4" style={{ color: 'var(--muted)' }}>01 // Ticket Lookup</h2>
                <form onSubmit={handleLookupTicket} className="flex flex-col gap-3">
                  <input type="text" placeholder="Scan or Enter ID..."
                    className="w-full border rounded-lg px-4 py-3.5 font-medium focus:outline-none focus:ring-1 transition-all text-sm"
                    style={inputStyle} value={ticketId} onChange={(e) => setTicketId(e.target.value)} required />
                  <button type="submit"
                    className="w-full font-semibold py-3.5 px-6 rounded-lg transition-all flex items-center justify-center cursor-pointer gap-2 hover:opacity-90"
                    style={{ background: 'var(--primary)', color: 'var(--bg)' }}>
                    <SearchIcon /> Retrieve Record
                  </button>
                </form>
              </div>
            </div>

            {/* Passenger Record */}
            <div className="rounded-xl overflow-hidden transition-all" style={{ background: 'var(--card-bg)', border: ticketData ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
              <div className="p-6">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono mb-4" style={{ color: 'var(--muted)' }}>Passenger Record</h2>
                {ticketData ? (
                  <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider font-mono mb-0.5" style={{ color: 'var(--muted)' }}>Passenger Name</p>
                      <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{ticketData.user_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider font-mono mb-0.5" style={{ color: 'var(--muted)' }}>Assigned Seat</p>
                      <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{ticketData.seat_id}</p>
                    </div>
                    <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide"
                        style={{ background: 'rgba(34,197,94,0.08)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.2)' }}>
                        {ticketData.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
                    Awaiting ticket ID input to retrieve passenger data.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Scanner */}
          <div className="lg:col-span-8">
            <div className="rounded-xl overflow-hidden h-full min-h-[550px] flex flex-col" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div className="p-5 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--muted)' }}>02 // Biometric Scan</h2>
                {ticketData && (
                  <span className="flex items-center gap-2 text-xs font-bold animate-pulse px-2.5 py-1 rounded-md"
                    style={{ color: 'var(--accent)', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    CAMERA LIVE
                  </span>
                )}
              </div>

              <div className="p-6 md:p-8 flex-grow flex flex-col justify-center">
                {/* Empty */}
                {!ticketData && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <svg className="w-10 h-10 mb-3" style={{ color: 'var(--muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Scanner Locked</h3>
                    <p className="max-w-sm text-sm" style={{ color: 'var(--muted)' }}>Retrieve a passenger record in Step 1 to unlock the biometric camera.</p>
                  </div>
                )}

                {/* Camera */}
                {ticketData && !liveImage && (
                  <div className="w-full max-w-2xl mx-auto animate-[fadeIn_0.3s_ease-out]">
                    <div className="relative rounded-xl overflow-hidden shadow-lg mb-5" style={{ background: '#000' }}>
                      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-auto block opacity-90" />
                    </div>
                    <button onClick={capture}
                      className="w-full font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center cursor-pointer text-base hover:opacity-90"
                      style={{ background: 'var(--accent)', color: '#fff' }}>
                      <CameraIcon /> Capture Live Face
                    </button>
                  </div>
                )}

                {/* Captured */}
                {ticketData && liveImage && (
                  <div className="w-full max-w-2xl mx-auto animate-[fadeIn_0.3s_ease-out]">
                    <div className="relative rounded-xl overflow-hidden shadow-lg border-2 mb-5" style={{ borderColor: 'var(--border)' }}>
                      <img src={liveImage} alt="Captured face" className="w-full h-auto block" />
                    </div>
                    <div className="flex gap-3 mb-6">
                      <button onClick={() => setLiveImage(null)}
                        className="flex-1 font-semibold py-3.5 px-4 rounded-lg transition-colors cursor-pointer"
                        style={{ background: 'var(--surface-muted)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                        Retake Photo
                      </button>
                      <button onClick={handleVerify} disabled={isProcessing}
                        className={`flex-[2] font-semibold py-3.5 px-4 rounded-lg flex items-center justify-center transition-all text-base ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
                        style={{ background: 'var(--primary)', color: 'var(--bg)' }}>
                        {isProcessing ? (
                          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Analyzing...</>
                        ) : (
                          <><ShieldIcon /> Verify Identity</>
                        )}
                      </button>
                    </div>

                    {/* Result — keeps semantic green/red for pass/fail */}
                    {verificationResult && (
                      <div className="p-6 rounded-xl border-2 animate-[fadeUp_0.3s_ease-out]" style={{
                        background: verificationResult.match ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
                        borderColor: verificationResult.match ? 'var(--success)' : 'var(--danger)',
                      }}>
                        <div className="flex items-center gap-3 mb-2">
                          {verificationResult.match ? (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                              <svg className="w-6 h-6" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
                              <svg className="w-6 h-6" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          )}
                          <h3 className="text-xl font-bold tracking-tight" style={{ color: verificationResult.match ? 'var(--success)' : 'var(--danger)' }}>
                            {verificationResult.match ? "IDENTITY CONFIRMED" : "IDENTITY MISMATCH"}
                          </h3>
                        </div>
                        <p className="text-sm font-semibold pl-13" style={{ color: verificationResult.match ? 'var(--success)' : 'var(--danger)' }}>
                          Confidence: <span className="font-bold text-base">{(verificationResult.similarity_score * 100).toFixed(2)}%</span>
                        </p>
                      </div>
                    )}
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
