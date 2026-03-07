import { useState, useEffect, useRef, useCallback } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { useTranslation } from "./data/translations";
import { WelcomePage } from "./components/WelcomePage";
import { MoodMeterPage } from "./components/MoodMeterPage";
import { SubEmotionsPage } from "./components/SubEmotionsPage";
import { AllEmotionsPage } from "./components/AllEmotionsPage";
import { ThankYouPage } from "./components/ThankYouPage";
import { LanguageSelector } from "./components/LanguageSelector";
import { QuadrantId } from "./data/emotions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";

type Page = "welcome" | "mood-meter" | "sub-emotions" | "all-emotions" | "thank-you";

const INACTIVITY_TIMEOUT = 30000; // 30 seconds for most pages
const ALL_EMOTIONS_INACTIVITY_TIMEOUT = 50000; // 50 seconds for all-emotions page (40 sec + 10 sec)
const WARNING_TIMEOUT = 10000; // 10 seconds warning before reset
const ALL_EMOTIONS_WARNING_TIMEOUT = 40000; // 40 seconds before showing warning on all-emotions page (then 10 sec countdown)
const COUNTDOWN_SECONDS = (INACTIVITY_TIMEOUT - WARNING_TIMEOUT) / 1000; // Calculate remaining seconds
const ALL_EMOTIONS_COUNTDOWN_SECONDS = (ALL_EMOTIONS_INACTIVITY_TIMEOUT - ALL_EMOTIONS_WARNING_TIMEOUT) / 1000; // 10 seconds for all-emotions page

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantId | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  
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
  
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const showWarningRef = useRef(showWarning);
  const currentPageRef = useRef(currentPage);

  // Keep refs in sync with state
  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const handleGetStarted = () => {
    setCurrentPage("mood-meter");
  };

  const handleSelectQuadrant = (quadrant: string) => {
    setSelectedQuadrant(quadrant as QuadrantId);
    setCurrentPage("sub-emotions");
  };

  const handleSelectEmotion = (emotion: string) => {
    setSelectedEmotion(emotion);
    setCurrentPage("thank-you");
  };

  const handleBack = () => {
    setCurrentPage("mood-meter");
  };

  const handleSeeAllEmotions = () => {
    setCurrentPage("all-emotions");
  };

  const handleReset = useCallback(() => {
    setSelectedQuadrant(null);
    setSelectedEmotion("");
    setCurrentPage("welcome");
    setShowWarning(false);
    setCountdown(COUNTDOWN_SECONDS);
  }, []);

  // Clear all timers - stable function using refs only
  const clearAllTimers = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  }, []);

  // Initialize timers - using useCallback to avoid recreation
  const initializeTimers = useCallback(() => {
    clearAllTimers();

    // Determine timeouts based on current page
    const isAllEmotionsPage = currentPageRef.current === "all-emotions";
    const inactivityTimeout = isAllEmotionsPage ? ALL_EMOTIONS_INACTIVITY_TIMEOUT : INACTIVITY_TIMEOUT;
    const warningTimeout = isAllEmotionsPage ? ALL_EMOTIONS_WARNING_TIMEOUT : WARNING_TIMEOUT;
    const countdownSeconds = isAllEmotionsPage ? ALL_EMOTIONS_COUNTDOWN_SECONDS : COUNTDOWN_SECONDS;

    // Show warning after warning timeout period
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(countdownSeconds);
      
      // Start countdown
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownInterval.current) clearInterval(countdownInterval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, warningTimeout);

    // Reset to welcome after inactivity timeout
    inactivityTimer.current = setTimeout(() => {
      handleReset();
    }, inactivityTimeout);
  }, [clearAllTimers, handleReset]);

  const handleStayActive = useCallback(() => {
    setShowWarning(false);
    const countdownSeconds = currentPageRef.current === "all-emotions" ? ALL_EMOTIONS_COUNTDOWN_SECONDS : COUNTDOWN_SECONDS;
    setCountdown(countdownSeconds);
    initializeTimers();
  }, [initializeTimers]);

  // Effect for timer initialization when page changes
  useEffect(() => {
    clearAllTimers();
    
    // Don't set timers on welcome page
    if (currentPage === "welcome") {
      return;
    }

    // Start timers for other pages
    initializeTimers();

    return () => {
      clearAllTimers();
    };
  }, [currentPage, clearAllTimers, initializeTimers]);

  // Separate effect for activity listeners - only runs once
  useEffect(() => {
    const handleActivity = () => {
      // Use refs to check current state without causing re-renders
      if (showWarningRef.current || currentPageRef.current === "welcome") {
        return;
      }

      // Restart timers by calling the memoized function
      initializeTimers();
    };

    const events = ['mousedown', 'touchstart', 'click'];
    
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [initializeTimers]);

  return (
    <>
      {currentPage === "welcome" && (
        <WelcomePage 
          onGetStarted={handleGetStarted}
        />
      )}
      
      {currentPage === "mood-meter" && (
        <MoodMeterPage 
          onSelectQuadrant={handleSelectQuadrant}
          onViewAllEmotions={handleSeeAllEmotions}
        />
      )}
      
      {currentPage === "sub-emotions" && selectedQuadrant && (
        <SubEmotionsPage
          quadrant={selectedQuadrant}
          onSelectEmotion={handleSelectEmotion}
          onBack={handleBack}
        />
      )}
      
      {currentPage === "all-emotions" && (
        <AllEmotionsPage
          onSelectEmotion={handleSelectEmotion}
          onBack={handleBack}
        />
      )}
      
      {currentPage === "thank-you" && (
        <ThankYouPage
          selectedEmotion={selectedEmotion}
          onReset={handleReset}
        />
      )}

      {/* Inactivity Warning Dialog */}
      <AlertDialog open={showWarning}>
        <AlertDialogContent className={`${colors.cardBg} ${colors.text} border-2 ${colors.text.replace('text-', 'border-')} max-w-md`}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="text-3xl"
              >
                👋
              </motion.div>
              <span>{t.areYouStillThere}</span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className={`${colors.text} opacity-80 text-center pt-4`}>
                <p className="text-sm mb-2">{t.returnToHome}</p>
                <motion.div
                  key={countdown}
                  animate={{ scale: [0.9, 1, 0.9] }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="text-6xl font-black my-6"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gradient.includes('orange') ? '#ff6b6b, #feca57' : colors.gradient.includes('blue') ? '#4facfe, #00f2fe' : colors.gradient.includes('purple') ? '#a8edea, #fed6e3' : '#ffd89b, #19547b'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {countdown}
                </motion.div>
                <p className="text-sm">{t.seconds}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center sm:justify-center">
            <motion.button
              onClick={handleStayActive}
              className={`px-8 py-3 bg-gradient-to-br ${colors.gradient} text-white rounded-full shadow-lg`}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              {t.stillHere}
            </motion.button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Only show settings on welcome page */}
      {currentPage === "welcome" && <LanguageSelector />}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}