import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Wallet,
  Sparkles,
} from 'lucide-react';

const Checkout = () => {
  const {
    items,
    getTotalPrice,
    getDiscountAmount,
    getFinalPrice,
    coupon: storeCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore();
  const { user, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // razorpay, upi, card
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const finalTotal = getFinalPrice();
  const discountPercent = storeCoupon?.discountPercentage || 0;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    try {
      setValidatingCoupon(true);
      setCouponError('');
      const res = await apiClient.post('/coupons/validate', {
        code: couponInput.trim(),
        courseIds: items.map((i) => i._id),
      });
      applyCoupon(res.data.coupon);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCompletePayment = async () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!items.length) {
      navigate('/courses');
      return;
    }

    try {
      setProcessing(true);
      const courseIds = items.map((item) => item._id);

      // 1. Create Razorpay Order from Backend
      const orderRes = await apiClient.post('/payments/create-order', {
        courseIds,
        discountPercent,
      });

      // If free course (₹0)
      if (orderRes.data.isFree) {
        await apiClient.post('/orders/checkout', {
          courseIds,
          paymentMethod: 'free_enrollment',
        });
        finishSuccessfulOrder();
        return;
      }

      const { keyId, order } = orderRes.data;

      // 2. Open Official Razorpay Checkout Popup
      if (window.Razorpay) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || keyId || 'rzp_test_SVkYHZgMnWC1fP',
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'SkillOrbit Academy',
          description: `Enrollment for ${items.length} master courses`,
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200',
          order_id: order.id,
          handler: async function (response) {
            try {
              // 3. Verify Payment Signature on Backend
              const verifyRes = await apiClient.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseIds,
                totalAmount: finalTotal,
              });

              if (verifyRes.data.success) {
                finishSuccessfulOrder();
              }
            } catch (err) {
              alert(err.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: '9999999999',
          },
          notes: {
            platform: 'SkillOrbit LMS',
          },
          theme: {
            color: '#4f46e5', // SkillOrbit Indigo
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function (response) {
          alert(`Payment Failed: ${response.error.description}`);
          setProcessing(false);
        });
        razorpayInstance.open();
        setProcessing(false);
      } else {
        // Fallback direct checkout if script blocked
        const directRes = await apiClient.post('/orders/checkout', {
          courseIds,
          paymentMethod,
        });
        if (directRes.data.success) {
          finishSuccessfulOrder();
        }
      }
    } catch (err) {
      alert(err.message || 'Checkout failed. Please try again.');
      setProcessing(false);
    }
  };

  const finishSuccessfulOrder = async () => {
    setOrderSuccess(true);
    clearCart();
    await fetchUser();

    // Celebration Confetti
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 },
    });

    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-2xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Payment Verified & Enrolled!</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Your Razorpay transaction was verified successfully. You now have lifetime access to your courses. Redirecting to your dashboard...
        </p>
        <Link to="/dashboard">
          <Button variant="emerald">Go to My Learning Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <Link to="/courses">
          <Button variant="primary">Browse Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Secure Razorpay Checkout</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Complete your payment to start learning instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Payment Method Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payment Method Selector */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Payment Gateway
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Official Razorpay v1.0
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-white shadow-lg shadow-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold">Razorpay Standard</span>
              </div>

              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-white shadow-lg shadow-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <QrCode className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold">Instant UPI / QR</span>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-white shadow-lg shadow-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                <span className="text-xs font-semibold">Cards / NetBanking</span>
              </div>
            </div>

            {/* Gateway Info */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  256-Bit SSL Encrypted Gateway
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">HMAC-SHA256 Verified</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Clicking the button will launch the official Razorpay Checkout popup modal where you can pay seamlessly with Google Pay, PhonePe, Paytm, Debit/Credit Card, or NetBanking.
              </p>
            </div>
          </div>

          {/* Coupon Code Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-sm space-y-2">
            {storeCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Coupon <span className="font-mono">{storeCoupon.code}</span> ({storeCoupon.discountPercentage}% OFF) Applied
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-rose-500 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Coupon Code (e.g. WELCOME50)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 uppercase font-mono"
                />
                <Button type="submit" variant="secondary" size="sm" loading={validatingCoupon}>
                  Apply Code
                </Button>
              </form>
            )}
            {couponError && (
              <p className="text-xs text-rose-500 font-medium">
                {couponError}
              </p>
            )}
          </div>
        </div>

        {/* Right Order Review Card */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Summary</h3>

            {/* Courses items mini list */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-56 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 line-clamp-1 max-w-[200px]">{item.title}</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.price === 0 ? 'FREE' : `₹${item.price.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-3">
                <span>Final Amount</span>
                <span className="text-lg text-emerald-600 dark:text-emerald-400">
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              variant="emerald"
              size="lg"
              loading={processing}
              onClick={handleCompletePayment}
              className="w-full shadow-emerald-500/25"
            >
              <Lock className="w-4 h-4 mr-2" />
              Pay ₹{finalTotal.toLocaleString()} via Razorpay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
