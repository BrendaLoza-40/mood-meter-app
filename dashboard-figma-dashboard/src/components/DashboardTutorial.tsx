import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
}

interface DashboardTutorialProps {
  open: boolean;
  onClose: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to the Mood Meter Dashboard! 👋",
    description: "This interactive guide will help you navigate through all the features of the dashboard. You can skip this tutorial at any time or restart it from Settings."
  },
  {
    title: "Time Period Selection",
    description: "Use the Day/Week/Month/Year tabs to view mood data across different time periods. The active tab will be highlighted with a colored background."
  },
  {
    title: "Date Filters",
    description: "Search for specific dates or select custom date ranges to analyze mood patterns during particular periods. Clear filters anytime to return to the full dataset."
  },
  {
    title: "Quick Stats Overview",
    description: "The stats cards at the top show key metrics: Total Responses, Pleasant Moods percentage, High Energy moods percentage, and Average Response Time."
  },
  {
    title: "Mood Distribution Chart",
    description: "This pie chart shows how moods are distributed across the four L1 categories: High Energy Pleasant (yellow), High Energy Unpleasant (red), Low Energy Unpleasant (blue), and Low Energy Pleasant (green)."
  },
  {
    title: "Mood Trends Over Time",
    description: "The line chart tracks mood patterns over time, helping you identify trends and patterns in emotional responses across different periods."
  },
  {
    title: "L2 Emotion Breakdown",
    description: "View the most frequently selected specific emotions (L2 emotions) ranked by frequency. This shows which detailed emotions students are experiencing most often."
  },
  {
    title: "Reaction Time Analytics",
    description: "Track how long students take to choose their emotion after the title screen. Faster reaction times may indicate clearer emotional awareness."
  },
  {
    title: "Location Statistics",
    description: "See mood data broken down by different kiosk locations. This helps identify if certain environments affect student moods."
  },
  {
    title: "Export Options",
    description: "Export your data as CSV or PDF for further analysis, reporting, or record-keeping. Access export buttons in the top navigation bar."
  },
  {
    title: "Language & Settings",
    description: "Click the Settings (⚙️) button to change language, filter by location, or restart this tutorial anytime."
  },
  {
    title: "Admin Settings (Admins Only)",
    description: "Administrators can access advanced settings to manage custom emotions, locations, API integrations, and CSV data sources. Login required."
  },
  {
    title: "You're All Set! 🎉",
    description: "You've completed the dashboard tutorial! Explore the features at your own pace. You can always restart this tutorial from Settings > Start Dashboard Tutorial."
  }
];

export function DashboardTutorial({ open, onClose }: DashboardTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCurrentStep(0);
    onClose();
  };

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[600px] max-w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{currentStepData.title}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Skip Tutorial
            </Button>
            <Button onClick={handleNext}>
              {currentStep === tutorialSteps.length - 1 ? (
                'Finish'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
