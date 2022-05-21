const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Polygon {
   constructor() {
      this.vertices = {
         x : [],
         y : []
      };
      this.vertexSize = 5;

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
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y

      //find the vertices of the polygon using the centroid and check for collisions
      for (let i = 0; i < this.vertices.length; i++) {
         
      }

      //do stuff to the polygon

      
   }

   draw() {
      
      //drawing polygon
      c.fillStyle = "yellow";
      c.beginPath();
      //I'm adding the position of the polygon to the moveTo because all the vertices are defined in relation to the center of mass
      c.moveTo(this.vertices.x[0] + this.position.x, this.vertices.y[0] + this.position.y);
      for (let i = 1; i < this.vertices.x.length; i++) {
         c.lineTo(this.vertices.x[i] + this.position.x, this.vertices.y[i] + this.position.y);
      }
      c.closePath();
      c.fill();

      //drawing centroid(center of mass)
      c.fillStyle = "red";
      c.fillRect(this.position.x, this.position.y, this.vertexSize, this.vertexSize)


      //drawing vertices
      for (let i = 0; i < this.vertices.x.length; i++) {
         c.fillStyle = "green";
         c.fillRect(this.vertices.x[i] + this.position.x, this.vertices.y[i] + this.position.y, this.vertexSize, this.vertexSize)
      }

   }

   addVertex(x, y) {
      //finding absolute coords of vertices
      for (let i = 0; i < this.vertices.x.length; i++) {
         this.vertices.x[i] += this.position.x;
         this.vertices.y[i] += this.position.y;
      }

      //adding new vertex to list of vertices
      polygon.vertices.x.push(x);
      polygon.vertices.y.push(y);

      //finding the centroid of the polygon by averaging all the vertices
      let allTheXVertices = 0;
      let allTheYVertices = 0;
      for (let i = 0; i < this.vertices.x.length; i++) {
         
         allTheXVertices += this.vertices.x[i];
         allTheYVertices += this.vertices.y[i];
      }
      this.position.x = allTheXVertices / this.vertices.x.length;
      this.position.y = allTheYVertices / this.vertices.y.length;

      //define the vertices of the polygon in relation to the center of mass
      for (let i = 0; i < this.vertices.x.length; i++) { 
         this.vertices.x[i] -= this.position.x;
         this.vertices.y[i] -= this.position.y;
      }

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
   //adding mouse position to list of vertices
   
   polygon.addVertex(event.clientX - rect.left, event.clientY - rect.top)
   console.log(event.clientX - rect.left, event.clientY - rect.top);
   
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
         polygon.velocity.x = 1;
         break;

      default:
         return; // Quit when this doesn't handle the key event.
   }
})