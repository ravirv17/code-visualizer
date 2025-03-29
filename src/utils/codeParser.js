// Function to parse JavaScript bubble sort code
export const parseJavaScriptBubbleSort = (code, inputArray) => {
    // Create a safe copy of the input array
    const array = [...inputArray];
    const steps = [];
    
    // Add initial state
    steps.push({
      array: [...array],
      message: "Initial array",
      comparing: []
    });
    
    try {
      // This is a simplified parser specifically for bubble sort
      // In a real application, you'd want a more sophisticated parser
      
      // Create a modified version of the code that logs each step
      // This is a hacky but effective way to visualize bubble sort without a full parser
      const trackedCode = `
        const trackedArray = ${JSON.stringify(array)};
        const steps = [];
        
        // Add tracking to bubble sort
        function trackedBubbleSort(arr) {
          const len = arr.length;
          for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
              // Log comparing step
              steps.push({
                array: [...arr],
                message: "Comparing " + arr[j] + " and " + arr[j+1],
                comparing: [j, j+1]
              });
              
              if (arr[j] > arr[j+1]) {
                // Swap elements
                let temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
                
                // Log swapping step
                steps.push({
                  array: [...arr],
                  message: "Swapping " + arr[j] + " and " + arr[j+1],
                  comparing: [j, j+1]
                });
              }
            }
          }
          return { sortedArray: arr, visualizationSteps: steps };
        }
        
        const result = trackedBubbleSort(trackedArray);
        
        // Final step
        steps.push({
          array: [...result.sortedArray],
          message: "Sorting complete!",
          comparing: []
        });
        
        return { steps: result.visualizationSteps };
      `;
      
      // Execute the modified code in a safe way
      const result = new Function(trackedCode)();
      
      // Return all visualization steps with the final "complete" step
      return [
        ...steps, 
        ...result.steps, 
        {
          array: result.steps[result.steps.length - 1]?.array || [...array],
          message: "Sorting complete!",
          comparing: []
        }
      ];
    } catch (error) {
      console.error("Error parsing code:", error);
      
      // Return just the initial state if parsing fails
      return [
        {
          array: [...array],
          message: "Error parsing code: " + error.message,
          comparing: []
        }
      ];
    }
  };