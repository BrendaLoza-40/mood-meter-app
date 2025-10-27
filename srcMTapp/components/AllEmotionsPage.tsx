import { useState } from "react";
import { emotions } from "../data/emotions";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

interface AllEmotionsPageProps {
  onSelectEmotion: (emotion: string) => void;
  onBack: () => void;
}

// Generate square puzzle piece clip paths with tabs and blanks
const getPuzzlePieceClipPath = (index: number) => {
  const puzzlePieces = [
    // Top tab, right blank, bottom blank, left tab
    "polygon(0% 0%, 35% 0%, 38% -8%, 42% -8%, 45% 0%, 100% 0%, 108% 35%, 108% 42%, 100% 45%, 100% 100%, 65% 100%, 62% 108%, 58% 108%, 55% 100%, 0% 100%, -8% 65%, -8% 58%, 0% 55%, 0% 0%)",
    // Top blank, right tab, bottom tab, left blank
    "polygon(0% 0%, 35% 0%, 35% -8%, 42% -8%, 42% 0%, 100% 0%, 100% 35%, 108% 38%, 108% 42%, 100% 45%, 100% 100%, 65% 100%, 62% 108%, 58% 108%, 55% 100%, 0% 100%, 0% 65%, -8% 62%, -8% 58%, 0% 55%, 0% 0%)",
    // Top tab, right tab, bottom blank, left blank  
    "polygon(0% 0%, 35% 0%, 38% -8%, 42% -8%, 45% 0%, 100% 0%, 100% 35%, 108% 38%, 108% 42%, 100% 45%, 100% 100%, 65% 100%, 65% 108%, 58% 108%, 58% 100%, 0% 100%, 0% 65%, -8% 65%, -8% 58%, 0% 58%, 0% 0%)",
    // Top blank, right blank, bottom tab, left tab
    "polygon(0% 0%, 35% 0%, 35% -8%, 42% -8%, 42% 0%, 100% 0%, 108% 35%, 108% 42%, 100% 45%, 100% 100%, 65% 100%, 62% 108%, 58% 108%, 55% 100%, 0% 100%, -8% 65%, -8% 58%, 0% 55%, 0% 0%)",
    // All tabs
    "polygon(0% 0%, 35% 0%, 38% -8%, 42% -8%, 45% 0%, 100% 0%, 100% 35%, 108% 38%, 108% 42%, 100% 45%, 100% 100%, 65% 100%, 62% 108%, 58% 108%, 55% 100%, 0% 100%, -8% 65%, -8% 58%, 0% 55%, 0% 0%)",
    // All blanks
    "polygon(0% 0%, 35% 0%, 35% -8%, 42% -8%, 42% 0%, 100% 0%, 108% 35%, 108% 42%, 100% 45%, 100% 100%, 65% 100%, 65% 108%, 58% 108%, 58% 100%, 0% 100%, 0% 65%, -8% 65%, -8% 58%, 0% 58%, 0% 0%)",
  ];
  return puzzlePieces[index % puzzlePieces.length];
};

