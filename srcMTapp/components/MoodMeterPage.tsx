import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

interface MoodMeterPageProps {
  onSelectQuadrant: (quadrant: string) => void;
  onSeeAllEmotions?: () => void;
  onBack?: () => void;
}

const quadrantData = [
  {
    id: "high-unpleasant",
    title: "High Energy",
    subtitle: "Unpleasant",
    gradient: "from-red-400 via-orange-400 to-red-500",
    hoverGradient: "hover:from-red-500 hover:via-orange-500 hover:to-red-600",
    position: "top-left",
  },
  {
    id: "high-pleasant",
    title: "High Energy",
    subtitle: "Pleasant",
    gradient: "from-yellow-400 via-green-400 to-yellow-500",
    hoverGradient: "hover:from-yellow-500 hover:via-green-500 hover:to-yellow-600",
    position: "top-right",
  },
  {
    id: "low-unpleasant",
    title: "Low Energy",
    subtitle: "Unpleasant",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    hoverGradient: "hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600",
    position: "bottom-left",
  },
  {
    id: "low-pleasant",
    title: "Low Energy",
    subtitle: "Pleasant",
    gradient: "from-green-400 via-teal-400 to-blue-400",
    hoverGradient: "hover:from-green-500 hover:via-teal-500 hover:to-blue-500",
    position: "bottom-right",
  },
];

export function MoodMeterPage({ onSelectQuadrant, onSeeAllEmotions, onBack }: MoodMeterPageProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();

  return (
    <div className={`min-h-screen ${colors.background} flex flex-col items-center justify-center px-4 py-6 transition-all duration-500 relative`}>
      {onBack && (
        <div className="fixed top-4 left-4 z-50">
          <motion.button
            onClick={onBack}
            className={`flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-4 shadow-lg ${colors.text} opacity-90 hover:opacity-100 transition-opacity font-bold text-2xl`}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-10 h-10 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>
        </div>
      )}
      <ThemeToggle />

      {/* See All Emotions - Themed Side Button */}
      {onSeeAllEmotions && (
        <motion.button
          onClick={onSeeAllEmotions}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed right-6 top-1/2 -translate-y-1/2 ${colors.primary} text-white px-6 py-8 rounded-l-3xl shadow-2xl z-10 flex flex-col items-center gap-3 transition-all duration-300`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div className="writing-mode-vertical text-center whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
            See All
          </div>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      )}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className={`${colors.text} opacity-70 text-5xl`}>
            Select the area that best describes your current state
          </p>
        </motion.div>

        <div className="relative w-full mx-auto px-48">
          {/* Mood Meter Grid */}
          <div className="grid grid-cols-2 gap-6" style={{ aspectRatio: '2.5/1' }}>
            {quadrantData.map((quadrant, index) => (
              <motion.button
                key={quadrant.id}
                onClick={() => onSelectQuadrant(quadrant.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative bg-gradient-to-br ${quadrant.gradient} ${quadrant.hoverGradient} rounded-3xl p-16 transition-all duration-300 group overflow-hidden shadow-xl`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl" />
                
                <div className="relative h-full flex flex-col items-center justify-center text-white space-y-4">
                  <span className="text-5xl font-bold opacity-90">{quadrant.title}</span>
                  <span className="text-4xl font-semibold">{quadrant.subtitle}</span>
                </div>
                
                {/* Subtle pulse animation */}
                <motion.div
                  className="absolute inset-0 bg-white rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`text-center mt-8 ${colors.text} opacity-60 text-5xl font-semibold`}
        >
          Tap any quadrant to explore specific emotions
        </motion.p>
      </motion.div>
    </div>
  );
}
