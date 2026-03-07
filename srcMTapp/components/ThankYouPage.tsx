import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../data/translations";
import { useEmotionTranslation } from "../data/emotionTranslations";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface ThankYouPageProps {
  selectedEmotion: string;
  onReset: () => void;
}

export function ThankYouPage({ selectedEmotion, onReset }: ThankYouPageProps) {
  const { getThemeColors } = useTheme();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const emotionT = useEmotionTranslation(language);
  const colors = getThemeColors();

  // Auto-reset after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onReset();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onReset]);

  return (
    <div className={`h-screen ${colors.background} flex items-center justify-center p-4 md:p-6 transition-all duration-500 relative overflow-hidden`}>
      {/* Decorative geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-right: Large rounded square (semi-transparent, partially off-screen) */}
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
              ease: [0.37, 0, 0.63, 1], // Ease In-Out Sine
            }
          }}
          className={`absolute -top-48 -right-48 w-[500px] h-[500px] bg-gradient-to-bl ${colors.gradient} rounded-[80px] blur-2xl`}
        />
        
        {/* Top-right: Rounded square accent with softer edges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.18,
            x: [0, 3, 0],
            y: [0, 3, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.4 },
            x: { duration: 3000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute top-16 right-12 w-[180px] h-[180px] bg-gradient-to-bl ${colors.gradient} rounded-[40px] blur-xl opacity-20`}
        />

        {/* Bottom-left: Echo of welcome page blob */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.18,
            x: [0, -3, 0],
            y: [0, 3, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.6 },
            x: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 4000 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className="absolute -bottom-32 -left-32"
          width="400"
          height="400"
          viewBox="0 0 400 400"
        >
          <defs>
            <linearGradient id="blobGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(74, 222, 128, 0.3)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(96, 165, 250, 0.3)' }} />
            </linearGradient>
          </defs>
          <path
            d="M 250 80 Q 320 150 320 250 Q 300 350 200 370 Q 100 350 70 250 Q 80 150 150 80 Q 200 60 250 80 Z"
            fill="url(#blobGrad2)"
            style={{ filter: 'blur(40px)' }}
          />
        </motion.svg>

        {/* Bottom-left: Circle accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.2,
            x: [0, -2, 0],
            y: [0, 2, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.8 },
            x: { duration: 3200 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
            y: { duration: 3500 / 1000, repeat: Infinity, ease: [0.37, 0, 0.63, 1] },
          }}
          className={`absolute bottom-32 left-16 w-32 h-32 bg-gradient-to-tr ${colors.gradient} rounded-full blur-xl`}
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className={`${colors.cardBg} backdrop-blur-sm rounded-3xl shadow-2xl p-3 sm:p-4 md:p-6 text-center space-y-2 md:space-y-3`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${colors.gradient} rounded-full mx-auto flex items-center justify-center shadow-xl`}>
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-2 md:px-4"
          >
            <h1 className={`${colors.text} text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight font-bold`}>{t.thankYou}</h1>
            <p className={`${colors.text} opacity-70 text-sm sm:text-base md:text-lg mt-1`}>
              {t.youSuccessfullyLogged}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`${colors.accent} rounded-2xl p-2 md:p-3 inline-block`}
          >
            <p className={`${colors.text} text-sm sm:text-base md:text-lg`}>
              <span className="opacity-60">{t.youreFeeling} </span>
              <span className="font-extrabold text-base sm:text-lg md:text-xl">{emotionT[selectedEmotion as keyof typeof emotionT]}</span>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${colors.accent} rounded-2xl p-3 md:p-4 lg:p-5 space-y-2 md:space-y-3`}
          >
            <h2 className={`${colors.text} text-lg sm:text-xl md:text-2xl font-bold`}>{t.flcWellness}</h2>
            
            <div className={`${colors.text} space-y-1.5 md:space-y-2 opacity-90 text-xs sm:text-sm md:text-base`}>
              <div className="space-y-1.5 md:space-y-2">
                <motion.a 
                  href="tel:916-608-6782"
                  className="flex items-center gap-2 cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-xs sm:text-sm md:text-base">{t.flcWellness}</div>
                    <div className="opacity-70 text-xs">(916) 608-6782</div>
                  </div>
                </motion.a>
                
                <motion.a 
                  href="tel:916-286-3662"
                  className="flex items-center gap-2 cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-xs sm:text-sm md:text-base">{t.mentalHealth}</div>
                    <div className="opacity-70 text-xs">(916) 286-3662</div>
                  </div>
                </motion.a>
                
                <motion.a 
                  href="mailto:shwc@flc.losrios.edu"
                  className="flex items-center gap-2 cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm md:text-base break-all">shwc@flc.losrios.edu</span>
                </motion.a>
                
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-xs sm:text-sm md:text-base">{t.mondayToFriday}</div>
                    <div className="opacity-70 text-xs">{t.hours}</div>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm md:text-base">{t.location}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-1 md:pt-2"
          >
            <motion.button
              onClick={onReset}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 ${colors.cardBg} ${colors.text} rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm border-2 ${colors.text.replace('text-', 'border-')} text-xs sm:text-sm md:text-base font-semibold`}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.95 }}
            >
              {t.backToHome}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}