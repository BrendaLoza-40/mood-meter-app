import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../data/translations";
import { motion } from "framer-motion";

interface MoodMeterPageProps {
  onSelectQuadrant: (quadrant: string) => void;
  onViewAllEmotions?: () => void;
}

export function MoodMeterPage({ onSelectQuadrant, onViewAllEmotions }: MoodMeterPageProps) {
  const { getThemeColors } = useTheme();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const colors = getThemeColors();

  const quadrantData = [
    {
      id: "high-unpleasant",
      title: t.highEnergyUnpleasant,
      gradient: "from-red-400 via-orange-400 to-red-500",
      hoverGradient: "hover:from-red-500 hover:via-orange-500 hover:to-red-600",
      position: "top-left",
    },
    {
      id: "high-pleasant",
      title: t.highEnergyPleasant,
      gradient: "from-yellow-400 via-green-400 to-yellow-500",
      hoverGradient: "hover:from-yellow-500 hover:via-green-500 hover:to-yellow-600",
      position: "top-right",
    },
    {
      id: "low-unpleasant",
      title: t.lowEnergyUnpleasant,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      hoverGradient: "hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600",
      position: "bottom-left",
    },
    {
      id: "low-pleasant",
      title: t.lowEnergyPleasant,
      gradient: "from-green-400 via-teal-400 to-blue-400",
      hoverGradient: "hover:from-green-500 hover:via-teal-500 hover:to-blue-500",
      position: "bottom-right",
    },
  ];

  return (
    <div className={`h-screen ${colors.background} flex flex-col transition-all duration-500 overflow-hidden`}>
      <div className="flex flex-col h-full">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center flex-shrink-0 px-4 pt-4 pb-2"
        >
          <h1 className={`${colors.text} text-2xl md:text-3xl leading-tight mx-auto max-w-4xl`}>{t.howAreYouFeeling}</h1>
        </motion.div>

        <div className="relative flex-1 flex items-center justify-center px-4 md:px-6 pb-4">
          {/* Mood Meter Grid - Full Height Rectangles */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 w-full h-full max-w-7xl">
            {quadrantData.map((quadrant, index) => (
              <motion.button
                key={quadrant.id}
                onClick={() => onSelectQuadrant(quadrant.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative bg-gradient-to-br ${quadrant.gradient} ${quadrant.hoverGradient} rounded-2xl md:rounded-3xl p-6 md:p-12 transition-all duration-300 group overflow-hidden shadow-xl`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl md:rounded-3xl" />
                
                <div className="relative h-full flex flex-col items-center justify-center text-white">
                  <span className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-black opacity-95 whitespace-pre-line text-center leading-tight">{quadrant.title}</span>
                </div>
                
                {/* Subtle pulse animation */}
                <motion.div
                  className="absolute inset-0 bg-white rounded-2xl md:rounded-3xl"
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

        {/* View All Emotions Button */}
        {onViewAllEmotions && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="text-center pb-4 px-6 flex-shrink-0"
          >
            <motion.button
              onClick={onViewAllEmotions}
              className={`px-8 py-4 bg-gradient-to-r ${colors.gradient} ${colors.text} rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.seeAllEmotions}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}