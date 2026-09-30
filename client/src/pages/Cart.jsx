import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, X, Check } from 'lucide-react';

const Cart = () => {
  const {
    items,
    removeFromCart,
    getTotalPrice,
    getDiscountAmount,
    getFinalPrice,
    coupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponMsg, setCouponMsg] = useState(null);

  const totalPrice = getTotalPrice();
  const couponDiscount = getDiscountAmount();
  const finalPrice = getFinalPrice();
  const originalTotalPrice = items.reduce(
    (acc, item) => acc + (item.originalPrice || item.price * 1.5),
    0
  );

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setValidatingCoupon(true);
      setCouponMsg(null);
      const res = await apiClient.post('/coupons/validate', {
        code: couponCode.trim(),
        courseIds: items.map((i) => i._id),
      });
      applyCoupon(res.data.coupon);
      setCouponMsg({ type: 'success', text: res.data.message });
      setCouponCode('');
    } catch (err) {
      setCouponMsg({
        type: 'error',
        text: err.response?.data?.message || 'Invalid coupon code',
      });
    } finally {
      setValidatingCoupon(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Shopping Cart</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {items.length} {items.length === 1 ? 'course' : 'courses'} in your cart
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Item List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center gap-4 justify-between shadow-sm"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-24 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-950 flex-shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <Badge variant="indigo" className="text-[10px]">{item.category}</Badge>
                    <Link to={`/courses/${item._id}`}>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate max-w-md transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      By {item.instructor?.name || 'SkillOrbit Expert'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-200 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {item.price === 0 ? 'FREE' : `₹${item.price.toLocaleString()}`}
                    </span>
                    {item.originalPrice > item.price && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                onClick={clearCart}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 space-y-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Summary</h3>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Original Total</span>
                  <span className="line-through text-slate-400 dark:text-slate-500">
                    ₹{originalTotalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Platform Discount</span>
                  <span>-₹{(originalTotalPrice - totalPrice).toLocaleString()}</span>
                </div>

                {coupon && (
                  <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50 p-2 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <span>Coupon ({coupon.code} - {coupon.discountPercentage}%)</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Payable Total</span>
                  <span className="text-lg text-emerald-600 dark:text-emerald-400">
                    ₹{finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" /> Have a Promo Code?
                </span>

                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> {coupon.code} Applied
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[11px] text-rose-500 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME50"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-slate-100 dark:bg-slate-950 text-xs font-mono uppercase rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      loading={validatingCoupon}
                      disabled={!couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </form>
                )}

                {couponMsg && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              <Button
                variant="emerald"
                size="lg"
                onClick={() => {
                  if (!user) {
                    navigate('/login?redirect=/checkout');
                    return;
                  }
                  navigate('/checkout');
                }}
                className="w-full shadow-emerald-500/25"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Guaranteed 256-Bit Secure Checkout
                </p>
                <p className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" />
                  Instant enrollment upon completion
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your cart is currently empty</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Discover courses and boost your skillset today.
          </p>
          <Link to="/courses">
            <Button variant="primary" size="sm">
              Explore Courses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
