const carCanvas = document.getElementById("carCanvas");
// Set the initial width of the car canvas
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
// Set the initial width of the network canvas
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// Create a road object with a specified center and width
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// Number of cars to generate
const N = 100;

// Generate an array of cars with AI control
const cars = generateCars(N);

// Initialize the best car with the first car in the array
let bestCar = cars[0];

// Check if there is a previously saved best brain in local storage
if (localStorage.getItem("bestBrain")) {
    // Load the best brain from local storage for each car
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        // Mutate the brain for all cars except the first one
        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

// Initial traffic configuration with dummy cars
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];

// Start the animation loop
animate();

// Save the best brain to local storage
function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// Discard the best brain from local storage
function discard() {
    localStorage.removeItem("bestBrain");
}

// Generate an array of cars with AI control
function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        // Generate cars in the center lane with AI control
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

// Animation loop
function animate(time) {
    // Update and draw the dummy traffic
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    // Update and draw the AI-controlled cars
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    // Find the car with the minimum y-coordinate (closest to the top)
    bestCar = cars.find(
        c => c.y === Math.min(...cars.map(c => c.y))
    );

    // Adjust canvas heights to the window's inner height
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    // Save and translate the car canvas to follow the best car
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    // Draw the road, traffic, and cars on the car canvas
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha = 1;

    // Draw the best car with additional information
    bestCar.draw(carCtx, true);

    // Restore the car canvas to its original state
    carCtx.restore();

    // Apply a scrolling effect to the network visualization
    networkCtx.lineDashOffset = -time / 50;

    // Draw the neural network visualization on the network canvas
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    // Request the next animation frame
    requestAnimationFrame(animate);
}
