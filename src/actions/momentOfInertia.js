
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
function momentOfInertia(vertices, centroid, mass) {
    if (vertices.x.length < 3) {return null;};
    let inertia = 0;

    let triangle;
    let area = 0;
    let areas = [];
    //calculation of area of the polygon so that I can calculate the mass of each individually triangle
    for (var i = 0; i < vertices.x.length-1; i++) {
        console.log(centroid, vertices, mass);
        triangle = baseHeightOfTrig([centroid, [vertices.x[i], vertices.y[i]], [vertices.x[i + 1], vertices.y[i + 1]]], mass);
        area += triangle.base * triangle.height /2;
        areas.Add(triangle.base * triangle.height /2)
    }   
    //this part is just bc the last moment of inertia repeats the first vertex
    triangle = baseHeightOfTrig([centroid, [vertices.x[i], vertices.y[i]], [vertices.x[i + 1], vertices.y[i + 1]]], mass);
    area += triangle.base * triangle.height /2
    areas.Add(triangle.base * triangle.height /2)


    for (var i = 0; i < vertices.x.length-1; i++) {
        inertia += triMomentOfInertia([centroid, [vertices.x[i], vertices.y[i]], [vertices.x[i + 1], vertices.y[i + 1]]], areas[i] / area);
    }
    //this part is just bc the last moment of inertia repeats the first vertex
    inertia += triMomentOfInertia([centroid, [vertices.x[i], vertices.y[i]], [vertices.x[i + 1], vertices.y[i + 1]]], areas[vertices.x.length] / area);

   
    return inertia;
};

function triMomentOfInertia(vertices, mass) {
    
    let b = baseHeightOfTrig(vertices).base
    let h = baseHeightOfTrig(vertices).height


    //I got the formula for the moment of inertia of a triangle around the z axis from here:
    //www.calculatoratoz.com/en/mass-moment-of-inertia-of-triangular-plate-about-z-axis-through-centroid-perpendicular-to-plate-calculator/Calc-9553

    let inertia = (mass/72) * (3 * (b**2) + 4 * (h**2));

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
    

    centXDiff = positiveDifference(centroid[0], vertices[0][0]);
    centYDiff = positiveDifference(centroid[1], vertices[0][1]);

    //pythagorean theorum this
    let centDistance = Math.sqrt(centXDiff**2+centYDiff**2);

    //parrellel axis theorum
    inertia += mass*(centDistance**2);

    return inertia
};

function baseHeightOfTrig(vertices) {
    let by;
    let bx;
    
    console.log(vertices);
    bx = positiveDifference(vertices[0].x, vertices[1][0]);
    by = positiveDifference(vertices[0].y, vertices[1][1]);


    //pythagorean theorum this
    let b = Math.sqrt(bx**2+by**2);
    //this is some cool ass math. I convert the base into a line
    // and the vertex at the tip of my triangle into a line, and then I find
    // the bias of the two lines. This difference in bias is the height of the triangle
    let slope = by/bx;
    let bias = slope*vertices[0].x-vertices[0].y;
    

    let h = (slope*vertices[2][0]-vertices[2][1]) - bias;

    return {'base': b,'height': h, 'slope':slope};
}

function positiveDifference(a, b) {
    let answer;
    if (a >= b){
        answer=a - b;
    }
    else {
        answer= b -  a
    }
    return answer;
}