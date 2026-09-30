import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('skillorbit_cart') || '[]'),
  coupon: null, // { code: string, discountPercentage: number }

  addToCart: (course) => {
    const { items } = get();
    if (!items.find((item) => item._id === course._id)) {
      const updated = [...items, course];
      localStorage.setItem('skillorbit_cart', JSON.stringify(updated));
      set({ items: updated });
    }
  },

  removeFromCart: (courseId) => {
    const { items } = get();
    const updated = items.filter((item) => item._id !== courseId);
    localStorage.setItem('skillorbit_cart', JSON.stringify(updated));
    set({ items: updated });
  },

  clearCart: () => {
    localStorage.removeItem('skillorbit_cart');
    set({ items: [], coupon: null });
  },

  applyCoupon: (coupon) => {
    set({ coupon });
  },

  removeCoupon: () => {
    set({ coupon: null });
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.price || 0), 0);
  },

  getDiscountAmount: () => {
    const { items, coupon, getTotalPrice } = get();
    if (!coupon || !coupon.discountPercentage) return 0;

    // If coupon is tied to a specific course
    if (coupon.courseId) {
      const targetCourseId = coupon.courseId._id
        ? coupon.courseId._id.toString()
        : coupon.courseId.toString();
      const matchedItem = items.find(
        (item) => (item._id ? item._id.toString() : item.toString()) === targetCourseId
      );
      if (matchedItem) {
        return Math.round(((matchedItem.price || 0) * coupon.discountPercentage) / 100);
      }
      return 0; // Not in cart
    }

    // Universal coupon applies to whole cart
    const total = getTotalPrice();
    return Math.round((total * coupon.discountPercentage) / 100);
  },

  getFinalPrice: () => {
    return Math.max(0, get().getTotalPrice() - get().getDiscountAmount());
  },
}));
