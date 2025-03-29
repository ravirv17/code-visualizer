import React, { useState, useEffect } from "react";
import CodeEditor from "./components/CodeEditor";
import Visualizer from "./components/Visualizer";
import ControlPanel from "./components/ControlPanel";
import "./App.css";
import { parseJavaScriptBubbleSort } from "./utils/codeParser";
import ArrayInput from "./components/ArrayInput";

function App() {
  const [code, setCode] = useState("");
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [language, setLanguage] = useState("javascript");
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(5);
  const [intervalId, setIntervalId] = useState(null);

  // Sample array for visualization
  const sampleArray = [64, 34, 25, 12, 22, 11, 90];

  // Handle code changes from the editor
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Handle language selection
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Start visualization - for now with dummy data
  // Start visualization based on code and language
  // Start visualization based on code and language
  const startVisualization = () => {
    // Reset playback
    stopPlayback();

    try {
      let visualizationSteps = [];

      if (language === "javascript") {
        visualizationSteps = parseJavaScriptBubbleSort(code, inputArray);
      } else {
        // For other languages, use dummy steps for now
        visualizationSteps = createDummyBubbleSortSteps(inputArray.slice());
      }

      setSteps(visualizationSteps);
      setCurrentStepIndex(0);
    } catch (error) {
      console.error("Visualization error:", error);
      // Set an error step
      setSteps([
        {
          array: [...inputArray],
          message: "Error: " + error.message,
          comparing: [],
        },
      ]);
      setCurrentStepIndex(0);
    }
  };

  // Create dummy steps for bubble sort (we'll replace this with real parsing later)
  const createDummyBubbleSortSteps = (arr) => {
    const steps = [];

    // Initial state
    steps.push({
      array: [...arr],
      message: "Initial array",
      comparing: [],
    });

    // Simple static steps for demonstration
    steps.push({
      array: [34, 64, 25, 12, 22, 11, 90],
      message: "Comparing 64 and 34, swapping",
      comparing: [0, 1],
    });

    steps.push({
      array: [34, 25, 64, 12, 22, 11, 90],
      message: "Comparing 64 and 25, swapping",
      comparing: [1, 2],
    });

    steps.push({
      array: [34, 25, 12, 64, 22, 11, 90],
      message: "Comparing 64 and 12, swapping",
      comparing: [2, 3],
    });

    // Add more steps here...

    steps.push({
      array: [11, 12, 22, 25, 34, 64, 90],
      message: "Sorting complete!",
      comparing: [],
    });

    return steps;
  };

  // Navigation controls
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      stopPlayback();
    }
  };

  // Playback controls
  const startPlayback = () => {
    if (isPlaying || currentStepIndex >= steps.length - 1) return;

    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          stopPlayback();
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    setIntervalId(interval);
  };

  const stopPlayback = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsPlaying(false);
  };

  // Clear interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="App">
      <header>
        <h1>Code Visualizer</h1>
      </header>

      <main>
          <div className="code-section">
            <CodeEditor
              onCodeChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
            />
            <ArrayInput
              onArrayChange={setInputArray}
              initialArray={inputArray}
            />
          </div>

        <div className="visualization-section">
          <Visualizer currentStep={steps[currentStepIndex]} />

          <ControlPanel
            onVisualize={startVisualization}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onPlay={startPlayback}
            onPause={stopPlayback}
            isPlaying={isPlaying}
            onSpeedChange={setPlaybackSpeed}
            speed={playbackSpeed}
            isFirstStep={currentStepIndex === 0}
            isLastStep={currentStepIndex === steps.length - 1}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
