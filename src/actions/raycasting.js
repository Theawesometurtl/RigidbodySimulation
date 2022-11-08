
 
/*
find the moment of inertia by brute force averaging the force for every pixel of the polygon
I wonder how stupid it will be to use raycasting to check whether every pixel is inside the polygon

SoS (simulation of simplicity) has a better solution I am just to lazy to try to implement it. I
need the raycasting anyways, but don't want to copy paste some rando code in case it goes wrong without
understanding it
*/

function raycasting(x1, x2, y1,y2, collidingPolygon) {
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