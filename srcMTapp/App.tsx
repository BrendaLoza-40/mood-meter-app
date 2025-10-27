import { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WelcomePage } from "./components/WelcomePage";
import { MoodMeterPage } from "./components/MoodMeterPage";
import { SubEmotionsPage } from "./components/SubEmotionsPage";
import { AllEmotionsPage } from "./components/AllEmotionsPage";
import { ThankYouPage } from "./components/ThankYouPage";
import { QuadrantId } from "./data/emotions";

type Page = "welcome" | "mood-meter" | "sub-emotions" | "all-emotions" | "thank-you";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantId | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");

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

  const handleReset = () => {
    setSelectedQuadrant(null);
    setSelectedEmotion("");
    setCurrentPage("welcome");
  };

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
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
