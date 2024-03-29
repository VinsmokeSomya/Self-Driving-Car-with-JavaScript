class Visualizer {
    // Static method to draw the neural network on the given context
    static drawNetwork(ctx, network) {
        // Set up margin and dimensions
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        // Calculate the height of each level in the network
        const levelHeight = height / network.levels.length;

        // Iterate over each level in reverse order to draw from output to input
        for (let i = network.levels.length - 1; i >= 0; i--) {
            // Calculate the top position for the current level
            const levelTop = top + lerp(
                height - levelHeight,
                0,
                network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
            );

            // Set a dashed line for connections between nodes
            ctx.setLineDash([7, 3]);
            // Draw the current level
            Visualizer.drawLevel(ctx, network.levels[i],
                left, levelTop,
                width, levelHeight,
                i == network.levels.length - 1 ? ['🠉', '🠈', '🠊', '🠋'] : []
            );
        }
    }

    // Static method to draw a single level of the neural network
    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;

        const { inputs, outputs, weights, biases } = level;

        // Iterate over input nodes
        for (let i = 0; i < inputs.length; i++) {
            // Iterate over output nodes
            for (let j = 0; j < outputs.length; j++) {
                // Draw connections between nodes
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top
                );
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        const nodeRadius = 18;

        // Draw input nodes
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        // Draw output nodes
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            // Draw the bias value
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw output labels if provided
            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadius * 1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
            }
        }
    }

    // Private static method to calculate the x-coordinate for a node
    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}
