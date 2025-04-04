import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import Visualizer from './components/Visualizer';
import ControlPanel from './components/ControlPanel';
import ArrayInput from './components/ArrayInput';
import { parseJavaScriptAlgorithm } from './utils/codeParser';
import { parsePythonAlgorithm } from './utils/pythonParser';
import { parseJavaAlgorithm } from './utils/javaParser';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(5);
  const [intervalId, setIntervalId] = useState(null);
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [codeTemplates, setCodeTemplates] = useState({
    javascript: {
      bubbleSort: `// Bubble Sort Algorithm
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
      mergeSort: `// Merge Sort Algorithm
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  // Split array into halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves
  return merge(mergeSort(left), mergeSort(right));
}

// Merge two sorted arrays
function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Example usage:
let array = [64, 34, 25, 12, 22, 11, 90];
mergeSort(array);`,
      quickSort: `// Quick Sort Algorithm
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// Example usage:
let array = [64, 34, 25, 12, 22, 11, 90];
quickSort(array);`,
      insertionSort: `// Insertion Sort Algorithm
function insertionSort(arr) {
  let len = arr.length;
  for (let i = 1; i < len; i++) {
    let key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// Example usage:
let array = [64, 34, 25, 12, 22, 11, 90];
insertionSort(array);`,
      selectionSort: `// Selection Sort Algorithm
function selectionSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }
  return arr;
}

// Example usage:
let array = [64, 34, 25, 12, 22, 11, 90];
selectionSort(array);`
    },
    python: {
      bubbleSort: `# Bubble Sort Algorithm
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
      mergeSort: `# Merge Sort Algorithm
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
        
    # Split array into halves
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # Recursively sort both halves
    left = merge_sort(left)
    right = merge_sort(right)
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage:
array = [64, 34, 25, 12, 22, 11, 90]
sorted_array = merge_sort(array)`,
      quickSort: `# Quick Sort Algorithm
def quick_sort(arr, left=0, right=None):
    if right is None:
        right = len(arr) - 1
        
    if left < right:
        pivot_idx = partition(arr, left, right)
        quick_sort(arr, left, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, right)
    return arr

def partition(arr, left, right):
    pivot = arr[right]
    i = left - 1
    
    for j in range(left, right):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[right] = arr[right], arr[i + 1]
    return i + 1

# Example usage:
array = [64, 34, 25, 12, 22, 11, 90]
quick_sort(array)`,
      insertionSort: `# Insertion Sort Algorithm
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    
    return arr

# Example usage:
array = [64, 34, 25, 12, 22, 11, 90]
insertion_sort(array)`,
      selectionSort: `# Selection Sort Algorithm
def selection_sort(arr):
    n = len(arr)
    for i in range(n-1):
        min_idx = i
        
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
                
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr

# Example usage:
array = [64, 34, 25, 12, 22, 11, 90]
selection_sort(array)`
    },
    java: {
      bubbleSort: `// Bubble Sort Algorithm
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
}`,
      mergeSort: `// Merge Sort Algorithm
public class MergeSort {
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            // Find the middle point
            int mid = (left + right) / 2;
            
            // Sort first and second halves
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            
            // Merge sorted halves
            merge(arr, left, mid, right);
        }
    }
    
    private static void merge(int[] arr, int left, int mid, int right) {
        // Sizes of two subarrays to be merged
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        // Create temp arrays
        int[] L = new int[n1];
        int[] R = new int[n2];
        
        // Copy data to temp arrays
        for (int i = 0; i < n1; ++i)
            L[i] = arr[left + i];
        for (int j = 0; j < n2; ++j)
            R[j] = arr[mid + 1 + j];
        
        // Merge the temp arrays
        // Initial indices of merged subarray
        int i = 0, j = 0;
        int k = left;
        
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        
        // Copy remaining elements of L[] if any
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
        
        // Copy remaining elements of R[] if any
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        mergeSort(array, 0, array.length - 1);
    }
}`,
      quickSort: `// Quick Sort Algorithm
public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            // Find partition index
            int pi = partition(arr, low, high);
            
            // Sort elements before and after partition
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1); // index of smaller element
        
        for (int j = low; j < high; j++) {
            // If current element is smaller than the pivot
            if (arr[j] < pivot) {
                i++;
                
                // Swap arr[i] and arr[j]
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        // Swap arr[i+1] and arr[high] (or pivot)
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        quickSort(array, 0, array.length - 1);
    }
}`,
      insertionSort: `// Insertion Sort Algorithm
public class InsertionSort {
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;
            
            /* Move elements of arr[0..i-1], that are
               greater than key, to one position ahead
               of their current position */
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        insertionSort(array);
    }
}`,
      selectionSort: `// Selection Sort Algorithm
public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        
        // One by one move boundary of unsorted subarray
        for (int i = 0; i < n-1; i++) {
            // Find the minimum element in unsorted array
            int min_idx = i;
            for (int j = i+1; j < n; j++)
                if (arr[j] < arr[min_idx])
                    min_idx = j;
                    
            // Swap the found minimum element with the first element
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        selectionSort(array);
    }
}`
    }
  });

  // Handle code changes from the editor
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Handle language selection
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Update code with template for selected language and algorithm
    setCode(codeTemplates[newLanguage][algorithm]);
  };

  // Handle algorithm selection
  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    // Update code with template for selected language and algorithm
    setCode(codeTemplates[language][newAlgorithm]);
  };

  // Initialize code state with the default template
  useEffect(() => {
    setCode(codeTemplates.javascript.bubbleSort);
  }, []);

  // Start visualization based on code, language, and algorithm
  const startVisualization = () => {
    // Reset playback
    stopPlayback();
    
    try {
      let visualizationSteps = [];
      
      // Choose the appropriate parser based on the language
      switch (language) {
        case 'javascript':
          visualizationSteps = parseJavaScriptAlgorithm(code, inputArray, algorithm);
          break;
        case 'python':
          visualizationSteps = parsePythonAlgorithm(code, inputArray, algorithm);
          break;
        case 'java':
          visualizationSteps = parseJavaAlgorithm(code, inputArray, algorithm);
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
        <h1>Algorithm Visualizer</h1>
      </header>
      
      <main>
        <div className="code-section">
          <CodeEditor 
            onCodeChange={handleCodeChange} 
            onLanguageChange={handleLanguageChange}
            onAlgorithmChange={handleAlgorithmChange}
            initialCode={code}
            language={language}
            algorithm={algorithm}
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