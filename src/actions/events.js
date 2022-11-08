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