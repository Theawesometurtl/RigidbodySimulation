function momentOfInertia(vertices, centroid) {
    if (vertices.length < 3) {return null;};
    let inertia = 0;
    
    for (var i = 0; i < vertices.length-1; i++) {
        inertia += triMomentOfInertia([centroid, vertices[i], vertices[i + 1]]);
    }
    //this part is just bc the last moment of inertia repeats the first vertex
    inertia += triMomentOfInertia([centroid, vertices[i], vertices[0]]);
    return inertia;
};

function triMomentOfInertia(vertices) {
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
    return (b*h)**2/36;
};