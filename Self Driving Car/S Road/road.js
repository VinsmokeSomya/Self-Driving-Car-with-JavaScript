// Class representing a road in a self-driving car simulation
class Road{
   // Constructor to initialize road parameters and borders
   constructor(x, width, laneCount = 3){
      this.x = x; // X-coordinate of the road's center
      this.width = width; // Width of the road
      this.laneCount = laneCount; // Number of lanes
      this.left = x - width / 4; // Left boundary of the road
      this.right = x + width / 4; // Right boundary of the road

      const infinity = 10000; // A large value for representing infinity
      this.top = -infinity; // Top boundary of the road (set to negative infinity)
      this.bottom = infinity; // Bottom boundary of the road (set to positive infinity)

      // Define corners of the road
      const topLeft = { x: this.left, y: this.top };
      const bottomLeft = { x: this.left, y: this.bottom };
      const topRight = { x: this.right, y: this.top };
      const bottomRight = { x: this.right, y: this.bottom };

      // Initialize road borders with the four corners
      this.borders = [
         [topLeft],
         [topRight]
      ];

      // Add intermediate points for creating a curvy road appearance
      for(let y = -1000; y <= 0; y++){
         const x = Math.sin(y * 0.01) * 50;
         this.borders[0].push({ x: x + this.left, y: y });
         this.borders[1].push({ x: x + this.right, y: y });
      }

      // Complete the road borders by connecting to the bottom corners
      this.borders[0].push(bottomLeft);
      this.borders[1].push(bottomRight);
   }

   // Method to get the center of a specific lane
   getLaneCenter(laneIndex){
      const laneWidth = this.width / this.laneCount;
      // Calculate and return the x-coordinate of the center of the specified lane
      return this.left + laneWidth / 2 +
         Math.min(laneIndex, this.laneCount - 1) * laneWidth;
   }

   // Method to draw the road on a given canvas context
   draw(ctx){
      ctx.lineWidth = 5; // Set the line width for drawing road markings
      ctx.strokeStyle = "white"; // Set the stroke color for road markings

      /*
      // Draw dashed lane lines (commented out for a continuous road appearance)
      ctx.setLineDash([20,20]);
      for(let i = 1; i <= this.laneCount - 1; i++){
         const x = lerp(
            this.left,
            this.right,
            i / this.laneCount
         );
         ctx.beginPath();
         ctx.moveTo(x, this.top);
         ctx.lineTo(x, this.bottom);
         ctx.stroke();
      }
      */

      // Draw the road borders using dashed lines for a curvy appearance
      ctx.setLineDash([20, 20]);
      this.borders.forEach(border => {
         ctx.beginPath();
         ctx.moveTo(border[0].x, border[0].y);
         // Connect the intermediate points to create the road borders
         for(let i = 1; i < border.length; i++){
            ctx.lineTo(border[i].x, border[i].y);
         }
         ctx.stroke();
      });

      // Reset line dash to draw solid lines for other elements
      ctx.setLineDash([]);
   }
}
