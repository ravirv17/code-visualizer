import React, { useState } from 'react';

function ArrayInput({ onArrayChange, initialArray }) {
  const [arrayInput, setArrayInput] = useState(initialArray.join(', '));
  
  const handleChange = (e) => {
    setArrayInput(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Parse the input string into an array of numbers
      const newArray = arrayInput.split(',')
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => {
          const num = Number(item);
          if (isNaN(num)) {
            throw new Error(`"${item}" is not a valid number`);
          }
          return num;
        });
      
      if (newArray.length < 2) {
        throw new Error('Please enter at least 2 numbers');
      }
      
      // Call the parent's callback with the new array
      onArrayChange(newArray);
    } catch (error) {
      alert('Invalid input: ' + error.message);
    }
  };
  
  return (
    <div className="array-input">
      <h3>Custom Input Array</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={arrayInput}
          onChange={handleChange}
          placeholder="Enter numbers separated by commas"
        />
        <button type="submit">Update Array</button>
      </form>
      <p className="hint">Example: 64, 34, 25, 12, 22, 11, 90</p>
    </div>
  );
}

export default ArrayInput;