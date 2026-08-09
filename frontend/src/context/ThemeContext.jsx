import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [ripple, setRipple] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    let x = window.innerWidth - 80;
    let y = 40;

    if (e && e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    }

    setRipple({ x, y, isTargetDark: theme !== 'dark' });

    setTimeout(() => {
      setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, 150);

    setTimeout(() => {
      setRipple(null);
    }, 600);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
      {ripple && (
        <div
          className="fixed pointer-events-none z-[9999] rounded-full transition-none"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: 'max(150vw, 150vh)',
            height: 'max(150vw, 150vh)',
            backgroundColor: ripple.isTargetDark ? '#08090B' : '#F8FAFC',
            animation: 'themeSpread 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        />
      )}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;
