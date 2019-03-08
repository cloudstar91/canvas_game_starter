/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let canvas;
let ctx;

canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

// document.body.appendChild(canvas);

let bgReady, dinoReady, eggReady;
let bgImage, dinoImage, eggImage;

var deadline = new Date(Date.parse(new Date()) + 1 * 1 * 1 * 10 * 1000);

let newGameBtn = document.getElementById("resetBtn");
newGameBtn.addEventListener("click", Reset);

let secondsSpan = document.getElementById("remain-time");

var timeinterval;

initializeClock("remain-time", deadline);

function loadImages() {
  bgImage = new Image(); //create new Img Element
  bgImage.onload = function() {
    //// execute drawImage statements here
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background2.png";
  dinoImage = new Image();
  dinoImage.onload = function() {
    // show the dino image
    dinoReady = true;
  };
  dinoImage.src = "images/dino.png";

  eggImage = new Image();
  eggImage.onload = function() {
    // show the egg image
    eggReady = true;
  };
  eggImage.src = "images/egg.png";
}

//random color

/** 
 * Setting up our characters.
 

 * Note that dinoX represents the X position of our dino.
 * dinoY represents the Y position.
 * We'll need these values to know where to "draw" the dino.
 * 
 * The same applies to the egg.
 */

let dinoX = canvas.width / 2;
let dinoY = canvas.height / 2;

let eggX = 100;
let eggY = 100;

let eggIsCaught = false;

let eggCount = 0;

function randomColor() {
  color =
    "rgb(" +
    Math.round(Math.random() * 255) +
    "," +
    Math.round(Math.random() * 255) +
    "," +
    Math.round(Math.random() * 255) +
    ")";

  return color;
}
/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function(key) {
      // keysDown[34] = true;
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the egg has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function() {
  if (38 in keysDown) {
    // Player is holding up key
    dinoY -= 6;
    if (dinoY < 0) {
      dinoY = canvas.height;
    }
  }
  if (40 in keysDown) {
    // Player is holding down key
    dinoY += 6;
    if (dinoY >= canvas.height) {
      dinoY = 0;
    }
  }
  if (37 in keysDown) {
    // Player is holding left key
    dinoX -= 6;
    dinoImage.src = "images/hero_left.png";
    if (dinoX < 0) {
      dinoX = canvas.width;
    }
  }
  if (39 in keysDown) {
    // Player is holding right key
    dinoX += 6;
    dinoImage.src = "images/dino.png";
    console.log("dino ", dinoX);
    console.log("canvas ", canvas.width);
    if (dinoX >= canvas.width) {
      dinoX = 0;
    }
  }
  // dinoX = Math.min(canvas.width - 50, dinoX);
  // dinoX = Math.max(0, dinoX);
  // dinoY = Math.min(canvas.height - 70, dinoY);
  // dinoY = Math.max(0, dinoY);

  // Check if player and egg collided. Our images
  // are about 32 pixels big.

  if (
    dinoX <= eggX + 40 &&
    eggX <= dinoX + 40 &&
    dinoY <= eggY + 40 &&
    eggY <= dinoY + 40
  ) {
    eggCount += 1;
    eggIsCaught = true;
    if (eggCount == 5) {
    }

    // Pick a new location for the egg.
    // Note: Change this to place the egg at a new, random location.
    eggX = Math.floor(Math.random() * 480);
    eggY = Math.floor(Math.random() * 380);
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (dinoReady) {
    ctx.drawImage(dinoImage, dinoX, dinoY);
  }
  if (eggReady) {
    ctx.drawImage(eggImage, eggX, eggY);
  }
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our dino and egg)
 * render (based on the state of our game, draw the right things)
 */

var main = function() {
  if (eggCount == 2) {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.fillText("You win", 100, 100);
    stopTimer(timeinterval);
  } else {
    update();

    render();

    let eggCountNum = document.getElementById("eggCountHTML");
    eggCountNum.innerHTML = eggCount;
  }

  // ctx.font = "12px Comic Sans MS";
  // ctx.fillStyle = "red";

  // ctx.fillText(`Remaining time: ${remainTime}s`, 50, 40);
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;

requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

function Reset() {
  location.reload();
}

function initializeClock(id, endtime) {
  var timer = document.getElementById(id);

  function updateClock() {
    var t = getTimeRemaining(endtime);

    secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);

    if (t.total <= 0) {
      // stopTimer(timeinterval);
      clearInterval(timeinterval);
      // secondsSpan.innerHTML = "0";
    }
  }

  updateClock();
  timeinterval = setInterval(updateClock, 1000);
}

function stopTimer(clock) {
  clearInterval(clock);
  // secondsSpan.innerHTML = "0";
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);

  return {
    total: t,

    seconds: seconds
  };
}

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
