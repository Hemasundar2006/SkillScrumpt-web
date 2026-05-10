import React, { useState } from 'react';
import api from '../utils/api';

const RazorpayPayment = ({ 
  amount, 
  currency = 'INR', 
  onSuccess, 
  onError,
  buttonText = 'Pay Now',
  className = '' 
}) => {
  const [loading, setLoading] = useState(false);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id || user?.id;

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          throw new Error('Razorpay SDK failed to load. Are you online?');
        }
      }

      // 1. Create order on the backend
      const { data } = await api.post('/payments/create-order', {
        userId: userId,
        currency: currency
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      const { order_id, amount: orderAmount, currency: orderCurrency } = data;

      // 2. Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: orderCurrency,
        name: 'SkillScrumpt',
        description: 'Payment for SkillScrumpt Services',
        image: '/logo.png', // Update with actual logo if available
        order_id: order_id,
        handler: async (response) => {
          // 3. Verify payment on the backend
          try {
            const verificationRes = await api.post('/payments/verify-payment', {
              userId: userId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationRes.data.success) {
              if (onSuccess) onSuccess(verificationRes.data);
            } else {
              throw new Error(verificationRes.data.message || 'Verification failed');
            }
          } catch (error) {
            console.error('Verification Error:', error);
            if (onError) onError(error.message);
          }
        },
        prefill: {
          name: '', // Can be passed as prop
          email: '',
          contact: ''
        },
        notes: {
          address: 'SkillScrumpt Corporate Office'
        },
        theme: {
          color: '#6366f1' // Indigo-500
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            if (onError) onError('Payment cancelled by user');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setLoading(false);
        console.error('Payment Failed:', response.error);
        if (onError) onError(response.error.description);
      });

      rzp.open();
    } catch (error) {
      console.error('Payment Initialization Error:', error);
      if (onError) onError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 ${className}`}
    >
      {loading ? 'Processing...' : buttonText}
    </button>
  );
};

export default RazorpayPayment;
