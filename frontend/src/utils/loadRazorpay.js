/**
 * Dynamic loader for Razorpay Checkout JavaScript SDK
 * Ensures window.Razorpay is fully loaded and available before opening modal
 */
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (typeof window !== 'undefined' && window.Razorpay) {
            return resolve(true);
        }

        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(true));
            existingScript.addEventListener('error', () => resolve(false));
            // In case it already loaded
            if (window.Razorpay) return resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            console.log('✓ Razorpay Checkout SDK loaded successfully');
            resolve(true);
        };
        script.onerror = () => {
            console.error('Failed to load Razorpay Checkout SDK script');
            resolve(false);
        };
        document.body.appendChild(script);
    });
};
