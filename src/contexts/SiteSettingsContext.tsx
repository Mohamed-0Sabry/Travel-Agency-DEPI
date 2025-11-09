import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Types for site settings
export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';
export type Currency = '$' | 'EGP';
export type Theme = 'dark' | 'light';

export interface SiteSettings {
  lang: Language;
  direction: Direction;
  currency: Currency;
  theme: Theme;
}

export interface SiteSettingsContextType {
  settings: SiteSettings;
  updateLanguage: (lang: Language) => void;
  updateDirection: (direction: Direction) => void;
  updateCurrency: (currency: Currency) => void;
  updateTheme: (theme: Theme) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

// Default settings
const defaultSettings: SiteSettings = {
  lang: 'en',
  direction: 'ltr',
  currency: '$',
  theme: 'light',
};

// Create context
const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

// Custom hook to use the site settings context
export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

// Provider component
interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider: React.FC<SiteSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('Error parsing saved site settings:', error);
      }
    }
    return defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Update document attributes for CSS styling
    document.documentElement.setAttribute('dir', settings.direction);
    document.documentElement.setAttribute('lang', settings.lang);
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${settings.theme}`);
    
  }, [settings]);

  const updateLanguage = (lang: Language) => {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    setSettings(prev => ({ ...prev, lang, direction }));
  };

  const updateDirection = (direction: Direction) => {
    setSettings(prev => ({ ...prev, direction }));
  };

  const updateCurrency = (currency: Currency) => {
    setSettings(prev => ({ ...prev, currency }));
  };

  const updateTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const contextValue: SiteSettingsContextType = {
    settings,
    updateLanguage,
    updateDirection,
    updateCurrency,
    updateTheme,
    updateSettings,
  };

  return (
    <SiteSettingsContext.Provider value={contextValue}>
      {children}
    </SiteSettingsContext.Provider>
  );
};