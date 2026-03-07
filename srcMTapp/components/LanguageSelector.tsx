import { useLanguage, LanguageType } from "../contexts/LanguageContext";
import { useTheme, ThemeType } from "../contexts/ThemeContext";
import { useTranslation } from "../data/translations";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import { useState } from "react";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme, getThemeColors } = useTheme();
  const colors = getThemeColors() || {
    background: 'bg-[#FFF5F0]',
    primary: 'bg-[#FF8A65]',
    secondary: 'bg-[#FFB74D]',
    accent: 'bg-[#FFCCBC]',
    text: 'text-[#4A3428]',
    cardBg: 'bg-white/80',
    gradient: 'from-[#FF8A65] via-[#FFB74D] to-[#FF8A65]',
  };
  const t = useTranslation(language);
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: LanguageType; label: string; flag: string }[] = [
    { code: 'en', label: t.english, flag: '🇺🇸' },
    { code: 'es', label: t.spanish, flag: '🇪🇸' },
    { code: 'ru', label: t.russian, flag: '🇷🇺' },
  ];

  const themes: { type: ThemeType; label: string; icon: string }[] = [
    { type: 'day', label: t.day, icon: '🌞' },
    { type: 'dark', label: t.dark, icon: '🌑' },
    { type: 'lightblue', label: t.calm, icon: '💧' },
    { type: 'nature', label: t.nature, icon: '🌿' },
  ];

  const handleLanguageChange = (code: LanguageType) => {
    setLanguage(code);
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="relative">
        {/* Settings Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Language settings"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </motion.div>
        </motion.button>

        {/* Settings Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 left-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden min-w-[220px]"
            >
              {/* Theme Section */}
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-bold opacity-60 mb-2">Theme</p>
                <div className="grid grid-cols-4 gap-2">
                  {themes.map((t) => (
                    <motion.button
                      key={t.type}
                      onClick={() => handleThemeChange(t.type)}
                      className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                        theme === t.type 
                          ? `bg-gradient-to-br ${colors.gradient} scale-105` 
                          : 'bg-gray-100 hover:bg-gray-200 scale-95 opacity-60'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Switch to ${t.label} theme`}
                    >
                      <span className="text-xl">{t.icon}</span>
                      {theme === t.type && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Language Section */}
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-bold opacity-60 mb-1">{t.language}</p>
              </div>
              <div className="p-2">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      language === lang.code
                        ? `bg-gradient-to-br ${colors.gradient} text-white`
                        : 'hover:bg-gray-100'
                    }`}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className={language === lang.code ? '' : 'text-gray-700'}>
                      {lang.label}
                    </span>
                    {language === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop to close dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 -z-10"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}