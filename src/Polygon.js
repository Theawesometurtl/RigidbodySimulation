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
            let linearAngularVelocity = (this.vertexCoords.x[i] - this.position.x) + this.angularVelocity;//linear velocity
            this.angularVelocity = linearAngularVelocity / (this.vertices.radius[i] * .25); //angular velocity is linear velocity divided by the radius
            this.velocity.y *= -1;
            this.velocity.x = -this.angularVelocity;

            
             
             /*
             this will take the x and y velocity and make it into one velocity and find the angle it
             will be at as well
             */
            //let linearAngularMomentum = linearAngularVelocity 

            //let velocity = Math.sqrt(this.velocity.y ** 2 + this.velocity.x ** 2);
            //this.angularVelocity = Math.acos(this.velocity.x / velocity);
            //console.log(this.angularVelocity, velocity);
 
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
             //console.log('xmin');
          }
          if (this.vertices.y[i] + this.position.y < this.boundingBox.ymin) {
             this.boundingBox.ymin = this.vertices.y[i] + this.position.y;
             //console.log('ymin');
          }
          if (this.vertices.x[i] + this.position.x > this.boundingBox.xmax) {
             this.boundingBox.xmax = this.vertices.x[i] + this.position.x;
             //console.log(this.vertices.x[i] + this.position.x);
          }
          if (this.vertices.y[i] + this.position.y > this.boundingBox.ymax) {
             this.boundingBox.ymax = this.vertices.y[i] + this.position.y;
             //console.log('ymax');
          }
          
       }

       
 
       
       let rows = this.boundingBox.xmax - this.boundingBox.xmin;
       let columns = this.boundingBox.ymax - this.boundingBox.ymin;
       let boundingBoxArea = (rows) * (columns);
       //console.log(boundingBoxArea);
       let average = 0;
       for (let r = this.boundingBox.xmin - 1; r < this.boundingBox.xmax + 1; r++) {
          //console.log(r);
          for (let c = this.boundingBox.ymin - 1; c < this.boundingBox.ymax + 1; c++) {
             //console.log(c);
             //console.log(raycasting(r, this.boundingBox.xmax + 1, c, c, polygon));
             if (raycasting(r, this.boundingBox.xmax + 1, c, c, polygon) === 'Collision') {
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