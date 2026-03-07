import { useState, useRef, useEffect, useMemo } from "react";
import { emotions, QuadrantId } from "../data/emotions";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../data/translations";
import { useEmotionTranslation } from "../data/emotionTranslations";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AllEmotionsPageProps {
  onSelectEmotion: (emotion: string) => void;
  onBack: () => void;
}

export function AllEmotionsPage({ onSelectEmotion, onBack }: AllEmotionsPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);
  const [clickedEmotion, setClickedEmotion] = useState<string | null>(null);
  const [currentPageNum, setCurrentPageNum] = useState(1); // Track which page of emotions (1 or 2)
  const { getThemeColors } = useTheme();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const emotionT = useEmotionTranslation(language);
  const colors = getThemeColors();

  // Bubble animation state
  const [pointerPos, setPointerPos] = useState({ x: -1000, y: -1000 });
  const [animationTargets, setAnimationTargets] = useState<Record<string, { scale: number; opacity: number; brightness: number }>>({});
  const animationFrameRef = useRef<number>();
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Animation parameters
  const influenceRadius = 200; // pixels
  const opacityMin = 1.0;
  const opacityMax = 1.0;
  const scaleMin = 1.0;
  const scaleMax = 1.08;
  const brightnessMin = 1.0;
  const brightnessMax = 1.15;

  // All emotions in a single array for animation - memoized to prevent recreating on every render
  const allEmotions = useMemo(() => [
    ...emotions["high-pleasant"],
    ...emotions["high-unpleasant"],
    ...emotions["low-pleasant"],
    ...emotions["low-unpleasant"],
  ], []);

  const handleEmotionClick = async (emotion: string) => {
    if (isSubmitting) return; // Protection against excess tapping
    
    setClickedEmotion(emotion);
    setSelectedEmotion(emotion);
    setIsSubmitting(true);
    
    // Instant navigation
    onSelectEmotion(emotion);
    setIsSubmitting(false);
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

      allEmotions.forEach((emotion) => {
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
  }, [pointerPos]);

  // Initialize animation targets - only run once on mount
  useEffect(() => {
    const initialTargets: Record<string, { scale: number; opacity: number; brightness: number }> = {};
    allEmotions.forEach((emotion) => {
      initialTargets[emotion] = {
        scale: scaleMin,
        opacity: opacityMin,
        brightness: brightnessMin,
      };
    });
    setAnimationTargets(initialTargets);
  }, []); // Empty dependency array - only run once on mount

  // Render an emotion button
  const renderEmotionButton = (emotion: string, gradient: string, index: number, isMobile: boolean = false) => {
    const isClicked = clickedEmotion === emotion;
    const isHovered = hoveredEmotion === emotion;
    const animTarget = animationTargets[emotion] || { scale: 1, opacity: 1, brightness: 1 };

    if (isMobile) {
      return (
        <motion.button
          key={emotion}
          ref={(el) => (buttonRefs.current[emotion] = el)}
          onClick={() => handleEmotionClick(emotion)}
          disabled={isSubmitting}
          animate={{ 
            scale: isClicked ? 1.15 : animTarget.scale,
            opacity: 1,
          }}
          transition={{ 
            scale: { duration: 0.2, ease: "easeOut" },
            opacity: { duration: 0.2, ease: "easeOut" }
          }}
          whileTap={{ scale: 1.15 }}
          className={`
            relative bg-gradient-to-br ${gradient}
            text-white text-sm leading-tight p-4 transition-all rounded-2xl
            disabled:opacity-50 disabled:cursor-not-allowed
            aspect-square flex items-center justify-center font-medium
          `}
          style={{
            transformOrigin: "center center",
            filter: `brightness(${animTarget.brightness})`,
            boxShadow: animTarget.scale > 1.02
              ? "0 8px 16px rgba(0,0,0,0.3)" 
              : "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white rounded-2xl"
            animate={{ opacity: isClicked ? 0.3 : 0 }}
            transition={{ duration: 0.2 }}
          />
          
          {selectedEmotion === emotion && (
            <motion.div
              layoutId="selected-emotion-mobile"
              className="absolute inset-0 bg-white/30 rounded-2xl"
              transition={{ duration: 0.2 }}
            />
          )}
          
          <span className="relative block z-10 text-center break-words hyphens-auto leading-tight">
            {emotionT[emotion as keyof typeof emotionT]}
          </span>
        </motion.button>
      );
    }

    // Desktop button
    return (
      <motion.button
        key={emotion}
        ref={(el) => (buttonRefs.current[emotion] = el)}
        onClick={() => handleEmotionClick(emotion)}
        onMouseEnter={() => setHoveredEmotion(emotion)}
        onMouseLeave={() => setHoveredEmotion(null)}
        disabled={isSubmitting}
        animate={{ 
          scale: isClicked ? 1.10 : (selectedEmotion === emotion ? 1.05 : animTarget.scale), 
          opacity: 1,
          rotate: isHovered ? (index % 2 === 0 ? 2 : -2) : 0,
        }}
        transition={{ 
          scale: { duration: 0.2, ease: "easeOut" },
          rotate: { duration: 0.2, ease: "easeOut" },
          opacity: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 1.10 }}
        className={`
          relative bg-gradient-to-br ${gradient}
          text-white p-4 transition-all rounded-2xl
          disabled:opacity-50 disabled:cursor-not-allowed
          overflow-visible aspect-square flex items-center justify-center font-semibold text-sm xl:text-base
        `}
        style={{
          transformOrigin: "center center",
          filter: `brightness(${animTarget.brightness})`,
          boxShadow: animTarget.scale > 1.02
            ? "0 12px 24px rgba(0,0,0,0.25)" 
            : "0 6px 12px rgba(0,0,0,0.2)",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-white rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ mixBlendMode: "overlay" }}
        />
        
        <motion.div
          className="absolute inset-0 bg-white rounded-2xl"
          animate={{ opacity: isClicked ? 0.3 : 0 }}
          transition={{ duration: 0.2 }}
        />
        
        {selectedEmotion === emotion && (
          <motion.div
            layoutId="selected-emotion"
            className="absolute inset-0 bg-white/20 rounded-2xl"
            transition={{ duration: 0.2 }}
          />
        )}
        
        <span className="relative block z-10 text-center leading-tight">
          {emotionT[emotion as keyof typeof emotionT]}
        </span>
      </motion.button>
    );
  };

  return (
    <div className={`h-screen ${colors.background} transition-all duration-500 overflow-hidden flex flex-col`}>
      <div className="max-w-7xl mx-auto h-full flex flex-col w-full">
        {/* Back Button - Floating Overlay */}
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          className="fixed top-3 left-3 z-50"
        >
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className={`flex items-center gap-2 ${colors.text} opacity-70 hover:opacity-100 transition-opacity disabled:opacity-50 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.back}
          </button>
        </motion.div>

        {/* Header - Floating Overlay */}
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="text-center bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
            <h1 className={`${colors.text} font-bold`}>{t.allEmotions} - {currentPageNum}/2</h1>
          </div>
        </motion.div>

        {/* Content - Page 1: High Energy Emotions */}
        {currentPageNum === 1 && (
          <>
            {/* Mobile: Scrollable Grid */}
            <div className="md:hidden grid grid-cols-5 gap-2 p-3 pt-20 pb-24 overflow-y-auto">
              {/* High Energy Pleasant - Yellow/Green */}
              {emotions["high-pleasant"].map((emotion, index) => 
                renderEmotionButton(emotion, "from-yellow-400 via-green-400 to-yellow-500", index, true)
              )}

              {/* High Energy Unpleasant - Red/Orange */}
              {emotions["high-unpleasant"].map((emotion, index) => 
                renderEmotionButton(emotion, "from-red-400 via-orange-400 to-red-500", index, true)
              )}
            </div>

            {/* Desktop: Side by Side Layout */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-8 md:pt-20 md:pb-24 md:px-8 md:h-full">
              {/* Left: High Energy Pleasant */}
              <div className="grid grid-cols-5 gap-2 content-start h-fit">
                {emotions["high-pleasant"].map((emotion, index) => 
                  renderEmotionButton(emotion, "from-yellow-400 via-green-400 to-yellow-500", index, false)
                )}
              </div>

              {/* Right: High Energy Unpleasant */}
              <div className="grid grid-cols-5 gap-2 content-start h-fit">
                {emotions["high-unpleasant"].map((emotion, index) => 
                  renderEmotionButton(emotion, "from-red-400 via-orange-400 to-red-500", index, false)
                )}
              </div>
            </div>
          </>
        )}

        {/* Content - Page 2: Low Energy Emotions */}
        {currentPageNum === 2 && (
          <>
            {/* Mobile: Scrollable Grid */}
            <div className="md:hidden grid grid-cols-5 gap-2 p-3 pt-20 pb-24 overflow-y-auto">
              {/* Low Energy Pleasant - Green/Teal/Blue */}
              {emotions["low-pleasant"].map((emotion, index) => 
                renderEmotionButton(emotion, "from-green-400 via-teal-400 to-blue-400", index, true)
              )}

              {/* Low Energy Unpleasant - Blue/Indigo/Purple */}
              {emotions["low-unpleasant"].map((emotion, index) => 
                renderEmotionButton(emotion, "from-blue-500 via-indigo-500 to-purple-500", index, true)
              )}
            </div>

            {/* Desktop: Side by Side Layout */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-8 md:pt-20 md:pb-24 md:px-8 md:h-full">
              {/* Left: Low Energy Pleasant */}
              <div className="grid grid-cols-5 gap-2 content-start h-fit">
                {emotions["low-pleasant"].map((emotion, index) => 
                  renderEmotionButton(emotion, "from-green-400 via-teal-400 to-blue-400", index, false)
                )}
              </div>

              {/* Right: Low Energy Unpleasant */}
              <div className="grid grid-cols-5 gap-2 content-start h-fit">
                {emotions["low-unpleasant"].map((emotion, index) => 
                  renderEmotionButton(emotion, "from-blue-500 via-indigo-500 to-purple-500", index, false)
                )}
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4">
          {currentPageNum > 1 && (
            <motion.button
              onClick={() => setCurrentPageNum(1)}
              className={`flex items-center gap-2 bg-gradient-to-br ${colors.gradient} text-white px-6 py-3 rounded-full shadow-2xl`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold">Previous</span>
            </motion.button>
          )}

          {currentPageNum < 2 && (
            <motion.button
              onClick={() => setCurrentPageNum(2)}
              className={`flex items-center gap-2 bg-gradient-to-br ${colors.gradient} text-white px-6 py-3 rounded-full shadow-2xl`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-semibold">Next</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
