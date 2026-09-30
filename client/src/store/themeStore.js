import { create } from 'zustand';

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem('skillorbit_theme') || 'dark',

  initTheme: () => {
    const savedTheme = localStorage.getItem('skillorbit_theme') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: savedTheme });
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('skillorbit_theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    set({ theme: newTheme });
  },
}));
