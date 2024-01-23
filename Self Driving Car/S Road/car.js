// Class representing a car in the self-driving car simulation
class Car {
   // Constructor to initialize car properties based on input parameters
   constructor(x, y, width, height, controlType, maxSpeed = 3) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;

      this.speed = 0;
      this.acceleration = 0.2;
      this.maxSpeed = maxSpeed;
      this.friction = 0.05;
      this.angle = 0;

      this.damaged = false;

      // Determine whether the car uses AI for control or is a dummy
      this.useBrain = controlType == "AI";

      // Initialize sensor and neural network if not a dummy
      if (controlType != "DUMMY") {
         this.sensor = new Sensor();
         this.brain = new NeuralNetwork([this.sensor.rayCount, 4]);
      }

      // Initialize controls based on the control type
      this.controls = new Controls(controlType);
   }

   // Method to update the car's position and assess damage
   update(roadBorders, traffic) {
      if (!this.damaged) {
         // Move the car and update its polygon representation
         this.#move();
         this.polygon = this.#createPolygon();
         // Assess damage based on intersections with road borders and traffic
         this.damaged = this.#assessDamage(roadBorders, traffic);
      }

      // If the car has a sensor, update sensor readings and use neural network
      if (this.sensor) {
         this.sensor.update(this.x, this.y, this.angle, roadBorders, traffic);
         const offsets = this.sensor.readings.map(s => (s == null ? 0 : 1 - s.offset));
         const outputs = NeuralNetwork.feedForward(offsets, this.brain);

         // If using AI control, update controls based on neural network outputs
         if (this.useBrain) {
            this.controls.forward = outputs[0];
            this.controls.left = outputs[1];
            this.controls.right = outputs[2];
            this.controls.reverse = outputs[3];
         }
      }
   }

   // Private method to assess damage based on intersections with road borders and traffic
   #assessDamage(roadBorders, traffic) {
      for (let i = 0; i < roadBorders.length; i++) {
         if (polysIntersect([...this.polygon, this.polygon[0]], roadBorders[i])) {
            return true;
         }
      }
      for (let i = 0; i < traffic.length; i++) {
         const poly = traffic[i].polygon;
         if (polysIntersect([...this.polygon, this.polygon[0]], [...poly, poly[0]])) {
            return true;
         }
      }
      return false;
   }

   // Private method to create the polygon representation of the car
   #createPolygon() {
      const points = [];
      const rad = Math.hypot(this.width, this.height) / 2;
      const alpha = Math.atan2(this.width, this.height);

      // Calculate the four points of the polygon based on the car's position and orientation
      points.push({
         x: this.x - Math.sin(this.angle - alpha) * rad,
         y: this.y - Math.cos(this.angle - alpha) * rad,
      });
      points.push({
         x: this.x - Math.sin(this.angle + alpha) * rad,
         y: this.y - Math.cos(this.angle + alpha) * rad,
      });
      points.push({
         x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
         y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
      });
      points.push({
         x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
         y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
      });

      return points;
   }

   // Private method to handle the movement of the car
   #move() {
      // Adjust speed based on controls and friction
      if (this.controls.forward) {
         this.speed += this.acceleration;
      }
      if (this.controls.reverse) {
         this.speed -= this.acceleration;
      }

      // Adjust angle based on controls
      if (this.speed != 0) {
         const flip = this.speed > 0 ? 1 : -1;
         if (this.controls.left) {
            this.angle += 0.03 * flip;
         }
         if (this.controls.right) {
            this.angle -= 0.03 * flip;
         }
      }

      // Limit speed within specified bounds
      if (this.speed > this.maxSpeed) {
         this.speed = this.maxSpeed;
      }
      if (this.speed < -this.maxSpeed / 2) {
         this.speed = -this.maxSpeed / 2;
      }

      // Apply friction to slow down the car
      if (this.speed > 0) {
         this.speed -= this.friction;
      }
      if (this.speed < 0) {
         this.speed += this.friction;
      }

      // Stop the car if speed is below a certain threshold
      if (Math.abs(this.speed) < this.friction) {
         this.speed = 0;
      }

      // Update the position based on speed and angle
      this.x -= Math.sin(this.angle) * this.speed;
      this.y -= Math.cos(this.angle) * this.speed;
   }

   // Method to draw the car on the canvas, optionally drawing the sensor as well
   draw(ctx, drawSensor = false) {
      // Set the fill style based on whether the car is damaged
      if (this.damaged) {
         ctx.fillStyle = "gray";
      } else {
         ctx.fillStyle = "black";
      }

      // Draw the car polygon
      ctx.beginPath();
      ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
      for (let i = 1; i < this.polygon.length; i++) {
         ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
      }
      ctx.fill();

      // If the car has a sensor and drawSensor is true, draw the sensor as well
      if (this.sensor && drawSensor) {
         this.sensor.draw(ctx);
      }
   }
}
