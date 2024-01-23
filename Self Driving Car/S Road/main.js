// Set the height and width of the car canvas and network canvas
carCanvas.height = window.innerHeight;
carCanvas.width = 200;
networkCanvas.height = window.innerHeight;
networkCanvas.width = 298;

// Get 2D rendering contexts for both canvases
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// Create a road object with a width of 90% of the car canvas width
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// Number of cars in the simulation
const N = 100;

// Generate an array of cars for the simulation
const cars = generateCars(N);

// Array containing a dummy traffic car (not used in main simulation)
const traffic = [new Car(100, -100, 30, 50, "DUMMY", 2)];

// Initialize the best car with the first car in the array
let bestCar = cars[0];

// Check if a saved "bestBrain" exists in localStorage and apply it to all cars
if (localStorage.getItem("bestBrain")) {
   for (let i = 0; i < cars.length; i++) {
      // Apply the saved brain to each car
      cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
      // Mutate the brain for all cars except the first one
      if (i > 0) {
         NeuralNetwork.mutate(cars[i].brain, 0.4);
      }
   }
}

// Start the animation loop
animate();

// Animation loop function
function animate() {
   // Update the position of the dummy traffic car
   for (let i = 0; i < traffic.length; i++) {
      traffic[i].update([], []);
   }

   // Update the position of each car based on the road borders and traffic
   for (let i = 0; i < cars.length; i++) {
      cars[i].update(road.borders, traffic);
   }

   // Find the best car based on the lowest y-coordinate
   bestCar = cars.find(
      c => c.y == Math.min(...cars.map(c => c.y))
   );

   // Adjust canvas height based on the window height
   carCanvas.height = window.innerHeight;
   networkCanvas.height = window.innerHeight;

   // Translate the car canvas to focus on the best car's position
   carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

   // Draw the road, traffic, and cars on the car canvas
   road.draw(carCtx);
   for (let i = 0; i < traffic.length; i++) {
      traffic[i].draw(carCtx);
   }

   // Draw a slightly transparent representation of all cars
   carCtx.globalAlpha = 0.2;
   for (let i = 0; i < cars.length; i++) {
      cars[i].draw(carCtx);
   }

   // Reset the transparency for subsequent drawings
   carCtx.globalAlpha = 1;

   // Draw the best car with a special highlight
   bestCar.draw(carCtx, true);

   // Draw the neural network visualization on the network canvas
   Visualizer.drawNetwork(networkCtx, bestCar.brain);

   // Request the next animation frame
   requestAnimationFrame(animate);
}

// Function to generate an array of cars with AI for the simulation
function generateCars(N) {
   const cars = [];
   for (let i = 1; i <= N; i++) {
      cars.push(new Car(100, 100, 30, 50, "AI"));
   }
   return cars;
}

// Function to save the current best brain configuration to localStorage
function save() {
   localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// Function to discard the saved best brain from localStorage
function discard() {
   localStorage.removeItem("bestBrain");
}
