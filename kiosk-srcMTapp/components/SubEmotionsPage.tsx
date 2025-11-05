import { useState, useEffect, useRef } from "react";
import { emotions, QuadrantId } from "../data/emotions";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../data/translations";
import { useEmotionTranslation } from "../data/emotionTranslations";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";

interface SubEmotionsPageProps {
  quadrant: QuadrantId;
  onSelectEmotion: (emotion: string) => void;
  onBack: () => void;
}

const quadrantConfig = {
  "high-pleasant": {
    title: "High Energy Pleasant",
    gradient: "from-yellow-400 to-green-400",
    buttonGradient: "from-yellow-400 to-green-500",
    hoverGradient: "hover:from-yellow-500 hover:to-green-600",
  },
  "high-unpleasant": {
    title: "High Energy Unpleasant",
    gradient: "from-red-400 to-orange-400",
    buttonGradient: "from-red-400 to-orange-500",
    hoverGradient: "hover:from-red-500 hover:to-orange-600",
  },
  "low-pleasant": {
    title: "Low Energy Pleasant",
    gradient: "from-green-400 to-blue-400",
    buttonGradient: "from-green-400 to-blue-500",
    hoverGradient: "hover:from-green-500 hover:to-blue-600",
  },
  "low-unpleasant": {
    title: "Low Energy Unpleasant",
    gradient: "from-blue-500 to-purple-500",
    buttonGradient: "from-blue-500 to-purple-600",
    hoverGradient: "hover:from-blue-600 hover:to-purple-700",
  },
};

