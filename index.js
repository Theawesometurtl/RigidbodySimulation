const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Polygon {
   constructor() {
      this.verticies = {
         x : [],
         y : []
      };
      this.verticieSize = 5;

      this.velocity = {
         x: 0,
         y: 0
      };

      this.position = {
         x: 0,
         y: 0
      };

   }

   update() {
      

      //do stuff to the polygon

      
   }

   draw() {
      
      //drawing polygon
      c.fillStyle = "yellow";
      c.beginPath();
      c.moveTo(this.verticies.x[0], this.verticies.y[0]);
      for (let i = 1; i < this.verticies.x.length; i++) {
         c.lineTo(this.verticies.x[i], this.verticies.y[i]);
      }
      c.closePath();
      c.fill();

      //drawing centroid(center of mass)
      c.fillStyle = "red";
      c.fillRect(this.position.x, this.position.y, this.verticieSize, this.verticieSize)


      //drawing verticies
      for (let i = 0; i < this.verticies.x.length; i++) {
         c.fillStyle = "green";
         c.fillRect(this.verticies.x[i], this.verticies.y[i], this.verticieSize, this.verticieSize)
      }

   }


   create() {
      //finding the centroid of the polygon by averaging all the vertices
      let allTheXVertices = 0;
      let allTheYVertices = 0;
      for (let i = 0; i < this.verticies.x.length; i++) {
         
         allTheXVertices += this.verticies.x[i]
         allTheYVertices += this.verticies.y[i]
      }
      this.position.x = allTheXVertices / this.verticies.x.length;
      this.position.y = allTheYVertices / this.verticies.y.length;
   }
}

polygon = new Polygon();

//this is the main function that runs the entire game
function game() {
   c.clearRect(0, 0, canvas.width, canvas.height);
   polygon.update();
   polygon.draw();
}

 
setInterval(game, 15);//framerate (milliseconds per run of the main game function)


function printMousePos(event) {
   //needed to get mouse position relative to the canvas
   var rect = canvas.getBoundingClientRect();
   //adding mouse position to list of verticies
   polygon.verticies.x.push(event.clientX - rect.left);
   polygon.verticies.y.push(event.clientY - rect.top);
   console.log(event.clientX - rect.left, event.clientY - rect.top);
   polygon.create();
 }
 //checking for mouse click event
 canvas.addEventListener("click", printMousePos);

//this is checking for user input
window.addEventListener("keydown", function (event) {
   if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
   } 
 
   switch (event.key) {

      case "c":
         
         break;

      default:
         return; // Quit when this doesn't handle the key event.
   }
})