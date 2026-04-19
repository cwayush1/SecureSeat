import React, { useState } from 'react';
import { backendAPI } from '../services/api';

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Login = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isLoginMode) {
                await backendAPI.post('/auth/login', { email, password });
            } else {
                await backendAPI.post('/auth/register', { name, email, password, role: 'User' });
            }
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
            setIsLoading(false);
        }
    };

    const inputClass = "w-full border rounded-lg pl-12 pr-4 py-3.5 font-medium focus:outline-none focus:ring-1 transition-all text-[15px]";

    return (
        <div className="flex justify-center items-center py-14 px-4">
            <div className="w-full max-w-[420px] rounded-xl p-8 md:p-9 animate-[fadeIn_0.3s_ease-out]" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                
                {/* Header */}
                <div className="text-center mb-7">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg mb-3" style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>
                        <LockIcon />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-1.5" style={{ color: 'var(--text)' }}>
                        {isLoginMode ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>
                        {isLoginMode ? 'Enter your details to access your tickets.' : 'Sign up to start booking premium seats.'}
                    </p>
                </div>
                
                {/* Error */}
                {error && (
                    <div className="px-4 py-3 rounded-lg text-sm font-medium mb-5 flex items-start gap-2.5 animate-[fadeUp_0.2s_ease-out]" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <span>{error}</span>
                    </div>
                )}
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginMode && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>Full Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}><UserIcon /></div>
                                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required
                                    className={inputClass}
                                    style={{ background: 'var(--input-bg)', color: 'var(--text)', borderColor: 'var(--border)' }}
                                />
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>Email Address</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}><MailIcon /></div>
                            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                                className={inputClass}
                                style={{ background: 'var(--input-bg)', color: 'var(--text)', borderColor: 'var(--border)' }}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}><LockIcon /></div>
                            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                                className={inputClass}
                                style={{ background: 'var(--input-bg)', color: 'var(--text)', borderColor: 'var(--border)' }}
                            />
                        </div>
                    </div>
                    
                    <button type="submit" disabled={isLoading}
                        className={`mt-1 w-full font-semibold py-3.5 px-6 rounded-lg flex items-center justify-center transition-all text-[15px] ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
                        }`}
                        style={{ background: 'var(--primary)', color: 'var(--bg)' }}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--bg)', borderTopColor: 'transparent' }} />
                        ) : (
                            isLoginMode ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                {/* Toggle */}
                <div className="mt-6 text-center">
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>
                        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                        <button type="button"
                            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
                            className="font-semibold transition-colors cursor-pointer"
                            style={{ color: 'var(--text)' }}
                        >
                            {isLoginMode ? "Sign up here" : "Sign in here"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;