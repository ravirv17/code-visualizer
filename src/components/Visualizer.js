import React from 'react';

function Visualizer({ currentStep }) {
  // If no step is available yet
  if (!currentStep) {
    return (
      <div className="visualizer">
        <h2>Visualization</h2>
        <div className="visualization-canvas">
          <p>Enter your code and click "Visualize" to start</p>
        </div>
      </div>
    );
  }

  const { array, message, comparing } = currentStep;

  return (
    <div className="visualizer">
      <h2>Visualization</h2>
      <div className="visualization-canvas">
        <div className="step-message">{message}</div>
        <div className="array-bars">
          {array.map((value, index) => (
            <div 
              key={index} 
              className="array-bar" 
              style={{
                height: `${(value / 100) * 180}px`,
                backgroundColor: comparing.includes(index) ? '#ff6347' : '#4CAF50'
              }}
            >
              <span className="bar-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Visualizer;