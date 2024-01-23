// Class representing a Neural Network
class NeuralNetwork{
   // Constructor to initialize the network levels based on neuron counts
   constructor(neuronCounts){
      this.levels = [];
      // Create levels based on the specified neuron counts
      for(let i = 0; i < neuronCounts.length - 1; i++){
         this.levels.push(new Level(
            neuronCounts[i], neuronCounts[i + 1]
         ));
      }
   }

   // Static method to perform feedforward operation in the network
   static feedForward(givenInputs, network){
      let outputs = Level.feedForward(
         givenInputs, network.levels[0]
      );

      // Iterate through network levels and perform feedforward operation
      for(let i = 1; i < network.levels.length; i++){
         outputs = Level.feedForward(
            outputs, network.levels[i]
         );
      }

      return outputs;
   }

   // Static method to mutate the network weights and biases
   static mutate(network, amount = 1){
      network.levels.forEach(level => {
         // Mutate biases
         for(let i = 0; i < level.biases.length; i++){
            level.biases[i] = lerp(
               level.biases[i],
               Math.random() * 2 - 1,
               amount
            );
         }

         // Mutate weights
         for(let i = 0; i < level.weights.length; i++){
            for(let j = 0; j < level.weights[i].length; j++){
               level.weights[i][j] = lerp(
                  level.weights[i][j],
                  Math.random() * 2 - 1,
                  amount
               );
            }
         }
      });
   }
}

// Class representing a level in the Neural Network
class Level{
   // Constructor to initialize a level with specified input and output neuron counts
   constructor(inputCount, outputCount){
      this.inputs = new Array(inputCount);
      this.outputs = new Array(outputCount);
      this.biases = new Array(outputCount);

      this.weights = [];
      for(let i = 0; i < inputCount; i++){
         this.weights[i] = new Array(outputCount);
      }

      // Randomize the weights and biases for the initial state of the level
      Level.#randomize(this);
   }

   // Private static method to randomize the weights and biases of a level
   static #randomize(level){
      for(let i = 0; i < level.inputs.length; i++){
         for(let j = 0; j < level.outputs.length; j++){
            // Assign random values between -1 and 1 to weights
            level.weights[i][j] = Math.random() * 2 - 1;
         }
      }

      for(let i = 0; i < level.biases.length; i++){
         // Assign random values between -1 and 1 to biases
         level.biases[i] = Math.random() * 2 - 1;
      }
   }

   // Static method to perform the feedforward operation for a level
   static feedForward(givenInputs, level){
      level.inputs = [...givenInputs];

      // Iterate through output neurons and calculate their values
      for(let i = 0; i < level.outputs.length; i++){
         let sum = 0;
         for(let j = 0; j < level.inputs.length; j++){
            sum += level.inputs[j] * level.weights[j][i];
         }

         // Activate the neuron based on the sum and bias
         if(sum > level.biases[i]){
            level.outputs[i] = 1;
         } else {
            level.outputs[i] = 0;
         } 
      }

      return level.outputs;
   }
}
