// Linear interpolation function
function lerp(a, b, t){
   // Linear interpolation formula: a + (b - a) * t
   return a + (b - a) * t;
}

// Function to find the intersection point of two line segments (A, B) and (C, D)
function getIntersection(A, B, C, D){
   // Calculate the numerator and denominator components for the parametric equations
   const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
   const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
   const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

   // Check if the line segments intersect
   if (bottom != 0){
      const t = tTop / bottom;
      const u = uTop / bottom;
      
      // Check if the intersection point is within the line segments
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1){
         // Calculate the intersection point and return it with an offset value
         return {
            x: lerp(A.x, B.x, t),
            y: lerp(A.y, B.y, t),
            offset: t
         };
      }
   }

   // If no intersection or invalid intersection, return null
   return null;
}

// Function to check if two polylines intersect
function polysIntersect(poly1, poly2){
   // Iterate through each line segment in both polylines
   for (let i = 0; i < poly1.length - 1; i++){
      for (let j = 0; j < poly2.length - 1; j++){
         // Check for intersection between the line segments
         const touch = getIntersection(
            poly1[i],
            poly1[i + 1],
            poly2[j],
            poly2[j + 1]
         );
         // If an intersection is found, return true
         if (touch){
            return true;
         }
      }
   }

   // If no intersection is found, return false
   return false;
}

// Function to get RGBA color representation based on a numerical value
function getRGBA(value){
   // Calculate alpha as the absolute value of the input
   const alpha = Math.abs(value);
   // Determine RGB components based on the sign of the input value
   const R = value < 0 ? 0 : 255;
   const G = R;
   const B = value > 0 ? 0 : 255;
   // Return the RGBA color string
   return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}
