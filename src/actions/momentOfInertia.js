
/*
What I am doing here is splitting up the polygon into many seperate triangles and
finding the moment of inertia for each triangle individually, then using the parrellel
axis theorum to move each triangle's moment of inertia to the centroid of the polygon.

For each triangle, I convert it's base into a line using the formula y = mx + b.
Then, I find the slope of the line in order to make a parallel infinite line on
the point at the tippy top of the triangle. Measuring the bias between the two lines
is equivalent to measuring the height of the triangle perpandicular to its base.

I love that I am using basic geometry and algebra to find the base and height of the
triangle, and proud I came up with the method on my own. It works, but I'm not sure
if the formula I applied to get the moment of inertia of the triangle is correct.

I think I want a formula that gives the moment of inertia for a triangle with an axis
perpandicular to the plane of the triangle at the centroid. I am almost certain that
the formula I am using right now doesn't do what I want it to do.

from there, I use the parellel axis theorum to move the centroid of the triangle to 
the center of the polygon.

I am pretty happy with all I have right now, I still need to find the right formula
for the moment of inertia, and I also need to spread the mass of the polygon evenly,
probably by finding the area of each triangle and distributing the mass of the polygon
accordingly.

If I want to clean up the code I have and continue to work on it, I should probably
change the functions so the arguments that are passed in are passed in as an
arrangement of lists inside a dictionary for x + y coordinates. idk tho.
maybe they should be passed as lists with a dictionary of x + y coordinates instead.


*/
function momentOfInertia(vertices, centroid) {
    if (vertices.x.length < 3) {return null;};
    let inertia = 0;
    let mass = 1/vertices.x.length;
    for (var i = 0; i < vertices.x.length-1; i++) {
        inertia += triMomentOfInertia([centroid, [vertices.x[i], vertices.y[i]], [vertices.x[i + 1], vertices.y[i + 1]]], mass);
    }
    //this part is just bc the last moment of inertia repeats the first vertex
    inertia += triMomentOfInertia([centroid, [vertices.x[i], vertices.y[i]], [vertices.x[i + 1], vertices.y[i + 1]]], mass);

   
    return inertia;
};

function triMomentOfInertia(vertices, mass) {
    let by;
    let bx;
    
    if (vertices[0][0] >= vertices[1][0]){
        bx=vertices[0][0] - vertices[1][0];
    }
    else {
        bx=vertices[1][0] - vertices[0][0]
    }
    if (vertices[0][1] >= vertices[1][1]){
        by=vertices[0][1] - vertices[1][1];
    }
    else {
        by=vertices[1][1] - vertices[0][1];
    }
    //pythagorean theorum this bitch
    let b = Math.sqrt(bx**2+by**2);
    //this is some cool ass math. I convert the base into a line
    // and the vertex at the tip of my triangle into a line, and then I find
    // the bias of the two lines. This difference in bias is the height of the triangle
    let slope = by/bx;
    let bias = slope*vertices[0][0]-vertices[0][1];
    

    let h = (slope*vertices[2][0]-vertices[2][1]) - bias;
    let inertia = (b*h)**2/36;

    //find distance between triangle centroid and actual centroid
    centroid = [0, 0];
    for (i = 0; i < vertices.length; i++) {
        centroid[x] += vertices[i][0];
        centroid[y] += vertices[i][1];
    } 
    centroid[0]/= 3
    centroid[1]/= 3

    let centXDiff;
    let centYDiff;
    

    if (centroid[0] >= vertices[0][0]){
        centXDiff=centroid[0] - vertices[0][0];
    }
    else {
        centXDiff= vertices[0][0] - centroid[0]
    }
    if (centroid[1] >= vertices[0][1]){
        centYDiff=centroid[1] - vertices[0][1];
    }
    else {
        centYDiff= vertices[0][1] - centroid[1]
    }
    //pythagorean theorum this bitch
    let centDistance = Math.sqrt(centXDiff**2+centYDiff**2);

    //parrellel axis theorum
    inertia += mass*(centDistance**2);

    return inertia
};