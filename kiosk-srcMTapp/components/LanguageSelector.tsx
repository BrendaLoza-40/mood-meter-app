import { useLanguage, LanguageType } from "../contexts/LanguageContext";
import { useTranslation } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const t = useTranslation(language);
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: LanguageType; label: string; flag: string }[] = [
    { code: 'en', label: t.english, flag: '🇺🇸' },
    { code: 'es', label: t.spanish, flag: '🇪🇸' },
    { code: 'ru', label: t.russian, flag: '🇷🇺' },
  ];

  const handleLanguageChange = (code: LanguageType) => {
    setLanguage(code);
    setIsOpen(false);
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

        {/* Language Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 left-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden min-w-[200px]"
            >
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm opacity-60">{t.language}</p>
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