export function SubEmotionsPage({ quadrant, onSelectEmotion, onBack }: SubEmotionsPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);
  const [clickedEmotion, setClickedEmotion] = useState<string | null>(null);
  const { getThemeColors } = useTheme();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const emotionT = useEmotionTranslation(language);
  const colors = getThemeColors();
  
  const quadrantConfig = {
    "high-pleasant": {
      title: t.highEnergyPleasant.replace('\n', ' '),
      gradient: "from-yellow-400 to-green-400",
      buttonGradient: "from-yellow-400 to-green-500",
      hoverGradient: "hover:from-yellow-500 hover:to-green-600",
    },
    "high-unpleasant": {
      title: t.highEnergyUnpleasant.replace('\n', ' '),
      gradient: "from-red-400 to-orange-400",
      buttonGradient: "from-red-400 to-orange-500",
      hoverGradient: "hover:from-red-500 hover:to-orange-600",
    },
    "low-pleasant": {
      title: t.lowEnergyPleasant.replace('\n', ' '),
      gradient: "from-green-400 to-blue-400",
      buttonGradient: "from-green-400 to-blue-500",
      hoverGradient: "hover:from-green-500 hover:to-blue-600",
    },
    "low-unpleasant": {
      title: t.lowEnergyUnpleasant.replace('\n', ' '),
      gradient: "from-blue-500 to-purple-500",
      buttonGradient: "from-blue-500 to-purple-600",
      hoverGradient: "hover:from-blue-600 hover:to-purple-700",
    },
  };
  
  const config = quadrantConfig[quadrant];
  const emotionList = emotions[quadrant];

  // Bubble animation state
  const [pointerPos, setPointerPos] = useState({ x: -1000, y: -1000 });
  const [animationTargets, setAnimationTargets] = useState<Record<string, { scale: number; opacity: number; brightness: number }>>({});
  const animationFrameRef = useRef<number | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Animation parameters
  const influenceRadius = 200; // pixels
  const opacityMin = 1.0;
  const opacityMax = 1.0;
  const scaleMin = 1.0;
  const scaleMax = 1.08;
  const brightnessMin = 1.0;
  const brightnessMax = 1.15;

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

  // Track pointer position
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        setPointerPos({ x: e.clientX, y: e.clientY });
      } else if (e.touches.length > 0) {
        setPointerPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handlePointerLeave = () => {
      setPointerPos({ x: -1000, y: -1000 });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchend', handlePointerLeave);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchend', handlePointerLeave);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const newTargets: Record<string, { scale: number; opacity: number; brightness: number }> = {};

      emotionList.forEach((emotion) => {
        const button = buttonRefs.current[emotion];
        if (!button) {
          newTargets[emotion] = { scale: scaleMin, opacity: opacityMin, brightness: brightnessMin };
          return;
        }

        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = pointerPos.x - centerX;
        const dy = pointerPos.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < influenceRadius) {
          const influence = 1 - distance / influenceRadius;
          const scale = scaleMin + (scaleMax - scaleMin) * influence;
          const opacity = opacityMin + (opacityMax - opacityMin) * influence;
          const brightness = brightnessMin + (brightnessMax - brightnessMin) * influence;
          newTargets[emotion] = { scale, opacity, brightness };
        } else {
          newTargets[emotion] = { scale: scaleMin, opacity: opacityMin, brightness: brightnessMin };
        }
      });

      setAnimationTargets(newTargets);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [emotionList, pointerPos, influenceRadius, opacityMin, opacityMax, scaleMin, scaleMax, brightnessMin, brightnessMax]);

  // Initialize animation targets
  useEffect(() => {
    const initialTargets: Record<string, { scale: number; opacity: number; brightness: number }> = {};
    emotionList.forEach((emotion) => {
      initialTargets[emotion] = {
        scale: scaleMin,
        opacity: opacityMin,
        brightness: brightnessMin,
      };
    });
    setAnimationTargets(initialTargets);
  }, [emotionList, scaleMin, opacityMin, brightnessMin]);

  return (
    <div className={`min-h-screen ${colors.background} p-6 transition-all duration-500`}>
      <ThemeToggle />
      
      <div className="max-w-6xl mx-auto">
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
            {t.back}
          </motion.button>
          
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`inline-block w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-full mb-4`}
            />
            <h1 className={colors.text}>{config.title}</h1>
            <p className={`${colors.text} opacity-70 mt-2`}>
              {t.tapOneThatResonates}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          <AnimatePresence>
            {emotionList.map((emotion, index) => {
              const isHovered = hoveredEmotion === emotion;
              const isClicked = clickedEmotion === emotion;
              const animTarget = animationTargets[emotion] || { scale: 1, opacity: 1, brightness: 1 };
              
              return (
                <motion.button
                  key={emotion}
                  ref={(el) => (buttonRefs.current[emotion] = el)}
                  onClick={() => handleEmotionClick(emotion)}
                  onMouseEnter={() => setHoveredEmotion(emotion)}
                  onMouseLeave={() => setHoveredEmotion(null)}
                  disabled={isSubmitting}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isClicked ? 1.10 : (selectedEmotion === emotion ? 1.05 : animTarget.scale), 
                    opacity: 1,
                    rotate: isHovered ? (index % 2 === 0 ? 2 : -2) : 0,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    delay: index * 0.02,
                    scale: {
                      duration: isClicked ? 0.3 : 0.05,
                      ease: "linear",
                    },
                    rotate: {
                      duration: 0.3,
                      ease: [0.45, 0, 0.55, 1], // Quadratic easeInOut
                    },
                    opacity: {
                      duration: 0.2,
                      ease: [0.45, 0, 0.55, 1], // Quadratic easeInOut
                    }
                  }}
                  whileTap={{ scale: 1.10 }}
                  className={`
                    relative bg-gradient-to-br ${config.buttonGradient}
                    text-white py-5 px-4 transition-all rounded-[20px]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    overflow-visible
                  `}
                  style={{
                    transformOrigin: "center center",
                    minWidth: "160px",
                    minHeight: "160px",
                    filter: `brightness(${animTarget.brightness})`,
                    boxShadow: animTarget.scale > 1.02
                      ? "0 20px 40px rgba(0,0,0,0.2)" 
                      : "0 10px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  
                  {/* Glow effect on hover - brightens */}
                  <motion.div
                    className="absolute inset-0 bg-white rounded-[20px]"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isHovered ? 0.2 : 0,
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.45, 0, 0.55, 1] // Quadratic easeInOut
                    }}
                    style={{
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
                          ease: [0, 0, 0.58, 1] // Quadratic easeOut
                        }}
                        style={{
                          background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
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
                  />
                  
                  {selectedEmotion === emotion && (
                    <motion.div
                      layoutId="selected-emotion"
                      className="absolute inset-0 bg-white/20 rounded-[20px]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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
                        ease: [0, 0, 0.58, 1], // Quadratic easeOut
                        repeatDelay: 0.2,
                      }}
                      style={{
                        background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
                      }}
                    />
                  )}
                  
                  <span className="relative block z-10">{emotionT[emotion as keyof typeof emotionT]}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-center mt-8 ${colors.text} opacity-60`}
        >
          {t.takeYourTime}
        </motion.p>
      </div>
    </div>
  );
}