export function AllEmotionsPage({ onSelectEmotion, onBack }: AllEmotionsPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);
  const [clickedEmotion, setClickedEmotion] = useState<string | null>(null);
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();

  const handleEmotionClick = async (emotion: string) => {
    if (isSubmitting) return; // Protection against excess tapping
    
    setClickedEmotion(emotion);
    setSelectedEmotion(emotion);
    setIsSubmitting(true);
    
    // Brief delay to show click pulse animation
    setTimeout(() => {
      setClickedEmotion(null);
    }, 300);
    
    // Navigate after animation
    setTimeout(() => {
      onSelectEmotion(emotion);
      setIsSubmitting(false);
    }, 500);
  };

  // Category configurations
  const categories = [
    {
      id: "high-pleasant" as const,
      title: "High Energy Pleasant",
      emotions: emotions["high-pleasant"],
      gradient: "from-yellow-400 to-green-500",
      hoverGradient: "hover:from-yellow-500 hover:to-green-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-green-50",
    },
    {
      id: "high-unpleasant" as const,
      title: "High Energy Unpleasant",
      emotions: emotions["high-unpleasant"],
      gradient: "from-red-400 to-orange-500",
      hoverGradient: "hover:from-red-500 hover:to-orange-600",
      bgColor: "bg-gradient-to-br from-red-50 to-orange-50",
    },
    {
      id: "low-pleasant" as const,
      title: "Low Energy Pleasant",
      emotions: emotions["low-pleasant"],
      gradient: "from-green-400 to-blue-500",
      hoverGradient: "hover:from-green-500 hover:to-blue-600",
      bgColor: "bg-gradient-to-br from-green-50 to-blue-50",
    },
    {
      id: "low-unpleasant" as const,
      title: "Low Energy Unpleasant",
      emotions: emotions["low-unpleasant"],
      gradient: "from-blue-500 to-purple-600",
      hoverGradient: "hover:from-blue-600 hover:to-purple-700",
      bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
    },
  ];

  return (
    <div className={`min-h-screen ${colors.background} p-6 transition-all duration-500`}>
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.button
            onClick={onBack}
            disabled={isSubmitting}
            className={`flex items-center gap-2 ${colors.text} opacity-70 hover:opacity-100 transition-opacity mb-6 disabled:opacity-50`}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>
          
          <div className="text-center">
            <h1 className={colors.text}>All Emotions</h1>
            <p className={`${colors.text} opacity-70 mt-2`}>
              Organized by energy level and pleasantness
            </p>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + categoryIndex * 0.1 }}
              className={`${category.bgColor} rounded-3xl p-6 shadow-lg`}
            >
              <h2 className={`${colors.text} mb-6 text-center`}>{category.title}</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <AnimatePresence>
                  {category.emotions.map((emotion, index) => {
                    const puzzleClipPath = getPuzzlePieceClipPath(index);
                    const isHovered = hoveredEmotion === emotion;
                    const isClicked = clickedEmotion === emotion;
                    const globalIndex = categoryIndex * 25 + index;

                    return (
                      <motion.button
                        key={emotion}
                        onClick={() => handleEmotionClick(emotion)}
                        onMouseEnter={() => setHoveredEmotion(emotion)}
                        onMouseLeave={() => setHoveredEmotion(null)}
                        disabled={isSubmitting}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: isClicked ? 1.10 : (selectedEmotion === emotion ? 1.05 : (isHovered ? 1.05 : 1)), 
                          opacity: 1,
                          rotate: isHovered ? (index % 2 === 0 ? 2 : -2) : 0,
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          delay: globalIndex * 0.01,
                          scale: {
                            duration: isClicked ? 0.3 : (isHovered ? 0.3 : 0.25),
                            ease: isClicked ? "easeOut" : (isHovered ? [0.33, 1, 0.68, 1] : "easeIn"),
                          },
                          rotate: {
                            duration: 0.3,
                            ease: [0.33, 1, 0.68, 1],
                          },
                          opacity: {
                            duration: 0.2,
                          }
                        }}
                        whileHover={{ y: -6 }}
                        whileTap={{ scale: 1.10 }}
                        className={`
                          relative bg-gradient-to-br ${category.gradient}
                          text-white py-5 px-4 transition-all rounded-[20px]
                          disabled:opacity-50 disabled:cursor-not-allowed
                          overflow-visible
                        `}
                        style={{
                          transformOrigin: "center center",
                          clipPath: isHovered || isClicked ? puzzleClipPath : "none",
                          minWidth: "160px",
                          minHeight: "160px",
                          boxShadow: isHovered 
                            ? "0 20px 40px rgba(0,0,0,0.2), inset 0 1px 3px rgba(0,0,0,0.1)" 
                            : "0 10px 20px rgba(0,0,0,0.15), inset 0 1px 2px rgba(0,0,0,0.05)",
                        }}
                      >
                        {/* Inner shadow for depth (default state) */}
                        <div 
                          className="absolute inset-0 pointer-events-none rounded-[20px]"
                          style={{
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                            clipPath: isHovered || isClicked ? puzzleClipPath : "none",
                          }}
                        />
                        
                        {/* Glow effect on hover - brightens */}
                        <motion.div
                          className="absolute inset-0 bg-white rounded-[20px]"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: isHovered ? 0.2 : 0,
                          }}
                          transition={{ 
                            duration: 0.3,
                            ease: [0.33, 1, 0.68, 1]
                          }}
                          style={{
                            clipPath: isHovered ? puzzleClipPath : "none",
                            mixBlendMode: "overlay",
                          }}
                        />
                        
                        {/* Click ripple effect */}
                        <AnimatePresence>
                          {isClicked && (
                            <motion.div
                              className="absolute inset-0 rounded-[20px]"
                              initial={{ scale: 0, opacity: 0.6 }}
                              animate={{ scale: 2, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ 
                                duration: 0.4,
                                ease: "easeOut"
                              }}
                              style={{
                                background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
                                clipPath: puzzleClipPath,
                              }}
                            />
                          )}
                        </AnimatePresence>
                        
                        {/* Color accent brightens on click */}
                        <motion.div
                          className="absolute inset-0 bg-white rounded-[20px]"
                          animate={{ 
                            opacity: isClicked ? 0.3 : 0,
                          }}
                          transition={{ 
                            duration: 0.15,
                          }}
                          style={{
                            clipPath: isClicked ? puzzleClipPath : "none",
                          }}
                        />
                        
                        {selectedEmotion === emotion && (
                          <motion.div
                            layoutId="selected-emotion"
                            className="absolute inset-0 bg-white/20 rounded-[20px]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            style={{
                              clipPath: puzzleClipPath,
                            }}
                          />
                        )}
                        
                        {/* Subtle pulse on hover */}
                        {isHovered && !isClicked && (
                          <motion.div
                            className="absolute inset-0"
                            initial={{ scale: 0.9, opacity: 0.3 }}
                            animate={{ scale: 1.1, opacity: 0 }}
                            transition={{ 
                              duration: 0.8, 
                              repeat: Infinity,
                              ease: "easeOut",
                              repeatDelay: 0.2,
                            }}
                            style={{
                              background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
                              clipPath: puzzleClipPath,
                            }}
                          />
                        )}
                        
                        <span className="relative block z-10">{emotion}</span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.section>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-center mt-12 ${colors.text} opacity-60`}
        >
          100 emotions organized into 4 energy quadrants
        </motion.p>
      </div>
    </div>
  );
}
