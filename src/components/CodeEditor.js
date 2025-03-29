import React, { useState } from "react";

function CodeEditor({ onCodeChange, onLanguageChange }) {
  const [code, setCode] = useState(`// Bubble Sort Example
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
bubbleSort(array);`);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (onCodeChange) {
      onCodeChange(e.target.value);
    }
  };

  return (
    <div className="code-editor">
      <h2>Input Code</h2>
      <div className="editor-controls">
        <select
          onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
          defaultValue="javascript"
        >
          <option value="javascript">JavaScript</option>
          <option value="python" disabled>
            Python (Coming Soon)
          </option>
          <option value="java" disabled>
            Java (Coming Soon)
          </option>
        </select>
      </div>
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="Enter your code here..."
        rows={15}
      />
    </div>
  );
}

export default CodeEditor;
