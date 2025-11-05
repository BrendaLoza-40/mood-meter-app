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
import { motion, AnimatePresence } from "motion/react";

type Page = "welcome" | "mood-meter" | "sub-emotions" | "all-emotions" | "thank-you";

const INACTIVITY_TIMEOUT = 30000; // 30 seconds
const WARNING_TIMEOUT = 20000; // 20 seconds (10 seconds before reset)

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantId | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  const { getThemeColors } = useTheme();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const colors = getThemeColors();
  
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

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
    setCountdown(10);
  }, []);

  const clearTimers = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  }, []);

  const resetTimers = useCallback(() => {
    clearTimers();
    
    // Don't set timers on welcome page
    if (currentPage === "welcome") {
      setShowWarning(false);
      return;
    }

    // Show warning after 20 seconds
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(10);
      
      // Start countdown immediately and then continue every second
      let currentCount = 10;
      countdownInterval.current = setInterval(() => {
        currentCount--;
        setCountdown(currentCount);
        if (currentCount <= 0) {
          if (countdownInterval.current) clearInterval(countdownInterval.current);
        }
      }, 1000);
    }, WARNING_TIMEOUT);

    // Reset to welcome after 30 seconds
    inactivityTimer.current = setTimeout(() => {
      handleReset();
    }, INACTIVITY_TIMEOUT);
  }, [currentPage, clearTimers, handleReset]);

  const handleUserActivity = useCallback(() => {
    if (showWarning) {
      setShowWarning(false);
      setCountdown(10);
    }
    resetTimers();
  }, [showWarning, resetTimers]);

  const handleStayActive = () => {
    setShowWarning(false);
    setCountdown(10);
    resetTimers();
  };

  // Start timer when page changes (but not on welcome page)
  useEffect(() => {
    resetTimers();
  }, [currentPage, resetTimers]);

  // Set up activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
      clearTimers();
    };
  }, [handleUserActivity, clearTimers]);

  return (
    <>
      {currentPage === "welcome" && (
        <WelcomePage onGetStarted={handleGetStarted} />
      )}
      
      {currentPage === "mood-meter" && (
        <MoodMeterPage 
          onSelectQuadrant={handleSelectQuadrant}
          onSeeAllEmotions={handleSeeAllEmotions}
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
            <AlertDialogTitle className="flex items-center gap-3 justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center`}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <span>{t.areYouStillThere}</span>
            </AlertDialogTitle>
            <AlertDialogDescription className={`${colors.text} opacity-80 text-center pt-4`}>
              {t.returnToHome}
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className={`text-5xl my-4 bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent`}
                >
                  {countdown}
                </motion.div>
              </AnimatePresence>
              {t.seconds}
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
      
      <LanguageSelector />
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
