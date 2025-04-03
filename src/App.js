import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import Visualizer from './components/Visualizer';
import ControlPanel from './components/ControlPanel';
import ArrayInput from './components/ArrayInput';
import { parseJavaScriptBubbleSort } from './utils/codeParser';
import { parsePythonBubbleSort } from './utils/pythonParser';
import { parseJavaBubbleSort } from './utils/javaParser';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(5);
  const [intervalId, setIntervalId] = useState(null);
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [codeTemplates, setCodeTemplates] = useState({
    javascript: `// Bubble Sort Example
function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

// Example usage:
let array = [64, 34, 25, 12, 22, 11, 90];
bubbleSort(array);`,
    python: `# Bubble Sort Example
def bubble_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        # Last i elements are already in place
        for j in range(0, n-i-1):
            # Traverse the array from 0 to n-i-1
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Example usage:
array = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(array)`,
    java: `// Bubble Sort Example
public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap arr[j] and arr[j+1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(array);
    }
}`
  });

  // Handle code changes from the editor
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Handle language selection
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Update code with template for selected language
    setCode(codeTemplates[newLanguage]);
  };

  // Initialize code state with the default template
  useEffect(() => {
    setCode(codeTemplates.javascript);
  }, []);

  // Start visualization based on code and language
  const startVisualization = () => {
    // Reset playback
    stopPlayback();
    
    try {
      let visualizationSteps = [];
      
      // Choose the appropriate parser based on the language
      switch (language) {
        case 'javascript':
          visualizationSteps = parseJavaScriptBubbleSort(code, inputArray);
          break;
        case 'python':
          visualizationSteps = parsePythonBubbleSort(code, inputArray);
          break;
        case 'java':
          visualizationSteps = parseJavaBubbleSort(code, inputArray);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
      
      setSteps(visualizationSteps);
      setCurrentStepIndex(0);
    } catch (error) {
      console.error("Visualization error:", error);
      // Set an error step
      setSteps([{
        array: [...inputArray],
        message: "Error: " + error.message,
        comparing: []
      }]);
      setCurrentStepIndex(0);
    }
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
      setCurrentStepIndex(prev => {
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
            initialCode={code}
            language={language} 
          />
          <ArrayInput 
            onArrayChange={setInputArray} 
            initialArray={inputArray}
          />
        </div>
        
        <div className="visualization-section">
          <Visualizer 
            currentStep={steps[currentStepIndex]} 
          />
          
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