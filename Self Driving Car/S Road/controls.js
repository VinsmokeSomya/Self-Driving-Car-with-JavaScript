// Class representing controls for the self-driving car simulation
class Controls {
   // Constructor to initialize control states based on the control type
   constructor(type) {
      // Initialize control states to false by default
      this.forward = false;
      this.left = false;
      this.right = false;
      this.reverse = false;

      // Based on the control type, set up the appropriate control mechanism
      switch (type) {
         case "KEYS":
            // If the control type is "KEYS", add keyboard listeners
            this.#addKeyboardListeners();
            break;
         case "DUMMY":
            // If the control type is "DUMMY", set the forward control to true (dummy mode)
            this.forward = true;
            break;
      }
   }

   // Private method to add keyboard event listeners for arrow keys
   #addKeyboardListeners() {
      // Add keydown listener to set control states to true when corresponding keys are pressed
      document.onkeydown = (event) => {
         switch (event.key) {
            case "ArrowLeft":
               this.left = true;
               break;
            case "ArrowRight":
               this.right = true;
               break;
            case "ArrowUp":
               this.forward = true;
               break;
            case "ArrowDown":
               this.reverse = true;
               break;
         }
      };

      // Add keyup listener to set control states to false when corresponding keys are released
      document.onkeyup = (event) => {
         switch (event.key) {
            case "ArrowLeft":
               this.left = false;
               break;
            case "ArrowRight":
               this.right = false;
               break;
            case "ArrowUp":
               this.forward = false;
               break;
            case "ArrowDown":
               this.reverse = false;
               break;
         }
      };
   }
}
