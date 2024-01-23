// Class representing a sensor for a self-driving car simulation
class Sensor{
   // Constructor to initialize sensor parameters
   constructor(){
      this.rayCount = 5; // Number of rays emitted by the sensor
      this.rayLength = 150; // Length of each ray
      this.raySpread = Math.PI/4; // Angle spread of rays

      this.rays = []; // Array to store ray endpoints
      this.readings = []; // Array to store sensor readings
   }

   // Method to update sensor readings based on the car's position, orientation, road borders, and traffic
   update(x, y, angle, roadBorders, traffic){
      this.#castRays(x, y, angle); // Cast rays from the car's position and orientation
      this.readings = []; // Clear previous readings

      // Iterate through each ray and calculate sensor readings
      for(let i = 0; i < this.rays.length; i++){
         // Get sensor reading for the current ray
         this.readings.push(
            this.#getReading(this.rays[i], roadBorders, traffic)
         );
      }
   }

   // Private method to calculate the sensor reading for a specific ray
   #getReading(ray, roadBorders, traffic){
      let touches = []; // Array to store intersection points with road borders and traffic polygons

      // Check for intersections with road borders
      roadBorders.forEach(border => {
         for(let i = 1; i < border.length; i++){
            const touch = getIntersection(
               ray[0],
               ray[1],
               border[i - 1],
               border[i]
            );
            if(touch){
               touches.push(touch);
            }
         }
      });

      // Check for intersections with traffic polygons
      for(let i = 0; i < traffic.length; i++){
         const poly = traffic[i].polygon;
         for(let j = 0; j < poly.length; j++){
            const value = getIntersection(
               ray[0],
               ray[1],
               poly[j],
               poly[(j + 1) % poly.length]
            );
            if(value){
               touches.push(value);
            }
         }
      }

      // If no intersections, return null; otherwise, find the closest intersection
      if(touches.length == 0){
         return null;
      } else {
         const offsets = touches.map(e => e.offset);
         const minOffset = Math.min(...offsets);
         return touches.find(e => e.offset == minOffset);
      }
   }

   // Private method to cast rays from the car's position and orientation
   #castRays(x, y, angle){
      this.rays = []; // Clear previous rays

      // Iterate through the specified number of rays
      for(let i = 0; i < this.rayCount; i++){
         // Calculate the angle of the current ray
         const rayAngle = lerp(
            this.raySpread / 2,
            -this.raySpread / 2,
            this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
         ) + angle;

         // Calculate the start and end points of the ray
         const start = { x, y };
         const end = {
            x: x - Math.sin(rayAngle) * this.rayLength,
            y: y - Math.cos(rayAngle) * this.rayLength
         };

         // Store the ray as a pair of start and end points
         this.rays.push([start, end]);
      }
   }

   // Method to draw the sensor rays on a given canvas context
   draw(ctx){
      for(let i = 0; i < this.rayCount; i++){
         let end = this.rays[i][1];
         // If there is a reading for the ray, update the end point
         if(this.readings[i]){
            end = this.readings[i];
         }
         // Draw the sensor ray
         ctx.beginPath();
         ctx.lineWidth = 2;
         ctx.strokeStyle = "yellow";
         ctx.moveTo(
            this.rays[i][0].x,
            this.rays[i][0].y
         );
         ctx.lineTo(
            end.x,
            end.y
         );
         ctx.stroke();
         /*
         ctx.strokeStyle="black";
         ctx.moveTo(
            this.rays[i][1].x,
            this.rays[i][1].y
         );
         ctx.lineTo(
            end.x,
            end.y
         );
         ctx.stroke();*/
      }
   }
}
