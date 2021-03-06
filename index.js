const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

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
         y: [],
         //yo im doing this so I can easily calculate the x + y velocity during a yknow collision instead of doing complex math just trig
         prevX : [],
         prevY : []
      };
      this.vertexSize = 5;

      this.boundingBox = {
         xmin: 0,
         ymin: 0,
         xmax: 0,
         ymax: 0,
      }

      this.velocity = {
         x: 0,
         y: 0
      };

      this.position = {
         x: -10,
         y: -10
      };
      this.angle = 0;
      this.angularVelocity = 0;
      this.angularMomentum = 0;
      this.momentOfInertia = 0;
      this.mass = 1;
      this.simulation = false;
      



   }

   update() {
      if (this.simulation === true) {
         this.velocity.y += 0.5;
      }
      //saving the previous coords before stuff changes in case of collision calculation
      for (let i = 0; i < this.vertexCoords.x.length; i++) {
         this.vertexCoords.prevX[i] = this.vertexCoords.x[i];
      }

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y
      this.angle += this.angularVelocity;

      //find the vertices of the polygon using the centroid and rotate, then check for collisions
      let radians = (Math.PI / 180) * this.angle;
         let cos = Math.cos(radians);
         let sin = Math.sin(radians);

      for (let i = 0; i < this.vertices.x.length; i++) {
         this.vertexCoords.x[i] = (cos * this.vertices.x[i]) + (sin * this.vertices.y[i]) + this.position.x;
         this.vertexCoords.y[i] = (cos * this.vertices.y[i]) - (sin * this.vertices.x[i]) + this.position.y;
         
         
         //check for collisions
         if (this.vertexCoords.y[i] > canvas.height) {
            /*
            I'm going to be stupid and for now the rotational velocity is going to be calculated by taking the
            rotational linear velocity (like the distance travelled per frame) and making it into the rotational
            speed. I'm not gonna change the x velocity at all yet. the y velocity will just get flipped
            */
            //let velocity = this.velocity.y;
            //let linearAngularVelocity = (this.vertexCoords.x[i] - this.position.x) * this.angularVelocity;//linear velocity
            //this.angularVelocity = linearAngularVelocity / (this.vertices.radius[i] * 5); //angular velocity is linear velocity divided by the radius
            //this.velocity.y *= -1;
            //this.velocity.x = this.angularVelocity * -1;
            
            /*
            this will take the x and y velocity and make it into one velocity and find the angle it
            will be at as well
            */
            //let linearAngularMomentum = linearAngularVelocity 


            //first real attemp at this

            












            //let velocity = Math.sqrt(this.velocity.y ** 2 + this.velocity.x ** 2);
            //let angleVelocity = Math.arccos(velocity.x / velocity);
            

            //making it so the object is no longer colliding
            while (this.vertexCoords.y[i] > canvas.height) {
               //change position
               this.position.y--;
               //check again for collision
               this.vertexCoords.y[i] = (cos * this.vertices.y[i]) - (sin * this.vertices.x[i]) + this.position.y;
               }
         }
      }
      //do stuff to the polygon

      
   }

   draw() {
      
      //drawing polygon
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      

      
      ctx.moveTo(this.vertexCoords.x[0], this.vertexCoords.y[0]);
      for (let i = 1; i < this.vertices.x.length; i++) {
         ctx.lineTo(this.vertexCoords.x[i], this.vertexCoords.y[i]);
      }
      ctx.closePath();
      ctx.fill();

      //drawing centroid(center of mass)
      ctx.fillStyle = "red";
      ctx.fillRect(this.position.x, this.position.y, this.vertexSize, this.vertexSize)


      //drawing vertices
      for (let i = 0; i < this.vertices.x.length; i++) {
         ctx.fillStyle = "green";
         ctx.fillRect(this.vertexCoords.x[i], this.vertexCoords.y[i], this.vertexSize, this.vertexSize)
      }

   }

   addVertex(x, y, inertiaCalculations) {
      //for testing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
         this.vertices.radius[i] = Math.sqrt(this.vertices.x[i] ** 2 + this.vertices.y[i] ** 2)
      }

      //bounding box is defined relative to centroid
      this.boundingBox.xmin = this.position.x;
      this.boundingBox.ymin = this.position.y;

      for (let i = 0; i < this.vertices.x.length; i++) {
         if (this.vertices.x[i] + this.position.x < this.boundingBox.xmin) {
            this.boundingBox.xmin = this.vertices.x[i] + this.position.x;
            console.log('xmin');
         }
         if (this.vertices.y[i] + this.position.y < this.boundingBox.ymin) {
            this.boundingBox.ymin = this.vertices.y[i] + this.position.y;
            console.log('ymin');
         }
         if (this.vertices.x[i] + this.position.x > this.boundingBox.xmax) {
            this.boundingBox.xmax = this.vertices.x[i] + this.position.x;
            console.log(this.vertices.x[i] + this.position.x);
         }
         if (this.vertices.y[i] + this.position.y > this.boundingBox.ymax) {
            this.boundingBox.ymax = this.vertices.y[i] + this.position.y;
            console.log('ymax');
         }
         
      }

      /*
      find the moment of inertia by brute force averaging the force for every pixel of the polygon
      I wonder how stupid it will be to use raycasting to check whether every pixel is inside the polygon

      SoS (simulation of simplicity) has a better solution I am just to lazy to try to implement it. I
      need the raycasting anyways, but don't want to copy paste some rando code in case it goes wrong without
      understanding it
      */
      

      
      let rows = this.boundingBox.xmax - this.boundingBox.xmin;
      let columns = this.boundingBox.ymax - this.boundingBox.ymin;
      let boundingBoxArea = (rows) * (columns);
      console.log(boundingBoxArea);
      let average = 0;
      for (let r = this.boundingBox.xmin - 1; r < this.boundingBox.xmax + 1; r++) {
         console.log(r);
         for (let c = this.boundingBox.ymin - 1; c < this.boundingBox.ymax + 1; c++) {
            //console.log(c);
            console.log(this.raycasting(r, this.boundingBox.xmax + 1, c, c, polygon));
            if (this.raycasting(r, this.boundingBox.xmax + 1, c, c, polygon) === 'Collision') {
               ctx.fillStyle = "green";
               ctx.fillRect( r, c, 1, 1 );
               average += Math.sqrt(r ** 2 + c ** 2);//Pythagorean thearom thearum theorum
               //console.log(average)
            }
            
         }
      }
      
      /*
      moment of inertia is I = mr**2 so what I'm doing is getting the moment of inertia for a ton of point masses
      and I'm averaging them out
      */
      this.momentOfInertia = (average / boundingBoxArea) * this.mass;
      console.log(this.momentOfInertia);

      /* code used during debugging of bounding box
      ctx.fillStyle = 'green'
      ctx.beginPath();
      ctx.moveTo(this.boundingBox.xmin, this.boundingBox.ymin);
      ctx.lineTo(this.boundingBox.xmax, this.boundingBox.ymin);
      ctx.lineTo(this.boundingBox.xmax, this.boundingBox.ymax);
      ctx.lineTo(this.boundingBox.xmin, this.boundingBox.ymax);
      ctx.closePath();
      ctx.fill();
      */
   }
   /*
   the colidingPolygon perameter in my raycasting function is the other polygon that would be
    involved in the collision (it could also be this polygon to check if a pixel is inside the polygon or not)
    */
   raycasting(x1, x2, y1,y2, collidingPolygon) {
      let a1 = x2 - x1;
      let b1 = y2 - y1;
      let c1 = (x1 * y2) - (x2 * y1); //linear equation: ax + by + c = 0
      let equation1 = 0;
      let equation2 = 0;
      let arrayLength = collidingPolygon.vertices.x.length;
      let collisions = 0;


      //this checks for collisions iterating over every line seperately and filling out the linear equation
      for (let i = 0; i < arrayLength; i++) {
         //this is so the vertices list doesn't go out of range on the last iteration 
         let add = 1

         if (i === arrayLength - 1) {
            add = arrayLength - 1;
         }

         equation1 = (a1 * collidingPolygon.vertices.x[i]) + (b1 * collidingPolygon.vertices.y[i]) + c1;
         equation2 = (a1 * collidingPolygon.vertices.x[i + add]) + (b1 * collidingPolygon.vertices.y[i + add]) + c1;

         if (equation1 > 0 && equation2 > 0) {
            continue;
         }
         if (equation1 < 0 && equation2 < 0) {
            continue;
         }




         let a2 = collidingPolygon.vertices.x[i + add] - collidingPolygon.vertices.x[i];
         let b2 = collidingPolygon.vertices.y[i + add] - collidingPolygon.vertices.y[i];
         let c2 = (collidingPolygon.vertices.x[i] * collidingPolygon.vertices.y[i + add]) - (collidingPolygon.vertices.x[i + add] * collidingPolygon.vertices.y[i])
         
         equation1 = (a2 * x1) + (b2 * y1) + c2;
         equation2 = (a2 * x2) + (b2 * y2) + c2;

         if (equation1 > 0 && equation2 > 0) {
            continue;
         }
         if (equation1 < 0 && equation2 < 0) {
            continue;
         }

         if ((a1 * b2) - (a2 * b1) == 0) {
            console.log('Collinear!!!!!!!!!!!!!!!!!');
            return 'Collinear';
         }

         collisions += 1;

      }
      if (collisions % 2 === 0) {
         return 'Nothing';
      } else {
         return 'Collision'
      }
      
   }
   reset() {
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
      this.angularVelocity = 0;
      this.angularMomentum = 0;
      this.mass = 1;
      this.simulation = false;
   }


}
let polygonList = [];
polygon = new Polygon();
polygonList.append(polygon);

