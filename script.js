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
  // console.log(mouse.x, mouse.y);
});

canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});

let letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

letters = letters.map(function (x) {
  return x.toLocaleUpperCase();
});

var color = "blue";

// Player

const playerLeft = new Image();
playerLeft.src = "left_fish.png";
const playerRight = new Image();
playerRight.src = "right_fish.png";

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
    ctx.fillStyle = "black";
    ctx.fillText("score: " + score, 10, 50);
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
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //start angle = 0 , end angle = pi square
    ctx.fill();
    ctx.closePath();

    if (this.x >= mouse.x) {
      ctx.drawImage(
        playerLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 60,
        this.y - 45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else {
      ctx.drawImage(
        playerRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 60,
        this.y - 45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
  }
}

const player = new Player();

// Bubbles
const bubblesArray = [];
const lettersArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height - 50; // location of bubbles
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance; // will track distance bw each bubble and the player so we can keep count of score
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : " sound2"; // will play any of the two random sounds after a collison
    const random = Math.floor(Math.random() * letters.length);
    this.letter = letters[random];
  }

  update() {
    // move bubbles up
    this.y -= this.speed;
    this.x += Math.random([this.speed, -this.speed, 0]);
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy); //calculating collision using the pythogoras theorem
  }

  draw() {
    ctx.font = " bold 50px monospace ";
    ctx.fillStyle = color;
    ctx.fillText(this.letter, this.x, this.y);

    // ctx.translate(0, 0);
    // ctx.fill();
    // ctx.fillStyle = "blue";
    // ctx.beginPath(); // draw the circle
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //start angle = 0 , end angle = pi square
    // ctx.strokeText();
    // ctx.closePath();
    // ctx.stroke();
    // make circles of bubbles
  }
  rotate() {
    this.y = 80;
    this.x = 60;
  }

  new_color() {
    color = "red";
  }
  old_color() {
    color = "blue";
  }
}

const bubblePop1 = document.createElement("audio");
bubblePop1.src = "Plop.ogg";
const bubblePop2 = document.createElement("audio");
bubblePop2.src = "bubbles-single2.wav";

function handleBubbles() {
  // to periodically add bubbles
  if (gameFrame % 75 == 0) {
    A = new Bubble();
    bubblesArray.push(A);
    lettersArray.push(A.letter);
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
    if (
      bubblesArray[i].y < 0 ||
      bubblesArray[i].x < 0 ||
      bubblesArray[i].x > 800
    ) {
      bubblesArray.splice(i, 1); //removes the bubble when it has moved past the top edge of canvas
      lettersArray.splice(i, 1); //removes the bubble when it has moved past the top edge of canvas
    }
  }

  for (let i = 0; i < bubblesArray.length; i++) {
    function doKeyDown(e) {
      p = String.fromCharCode(e.keyCode);
      if (bubblesArray[i].letter == p && !bubblesArray[i].counted) {
        const result = lettersArray.filter(
          (letter) => letter === bubblesArray[i].letter
        );
        if (result.length > 1) {
          console.log(result[0]);
          const index = lettersArray.indexOf(result[0]);
          item = bubblesArray.shift();
          console.log(item);
          bubblesArray.splice(index, 1);
          lettersArray.shift();
          lettersArray.splice(index, 1);
          score += 1;
        } else {
          bubblesArray[i].counted = true;
          bubblesArray[i].new_color();
          setTimeout(function () {
            bubblesArray[i].old_color();
          }, 300);

          score++;
          bubblePop2.play();
          bubblesArray[i].rotate();
        }
      }
    }

    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
      lettersArray.splice(i, 1);
      bubblesArray.splice(i, 1); // smoothle removes bubble from top
      // console.log(bubblesArray[i].letter);
    }
    if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
      if (!bubblesArray[i].counted) {
        bubblePop1.play();
        score++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
        lettersArray.splice(i, 1);

        // each and every bubble is only counted once and after counting it is removed
      }
    }
    window.addEventListener("keydown", doKeyDown, false);
  }
}

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // to clear the entire canvas from old paint bw animation frames
  handleBubbles(); // push bubbles
  player.update(); // to calculate player position
  player.draw(); // draw a line bw player and mouse and draw circle representing the player
  gameFrame++; // increases frames
  requestAnimationFrame(animate); // to create animation loop using recursion
}
animate();
