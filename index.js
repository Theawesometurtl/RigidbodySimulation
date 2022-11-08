const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



let polygonList = [];
polygon = new Polygon();
polygonList.push(polygon);



//this is the main function that runs the entire game
function game() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   polygon.update();
   polygon.draw();
}

 
setInterval(game, 15);//framerate (milliseconds per run of the main game function)