function collisionHandler(object) {
   for (let i = 0; i < objec.vertices.x.length; i++) {
      for (let polygons = 0; polygons < polygonList.length; polygons++) {
         /*if (polygonList[polygons] != currentPolygon) {}*/
         if (polygon.raycasting(object.vertices.x[i], object.vertices.x[i + 1], object.vertices.y[i],object.vertices.y[i], otherPolygon) === 'Collision') {
            //this is colliding script
            //let xKeneticEnergy = object.velocity.x * object.mass;
            //let yKeneticEnergy = object.velocity.y * object.mass;
            let angularKeneticEnergy = object.angularVelocity * object.momentOfInertia;

            //so I need to find the linear angular velocity to add that to the x and y velocities I'll just take the previous coords and do trig
            let xVelocity = object.vertexCoords.x - object.vertexCoords.prevX;
            let yVelocity = object.vertexCoords.y - object.vertexCoords.prevY;
            let xKeneticEnergy = xVelocity * object.mass;
            let yKeneticEnergy = yVelocity * object.mass;
            
         }
      }
   }
}


//this is the main function that runs the entire game
function game() {
   //ctx.clearRect(0, 0, canvas.width, canvas.height);
   polygon.update();
   polygon.draw();
}

 
setInterval(game, 15);//framerate (milliseconds per run of the main game function)


function findMousePos(event) {
   //needed to get mouse position relative to the canvas
   var rect = canvas.getBoundingClientRect();
   //adding mouse position to list of vertices
   if (polygon.simulation === false) {
      polygon.addVertex(event.clientX - rect.left, event.clientY - rect.top, 1)
   }
   console.log(event.clientX - rect.left, event.clientY - rect.top);
 }
 //checking for mouse click event
 canvas.addEventListener("click", findMousePos);

//this is checking for user input
window.addEventListener("keydown", function (event) {
   if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
   } 
 
   switch (event.key) {

      case "s":
         polygon.simulation = true;
         break;
      
      case "r":
         polygon.simulation = false;
         polygon.reset();

         break;

      default:
         return; // Quit when this doesn't handle the key event.
   }
})