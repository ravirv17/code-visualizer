import React, { useState, useEffect } from 'react';

function CodeEditor({ onCodeChange, onLanguageChange, initialCode, language }) {
  const [code, setCode] = useState(initialCode || '');

  // Update internal code state when initialCode prop changes
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

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
          value={language}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
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