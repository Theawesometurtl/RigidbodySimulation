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