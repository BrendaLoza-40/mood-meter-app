import { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WelcomePage } from "./components/WelcomePage";
import { MoodMeterPage } from "./components/MoodMeterPage";
import { SubEmotionsPage } from "./components/SubEmotionsPage";
import { AllEmotionsPage } from "./components/AllEmotionsPage";
import { ThankYouPage } from "./components/ThankYouPage";
import { QuadrantId } from "./data/emotions";
import { insertMoodEntry } from "./services/moodEntriesSupabase";
import { getDeviceId } from "./services/deviceId";
import { useEffect } from "react";
import { KioskSetupPage } from "./components/KioskSetupPage";
import { getKioskLocation } from "./services/kioskRegistry";



type Page = "welcome" | "mood-meter" | "sub-emotions" | "all-emotions" | "thank-you";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantId | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [selectedQuadrantStr, setSelectedQuadrantStr] = useState<string>("");
  const [startMs, setStartMs] = useState<number | null>(null);
  const [isSetupChecked, setIsSetupChecked] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);


  useEffect(() => {
    (async () => {
      const deviceId = getDeviceId();
      const location = await getKioskLocation(deviceId);
      setNeedsSetup(!location);
      setIsSetupChecked(true);
    })();
  }, []);


  const handleGetStarted = () => {
    setStartMs(Date.now());
    setCurrentPage("mood-meter");
  };

  const handleSelectQuadrant = (quadrant: string) => {
    if (startMs === null) setStartMs(Date.now());
    setSelectedQuadrantStr(quadrant);
    setSelectedQuadrant(quadrant as QuadrantId);
    setCurrentPage("sub-emotions");
  };


  const handleSelectEmotion = async (emotion: string) => {
    const timeToSelectMs = startMs ? Date.now() - startMs : 0;
    console.log("handleSelectEmotion fired with:", emotion);

    setSelectedEmotion(emotion);
    


    try {
      await insertMoodEntry({
        deviceId: getDeviceId(),
        quadrant: selectedQuadrantStr || "unknown",
        emotion,
        timeToSelectMs,
      });

    } catch (e) {
      console.error(e);
      // don't block the user flow, but you can show a message if you want
    }
    setStartMs(null);

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
    setSelectedQuadrantStr("");
    setSelectedEmotion("");
    setStartMs(null);
    setCurrentPage("welcome");
  };

  if (!isSetupChecked) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (needsSetup) {
    return (
      <KioskSetupPage
        onDone={() => {
          setNeedsSetup(false);
        }}
      />
    );
  }



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
