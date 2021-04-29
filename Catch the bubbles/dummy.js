// Canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = "50px Georgia";

// Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

canvas.addEventListener("mousedown", function (e) {
  mouse.click = true;
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});

canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});

// Player
class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height / 2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }

  update() {
    //Moves the player towards the mouse
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    if (mouse.x != this.x) {
      this.x -= dx / 20; // controls movement speed
    }
    if (mouse.y != this.y) {
      this.y -= dy / 20;
    }
  }
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y); //current player position is start
      ctx.lineTo(mouse.x, mouse.y); // position we want the player to move to
      ctx.stroke();
    }
    ctx.fillStyle = "red";
    ctx.beginPath(); // draw the circle
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //start angle = 0 , end angle = pi square
    ctx.fill();
    ctx.closePath();
  }
}

const player = new Player();

// Bubbles
const bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100; // location of bubbles
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance; // will track distance bw each bubble and the player so we can keep count of score
    this.counted = false;
  }

  update() {
    // move bubbles up
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;

    this.distance = Math.sqrt(dx * dx + dy * dy); //calculating collition using the pythogoras theorem
  }
  draw() {
    ctx.fillStyle = "blue";
    ctx.beginPath(); // draw the circle
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //start angle = 0 , end angle = pi square
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    // make circles of bubbles
  }
}

function handleBubbles() {
  // to periodically add bubbles
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
    console.log(bubblesArray.length);
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
    if (bubblesArray[i].y < 0) {
      bubblesArray.splice(i, 1); //removes the bubble when it has moved past the top edge of canvas
    }
  }

  for (let i = 0; i < bubblesArray.length; i++) {
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
      bubblesArray.splice(i, 1); // smoothle removes bubble from top
    }
    if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
      console.log("collision");
      if (!bubblesArray[i].counted) {
        score++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
        // each and every bubble is only counted once and after counting it is removed
      }
    }
  }
}

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // to clear the entire canvas from old paint bw animation frames
  handleBubbles(); // push bubbles
  player.update(); // to calculate player position
  player.draw(); // draw a line bw player and mouse and draw circle representing the player
  ctx.fillStyle = "black";
  ctx.fillText("score: " + score, 10, 50);
  gameFrame++; // increases frames
  requestAnimationFrame(animate); // to create animation loop using recursion
}
animate();
