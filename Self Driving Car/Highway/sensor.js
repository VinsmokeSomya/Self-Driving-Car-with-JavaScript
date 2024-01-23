class Sensor {
    constructor(car) {
        // Initialize sensor properties
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;

        // Arrays to store ray information
        this.rays = [];
        this.readings = [];
    }

    // Update function to cast rays and get readings
    update(roadBorders, traffic) {
        // Cast rays and get readings
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(
                    this.rays[i],
                    roadBorders,
                    traffic
                )
            );
        }
    }

    // Get the reading of a ray by checking intersections with road borders and traffic polygons
    #getReading(ray, roadBorders, traffic) {
        // Array to store intersection points
        let touches = [];

        // Check intersections with road borders
        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if (touch) {
                touches.push(touch);
            }
        }

        // Check intersections with traffic polygons
        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j + 1) % poly.length]
                );
                if (value) {
                    touches.push(value);
                }
            }
        }

        // If no intersections, return null; otherwise, find the closest intersection
        if (touches.length == 0) {
            return null;
        } else {
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
        }
    }

    // Cast rays in front of the car based on ray count, length, and spread
    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x -
                    Math.sin(rayAngle) * this.rayLength,
                y: this.car.y -
                    Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    // Draw the rays on a canvas context
    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            // Determine the end point of the ray based on readings
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }

            // Draw the ray with a yellow color
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

            // Draw the segment of the ray with a black color
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}
