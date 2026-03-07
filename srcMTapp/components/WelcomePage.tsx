import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../data/translations";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomePageProps {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  const { getThemeColors } = useTheme();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const colors = getThemeColors() || {
    background: 'bg-[#FFF5F0]',
    primary: 'bg-[#FF8A65]',
    secondary: 'bg-[#FFB74D]',
    accent: 'bg-[#FFCCBC]',
    text: 'text-[#4A3428]',
    cardBg: 'bg-white/80',
    gradient: 'from-[#FF8A65] via-[#FFB74D] to-[#FF8A65]',
  };
  const [isExpanding, setIsExpanding] = useState(false);

  const handleClick = () => {
    // Trigger expansion
    setIsExpanding(true);
    
    // Navigate to main screen
    setTimeout(() => {
      onGetStarted();
    }, 1000);
  };

  return (
    <div className={`h-screen ${colors.background} flex flex-col justify-center items-center p-4 transition-all duration-500 relative overflow-hidden`}>
      {/* Decorative geometric shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* SOLID GEOMETRIC SHAPES */}
        {/* Top-left: Solid rounded square */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.12,
            scale: 1,
            y: [0, -5, 0],
            rotate: [0, 3, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.1 },
            scale: { duration: 1, delay: 0.1 },
            y: { duration: 4000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            rotate: { duration: 5000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute -top-20 -left-20 w-[280px] h-[280px] bg-gradient-to-br ${colors.gradient} rounded-[60px]`}
        />

        {/* Top-left: Solid circle accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 0.2,
            scale: 1,
            x: [0, -3, 0],
            y: [0, 4, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.3 },
            scale: { duration: 1, delay: 0.3 },
            x: { duration: 3000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute top-32 left-20 w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-full`}
        />

        {/* Left side: Solid hexagon */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.15,
            y: [0, 5, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.5 },
            y: { duration: 4500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            rotate: { duration: 6000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          width="100"
          height="115"
          viewBox="0 0 100 115"
        >
          <defs>
            <linearGradient id="hexGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(74, 222, 128)' }} />
              <stop offset="100%" style={{ stopColor: 'rgb(96, 165, 250)' }} />
            </linearGradient>
          </defs>
          <path
            d="M 50 0 L 93.3 28.75 L 93.3 86.25 L 50 115 L 6.7 86.25 L 6.7 28.75 Z"
            fill="url(#hexGrad1)"
          />
        </motion.svg>

        {/* Top-right: Solid triangle */}
        <motion.svg
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ 
            opacity: 0.18,
            scale: 1,
            x: [0, 4, 0],
            y: [0, -3, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.2 },
            scale: { duration: 1, delay: 0.2 },
            x: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 3000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            rotate: { duration: 5500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute -top-10 right-24"
          width="140"
          height="140"
          viewBox="0 0 140 140"
        >
          <defs>
            <linearGradient id="triGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(74, 222, 128)' }} />
              <stop offset="100%" style={{ stopColor: 'rgb(96, 165, 250)' }} />
            </linearGradient>
          </defs>
          <path
            d="M 70 10 L 130 120 L 10 120 Z"
            fill="url(#triGrad1)"
          />
        </motion.svg>

        {/* Right side: Solid rounded rectangle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ 
            opacity: 0.14,
            scale: 1,
            y: [0, -4, 0],
            rotate: [0, -4, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.4 },
            scale: { duration: 1, delay: 0.4 },
            y: { duration: 4200 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            rotate: { duration: 5800 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute right-8 top-1/3 w-32 h-48 bg-gradient-to-br ${colors.gradient} rounded-[30px]`}
        />

        {/* Bottom-right: Solid pentagon */}
        <motion.svg
          initial={{ opacity: 0, rotate: -30 }}
          animate={{ 
            opacity: 0.16,
            rotate: 0,
            x: [0, 3, 0],
            y: [0, -4, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.6 },
            rotate: { duration: 1, delay: 0.6 },
            x: { duration: 3800 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 4500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute -bottom-16 -right-16"
          width="200"
          height="200"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient id="pentGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(74, 222, 128)' }} />
              <stop offset="100%" style={{ stopColor: 'rgb(96, 165, 250)' }} />
            </linearGradient>
          </defs>
          <path
            d="M 100 20 L 180 80 L 150 170 L 50 170 L 20 80 Z"
            fill="url(#pentGrad1)"
          />
        </motion.svg>

        {/* Bottom-left: Solid diamond */}
        <motion.svg
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 0.17,
            scale: 1,
            x: [0, -3, 0],
            rotate: [0, 6, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.7 },
            scale: { duration: 1, delay: 0.7 },
            x: { duration: 3300 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            rotate: { duration: 5200 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute bottom-20 left-12"
          width="110"
          height="110"
          viewBox="0 0 110 110"
        >
          <defs>
            <linearGradient id="diamondGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(74, 222, 128)' }} />
              <stop offset="100%" style={{ stopColor: 'rgb(96, 165, 250)' }} />
            </linearGradient>
          </defs>
          <path
            d="M 55 5 L 105 55 L 55 105 L 5 55 Z"
            fill="url(#diamondGrad1)"
          />
        </motion.svg>

        {/* Bottom-left: Solid small circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.19,
            scale: 1,
            y: [0, 3, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.8 },
            scale: { duration: 1, delay: 0.8 },
            y: { duration: 2800 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute bottom-32 left-32 w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-full`}
        />

        {/* BACKGROUND BLURRED SHAPES FOR DEPTH */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.15,
            y: [0, -8, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.2 },
            y: { 
              duration: 4000 / 1000,
              repeat: Infinity,
              ease: [0.37, 0, 0.63, 1],
            }
          }}
          className={`absolute -top-48 -left-48 w-[500px] h-[500px] bg-gradient-to-br ${colors.gradient} rounded-full blur-2xl`}
        />
        
        {/* Top-left: Rounded triangle accent */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.2,
            x: [0, -3, 0],
            y: [0, 3, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.4 },
            x: { duration: 3000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute top-20 left-12"
          width="200"
          height="200"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient id="triangleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-current" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
              <stop offset="100%" className="text-current" style={{ stopColor: 'currentColor', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          <path
            d="M 100 20 L 180 160 L 20 160 Z"
            fill="url(#triangleGrad1)"
            className={`bg-gradient-to-br ${colors.gradient}`}
            style={{ filter: 'blur(8px)' }}
          />
        </motion.svg>

        {/* Bottom-right: Abstract blob shape */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.18,
            x: [0, 3, 0],
            y: [0, -3, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.6 },
            x: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 4000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute -bottom-32 -right-32"
          width="400"
          height="400"
          viewBox="0 0 400 400"
        >
          <defs>
            <linearGradient id="blobGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(74, 222, 128, 0.3)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(96, 165, 250, 0.3)' }} />
            </linearGradient>
          </defs>
          <path
            d="M 200 50 Q 350 100 350 250 Q 350 350 250 380 Q 150 380 80 320 Q 50 250 80 150 Q 150 50 200 50 Z"
            fill="url(#blobGrad1)"
            style={{ filter: 'blur(40px)' }}
          />
        </motion.svg>

        {/* Small decorative dots - top right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.25,
            y: [0, -2, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.8 },
            y: { duration: 2500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute top-32 right-24 w-4 h-4 bg-gradient-to-br ${colors.gradient} rounded-full blur-sm`}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.2,
            y: [0, 2, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 1 },
            y: { duration: 3000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute top-48 right-16 w-3 h-3 bg-gradient-to-br ${colors.gradient} rounded-full blur-sm`}
        />

        {/* Small decorative dots - bottom left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.25,
            x: [0, -2, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 1.2 },
            x: { duration: 2800 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute bottom-40 left-20 w-4 h-4 bg-gradient-to-br ${colors.gradient} rounded-full blur-sm`}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.2,
            x: [0, 2, 0],
          }}
          transition={{ 
            opacity: { duration: 1, delay: 1.4 },
            x: { duration: 3200 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute bottom-56 left-32 w-3 h-3 bg-gradient-to-br ${colors.gradient} rounded-full blur-sm`}
        />

        {/* Geometric outline accent - left side */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.15,
            y: [0, 3, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 1.6 },
            y: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute top-1/2 left-8 -translate-y-1/2"
          width="60"
          height="60"
          viewBox="0 0 60 60"
        >
          <rect
            x="5"
            y="5"
            width="50"
            height="50"
            rx="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-gradient-to-br ${colors.gradient}`}
            style={{ filter: 'blur(1px)', opacity: 0.4 }}
          />
        </motion.svg>
      </div>
      
      {/* Hourglass-shaped container */}
      <div className="relative w-full max-w-4xl z-10 flex flex-col h-full justify-center items-center py-4 md:py-8">
        {/* Top section of hourglass */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 md:mb-12 px-6"
        >
          <motion.h1 
            className={`${colors.text} ${
              language === 'en' 
                ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl' 
                : language === 'es'
                ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
                : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
            } leading-tight mx-auto font-bold`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {language === 'es' ? (
              <>
                Medidor de Estado de<br />Ánimo
              </>
            ) : language === 'ru' ? (
              <>
                Измеритель<br />Настроения
              </>
            ) : (
              t.moodMeter
            )}
          </motion.h1>
        </motion.div>

        {/* Center - Animated Face (hourglass middle) */}
        <div className="flex justify-center items-center my-4 md:my-8 relative">
          {/* Ripple effects */}
          <AnimatePresence>
            {isExpanding && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.gradient} opacity-30`}
                    initial={{ scale: 1, opacity: 0.3 }}
                    animate={{ scale: 3 + i, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Particle effects */}
          <AnimatePresence>
            {isExpanding && (
              <>
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30) * (Math.PI / 180);
                  const distance = 150;
                  return (
                    <motion.div
                      key={i}
                      className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                      animate={{
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance,
                        opacity: 0,
                        scale: 1,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  );
                })}
              </>
            )}
          </AnimatePresence>

          {/* Main Face Button - BIGGER SIZE WITH FUN ANIMATIONS */}
          <motion.button
            onClick={handleClick}
            disabled={isExpanding}
            className={`relative w-[22rem] h-[22rem] sm:w-[26rem] sm:h-[26rem] md:w-[30rem] md:h-[30rem] lg:w-[34rem] lg:h-[34rem] max-w-[90vmin] max-h-[90vmin] bg-gradient-to-br ${colors.gradient} rounded-full shadow-2xl flex items-center justify-center cursor-pointer z-10`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: isExpanding ? 1.5 : 1, 
              rotate: isExpanding ? 360 : 0,
              opacity: isExpanding ? 0 : 1,
              y: isExpanding ? 0 : [0, -15, 0],
            }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.4,
              opacity: { duration: 0.3, delay: isExpanding ? 0.5 : 0 },
              y: { 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatType: "loop"
              }
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect on hover */}
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} blur-xl`}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.5 }}
              transition={{ duration: 0.3 }}
            />

            {/* Face */}
            <div className="relative">
              {/* Left Eye */}
              <motion.div
                className="absolute top-0 left-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full"
                style={{ x: -60, y: -20 }}
              />
              
              {/* Right Eye */}
              <motion.div
                className="absolute top-0 right-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full"
                style={{ x: 60, y: -20 }}
              />

              {/* Animated Mouth - Smile to Neutral to Frown with Fade */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                {/* Smile */}
                <motion.svg
                  className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  animate={{
                    opacity: [1, 1, 0, 0, 0, 0, 0, 0, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.30, 0.33, 0.63, 0.66, 0.96, 0.99, 0.999, 1]
                  }}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M7 14s2 3 5 3 5-3 5-3"
                  />
                </motion.svg>

                {/* Neutral */}
                <motion.svg
                  className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  animate={{
                    opacity: [0, 0, 0, 1, 1, 0, 0, 0, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.30, 0.33, 0.36, 0.63, 0.66, 0.96, 0.99, 1]
                  }}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M7 15h10"
                  />
                </motion.svg>

                {/* Frown */}
                <motion.svg
                  className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  animate={{
                    opacity: [0, 0, 0, 0, 0, 0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.30, 0.33, 0.63, 0.66, 0.69, 0.72, 0.96, 0.99]
                  }}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M7 17s2-3 5-3 5 3 5 3"
                  />
                </motion.svg>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}