declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && typeof window.Razorpay === 'function') {
      resolve(true);
      return;
    }

    // Check if script element is already added to document
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        resolve(typeof window.Razorpay === 'function');
      });
      existingScript.addEventListener('error', () => {
        resolve(false);
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(typeof window.Razorpay === 'function');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout SDK script from https://checkout.razorpay.com/v1/checkout.js');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
