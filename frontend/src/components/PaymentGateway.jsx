import React, { useState } from 'react';
import { backendAPI } from '../services/api';
import { loadRazorpayScript } from '../utils/loadRazorpay';
import FakePaymentModal from './FakePaymentModal';

const PaymentGateway = ({ 
    amount, 
    matchId, 
    seatId, 
    onPaymentSuccess, 
    onPaymentFailure, 
    isLoading,
    user 
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [showSimulatorModal, setShowSimulatorModal] = useState(false);

    // Primary Flow: Genuine Razorpay Checkout Modal
    const handleInitiateRazorpay = async () => {
        setError(null);
        setIsProcessing(true);

        try {
            // 1. Ensure Razorpay Checkout SDK is ready
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded || typeof window.Razorpay === 'undefined') {
                throw new Error('Razorpay Checkout SDK could not be loaded. Please verify your internet connection.');
            }

            // 2. Request backend to create authenticated Razorpay order
            const response = await backendAPI.post('/payments/create-order', {
                matchId,
                seatId,
                amount
            });

            const { orderId, keyId, amount: confirmedAmount, currency } = response.data;
            setCurrentOrderId(orderId);

            // 3. Configure Razorpay Standard Checkout options
            const options = {
                key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Tj6OsWMoq0ifqd',
                amount: Math.round(confirmedAmount * 100), // in paise
                currency: currency || 'INR',
                name: 'SecureSeat • CriceCo',
                description: `Seat ${seatId} • Match #${matchId} Ticket Reservation`,
                image: '/secureseatsmall.png',
                order_id: orderId,
                handler: async function (razorpayResponse) {
                    setIsProcessing(true);
                    try {
                        console.log('✓ Razorpay transaction authorized, verifying signature with backend...');
                        
                        // Send signature to backend for HMAC SHA-256 cryptographic verification
                        const verifyRes = await backendAPI.post('/payments/verify-payment', {
                            razorpay_order_id: razorpayResponse.razorpay_order_id,
                            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                            razorpay_signature: razorpayResponse.razorpay_signature,
                            orderId: razorpayResponse.razorpay_order_id,
                            paymentId: razorpayResponse.razorpay_payment_id,
                            signature: razorpayResponse.razorpay_signature,
                            matchId,
                            seatId,
                            amount: confirmedAmount
                        });

                        console.log('✓ Payment verified by backend successfully:', verifyRes.data);

                        // Signal parent checkout flow
                        onPaymentSuccess({
                            paymentId: verifyRes.data.paymentId, // PostgreSQL DB row ID
                            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                            orderId: razorpayResponse.razorpay_order_id,
                            amount: confirmedAmount,
                            paymentMethod: verifyRes.data.paymentMethod || 'Razorpay'
                        });
                    } catch (verifyErr) {
                        console.error('Server signature verification failed:', verifyErr);
                        setError(verifyErr.response?.data?.message || 'Payment signature verification failed. Please contact support.');
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || ''
                },
                notes: {
                    matchId: String(matchId),
                    seatId: String(seatId)
                },
                theme: {
                    color: '#2563eb' // SecureSeat Blue
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        console.log('Razorpay modal dismissed by user');
                    }
                }
            };

            // 4. Open Razorpay Checkout modal
            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (failureResponse) {
                setIsProcessing(false);
                const failReason = failureResponse.error?.description || 'Transaction declined by payment provider';
                console.error('Razorpay payment failed:', failureResponse.error);
                setError(failReason);

                backendAPI.post('/payments/handle-payment-failure', {
                    orderId: orderId,
                    error: failReason
                }).catch(() => {});

                onPaymentFailure?.(failureResponse.error);
            });

            rzp.open();

        } catch (err) {
            console.error('Error launching Razorpay:', err);
            setError(err.response?.data?.message || err.message || 'Failed to initialize payment gateway.');
            setIsProcessing(false);
        }
    };

    // Secondary Flow: Sandbox Simulator Callback (For local offline testing)
    const handleSimulatorSuccess = async (paymentData) => {
        try {
            const verificationResponse = await backendAPI.post('/payments/verify-payment', {
                orderId: currentOrderId || `order_test_${matchId}_${seatId}_${Date.now()}`,
                paymentId: paymentData.fakePaymentId,
                signature: `fake_sig_${Date.now()}`,
                matchId,
                seatId,
                cardName: paymentData.cardName,
                cardNumber: paymentData.cardNumber,
                cardType: paymentData.cardType,
                expiry: paymentData.expiry,
                cvv: paymentData.cvv,
                amount: amount
            });

            setShowSimulatorModal(false);
            onPaymentSuccess({
                paymentId: verificationResponse.data.paymentId,
                razorpayPaymentId: paymentData.fakePaymentId,
                amount: amount,
                lastFourDigits: paymentData.cardNumber ? paymentData.cardNumber.slice(-4) : '1111'
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Simulator verification failed');
            setShowSimulatorModal(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6 relative overflow-hidden font-['Inter',sans-serif]">
                {/* Decorative brand gradient */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500"></div>
                
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Order Summary
                        </h3>
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-blue-100">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            Razorpay Checkout
                        </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 border-dashed">
                            <div>
                                <span className="text-slate-500 font-medium text-sm block">Total Amount Due</span>
                                <span className="text-xs text-slate-400">Inclusive of all stadium taxes</span>
                            </div>
                            <span className="text-3xl font-black text-slate-900">₹ {amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Match Ref: <span className="font-mono text-slate-700 font-semibold">{matchId}</span></span>
                            <span className="text-slate-500">Seat Number: <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{seatId}</span></span>
                        </div>
                    </div>
                </div>

                {/* Accepted Payment Methods Badge Bar */}
                <div className="mb-6 p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-['JetBrains_Mono']">
                        Accepted Payment Modes
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                            ⚡ UPI / QR (GPay, PhonePe, Paytm)
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                            💳 Debit / Credit Cards (RuPay, Visa, MC)
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                            🏦 NetBanking (All Indian Banks)
                        </span>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <span className="font-semibold block mb-0.5">Payment Issue</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Primary Action Button: Pay with Razorpay */}
                <button
                    onClick={handleInitiateRazorpay}
                    disabled={isProcessing || isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2.5 ${
                        isProcessing || isLoading
                            ? 'bg-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                    }`}
                >
                    {isProcessing || isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Connecting to Razorpay...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Pay ₹{amount.toFixed(2)} with Razorpay
                        </>
                    )}
                </button>

                {/* Security Trust Badges */}
                <div className="flex items-center justify-center gap-3 mt-5 text-slate-400 text-xs font-medium">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        256-bit SSL Encrypted
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <span className="font-bold text-blue-600">Razorpay</span> Official Gateway
                    </span>
                </div>

                {/* Optional Offline Sandbox Simulator Option */}
                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <button
                        type="button"
                        onClick={() => setShowSimulatorModal(true)}
                        className="text-xs text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer transition-colors"
                    >
                        🧪 Offline / Sandbox Test Simulator
                    </button>
                </div>
            </div>

            {/* Offline Sandbox Simulator Modal */}
            {showSimulatorModal && (
                <FakePaymentModal
                    amount={amount}
                    matchId={matchId}
                    seatId={seatId}
                    onSuccess={handleSimulatorSuccess}
                    onFailure={() => setShowSimulatorModal(false)}
                />
            )}
        </>
    );
};

export default PaymentGateway;