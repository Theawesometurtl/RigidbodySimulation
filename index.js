const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Polygon {
   constructor() {
      this.vertices = {
         x : [],
         y: [],
         radius: []
      };

      this.vertexCoords = {
         x: [],
         y: []
      };
      this.vertexSize = 5;

      this.velocity = {
         x: 0,
         y: 0
      };

      this.position = {
         x: -10,
         y: -10
      };
      this.angle = 0;
      this.rotationalVelocity = 0;
      this.rotationalMomentum = 0;
      this.mass = 1;

   }

   update() {
      this.velocity.y += 0.5;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y
      this.angle += this.rotationalVelocity;

      //find the vertices of the polygon using the centroid and rotate, then check for collisions
      let radians = (Math.PI / 180) * this.angle;
         let cos = Math.cos(radians);
         let sin = Math.sin(radians);
      

      for (let i = 0; i < this.vertices.x.length; i++) {
         this.vertexCoords.x[i] = ((cos * (this.vertices.x[i])) + (sin * (this.vertices.y[i])) + this.position.x);
         this.vertexCoords.y[i] = ((cos * (this.vertices.y[i])) - (sin * (this.vertices.x[i])) + this.position.y);
         
         //check for collisions
         if (this.vertexCoords.y[i] > canvas.height) {
            if (this.velocity.y > 0) {
               /*
               I'm going to be stupid and for now the rotational velocity is going to be calculated by taking the
               rotational linear velocity (like the distance travelled per frame) and making it into the rotational
               speed. I'm not gonna change the x velocity at all yet. the y velocity will just get flipped
               */
               let linearAngularVelocity = this.vertices.x[i] * this.velocity.y;//linear velocity
               this.rotationalVelocity += linearAngularVelocity / this.vertices.radius[i]; //angular velocity is linear velocity divided by the radius
               this.velocity.y *= -1;
            }
         }
      }
      //do stuff to the polygon

      
   }

   draw() {
      
      //drawing polygon
      c.fillStyle = "yellow";
      c.beginPath();
      

      
      c.moveTo(this.vertexCoords.x[0], this.vertexCoords.y[0]);
      for (let i = 1; i < this.vertices.x.length; i++) {
         c.lineTo(this.vertexCoords.x[i], this.vertexCoords.y[i]);
      }
      c.closePath();
      c.fill();

      //drawing centroid(center of mass)
      c.fillStyle = "red";
      c.fillRect(this.position.x, this.position.y, this.vertexSize, this.vertexSize)


      //drawing vertices
      for (let i = 0; i < this.vertices.x.length; i++) {
         c.fillStyle = "green";
         c.fillRect(this.vertexCoords.x[i], this.vertexCoords.y[i], this.vertexSize, this.vertexSize)
         //console.log(i)
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

function rotate(cx, cy, x, y, angle) {
   
}

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
         polygon.velocity.y = 1;
         polygon.rotationalVelocity = 1;
         break;

      default:
         return; // Quit when this doesn't handle the key event.
   }
})