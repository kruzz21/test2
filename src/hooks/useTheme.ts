import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then fall back to system preference
    const stored = localStorage.getItem('theme') as Theme;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored;
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Resolve the actual theme to apply
  const resolveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Apply theme to document
  const applyTheme = (appliedTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(appliedTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        appliedTheme === 'dark' ? '#0f172a' : '#ffffff'
      );
    } else {
      // Create meta theme-color if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = appliedTheme === 'dark' ? '#0f172a' : '#ffffff';
      document.head.appendChild(meta);
    }

    setResolvedTheme(appliedTheme);
  };

  // Set theme and persist to localStorage
  const setThemeWithPersistence = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const resolved = resolveTheme(newTheme);
    applyTheme(resolved);
  };

  // Toggle between light and dark (skips system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setThemeWithPersistence(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    const resolved = resolveTheme(theme);
    applyTheme(resolved);

    // Listen for system theme changes when using system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        const newResolved = getSystemTheme();
        applyTheme(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeWithPersistence,
    toggleTheme,
    isSystemTheme: theme === 'system'
  };
};