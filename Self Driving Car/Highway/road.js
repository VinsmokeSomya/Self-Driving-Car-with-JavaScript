class Road {
    constructor(x, width, laneCount = 3) {
        // Initialize road properties
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        // Calculate left and right borders based on the width
        this.left = x - width / 2;
        this.right = x + width / 2;

        // Set infinity values for top and bottom to create extended borders
        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        // Define corner points of the road borders
        const topLeft = { x: this.left, y: this.top };
        const topRight = { x: this.right, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };
        const bottomRight = { x: this.right, y: this.bottom };

        // Create borders as an array of arrays containing pairs of corner points
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    // Function to get the center of a specific lane based on lane index
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 +
            Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    }

    // Function to draw the road on a canvas context
    draw(ctx) {
        // Set line properties for drawing lanes
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        // Draw lane markings with dashed lines
        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp(
                this.left,
                this.right,
                i / this.laneCount
            );

            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        // Reset line dash for drawing road borders
        ctx.setLineDash([]);

        // Draw road borders using stored corner points
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}
