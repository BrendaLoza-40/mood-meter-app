import { useTheme, ThemeType } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes: { type: ThemeType; label: string; icon: string }[] = [
    { type: 'day', label: 'Day', icon: '🌞' },
    { type: 'dark', label: 'Dark', icon: '🌙' },
    { type: 'lightblue', label: 'Calm', icon: '💧' },
    { type: 'yellow', label: 'Bright', icon: '💛' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex gap-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
        {themes.map((t) => (
          <motion.button
            key={t.type}
            onClick={() => setTheme(t.type)}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              theme === t.type ? 'scale-110' : 'scale-90 opacity-60'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${t.label} theme`}
          >
            {theme === t.type && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative text-2xl">{t.icon}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
