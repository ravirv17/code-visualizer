import React from 'react';

function ControlPanel({ 
  onVisualize, 
  onPrevStep, 
  onNextStep, 
  onPlay, 
  onPause, 
  isPlaying,
  onSpeedChange,
  speed,
  isFirstStep,
  isLastStep
}) {
  return (
    <div className="control-panel">
      <button 
        className="visualize-btn" 
        onClick={onVisualize}
      >
        Visualize
      </button>
      
      <div className="playback-controls">
        <button 
          onClick={onPrevStep} 
          disabled={isFirstStep}
        >
          Previous
        </button>
        
        {!isPlaying ? (
          <button 
            onClick={onPlay} 
            disabled={isLastStep}
          >
            Play
          </button>
        ) : (
          <button onClick={onPause}>
            Pause
          </button>
        )}
        
        <button 
          onClick={onNextStep} 
          disabled={isLastStep}
        >
          Next
        </button>
        
        <div className="speed-control">
          <label>
            Speed:
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={speed} 
              onChange={(e) => onSpeedChange(parseInt(e.target.value))} 
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;