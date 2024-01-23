class NeuralNetwork {
    constructor(neuronCounts) {
        // Array to store levels of neurons
        this.levels = [];
        // Create levels based on the specified neuron counts
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    // Static method to perform feedforward through the network
    static feedForward(givenInputs, network) {
        // Initialize outputs using the first level's feedforward
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]
        );
        // Iterate through the levels and perform feedforward
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                outputs, network.levels[i]
            );
        }
        return outputs;
    }

    // Static method to mutate the network by adjusting weights and biases
    static mutate(network, amount = 1) {
        // Iterate through the levels of the network
        network.levels.forEach(level => {
            // Mutate biases
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                );
            }
            // Mutate weights
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
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

class Level {
    constructor(inputCount, outputCount) {
        // Arrays to store inputs, outputs, and biases
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        // 2D array to store weights connecting inputs to outputs
        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        // Randomize initial weights and biases
        Level.#randomize(this);
    }

    // Static method to randomize weights and biases for a given level
    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                // Assign random values between -1 and 1 to weights
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            // Assign random values between -1 and 1 to biases
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    // Static method to perform feedforward for a given level
    static feedForward(givenInputs, level) {
        // Copy given inputs to the level's inputs
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        // Iterate through outputs and calculate based on inputs, weights, and biases
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                // Sum the product of inputs, weights, and apply to the bias
                sum += level.inputs[j] * level.weights[j][i];
            }

            // If the sum is greater than the bias, set the output to 1, otherwise 0
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}
