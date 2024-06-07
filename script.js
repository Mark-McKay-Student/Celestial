/* *
 * ICS4U - Final Project
 *
 * Description:
 *
 * Author: Mark McKay
 */

"use strict";

let canvas;
let grid = [[]];

// 1x 320:180 8
// 4x 1280:720 32
// 6x 1920:1080 48
// 8x 2560:1440 64
const width = 1280;
const height = 720;
const tileSize = 32;
const pixel = tileSize / 8;

const b = [0, 150, 255];
const g = [100, 100, 100];
const r = [255, 0, 0];
const y = [255, 255, 0];
const map1 = [255, b, 4, g, 36, b, 4, r, 124, b, 4, y, 93, b, 2, g, 21, b, 4, y, 13, b, 2, g, 13, b, 4, g, 21, b, 2, g, 13, b, 4, g, 21, b, 2, g, 11, b, 2, r, 4, g, 21, b, 31, g, 6, b, 3, g, 22, g, 1, r, 14, b, 3, g, 22, g, 1, r, 14, b, 3, g, 22, g, 1, r, 14, b, 3, g, 31, g, 6, b, 3, g, 31, g, 6, b, 3, g];

class tile {
  color = 0;
  half = false;

  constructor(color, half) {
    this.color = color;
    this.half = half;
  }
}

class player {
  xPosition = tileSize * 6; // spawn location
  yPosition = tileSize * 15; //

  coyoteFrames = 5; // 5-0 if it is not 0, it goes down 1 every frame. When the player jumps, we check if this is above 0
  jumpProgress = 0; // 0-18 after 18th frame we apply gravity
  fallFrames = 0; // 0 means player is on ground, anything above is how many frames the player has been falling (not off the ground, specifically falling) for

  /** Returns the distance the player moves. Gets called every frame either left or right is pressed down
   * @param {number} dir Either 0 or 1, with 0 being move left, and 1 being move right
   * @returns {number} How much the player moves, minus 1 pixel for moving one pixel left, 0 if movement didn't go through, and plus 1 pixel for moving 1 pixel right  */
  move(dir) {
    const left = Math.floor((this.xPosition - pixel) / tileSize);
    const right = Math.ceil((this.xPosition + pixel) / tileSize);
    const top = Math.floor(this.yPosition / tileSize); // adding 1 to this value gives you the bottom row of the player
    if (!dir && grid[top + 1][left].color != g && grid[top][left].color != g) {
      if (!dir && (grid[top + 1][left].color == r || grid[top][left].color == r)) {
        console.log("you suck");
        this.xPosition = 192;
        this.yPosition = 480;
      }
      return (this.xPosition -= pixel);
    }
    if (dir && grid[top + 1][right].color != g && grid[top][right].color != g) {
      if (dir && (grid[top + 1][right].color == r || grid[top][right].color == r)) {
        this.die();
      }
      return (this.xPosition += pixel);
    }
    return 0;
  }

  jump() {
    this.yPosition -= 500;
    this.jumpProgress = 1;
  }

  gravity() {
    let bellow = grid[Math.floor((this.yPosition - (1 / 54) * this.fallFrames ** 2) / tileSize) + 2][Math.floor(this.xPosition / tileSize)].color;
    if (bellow == b) {
      return (this.yPosition += (1 / 54) * (++this.fallFrames) ** 2) / tileSize;
    }

    if (bellow == g) return (this.fallFrames = 0);
    if (postMoveColor == g && preMoveColor == b) return (this.yPosition = Math.floor(this.yPosition / tileSize));
    if (postMoveColor == r) return this.die();
    // this.yPosition += (1 / 54) * (++this.fallFrames) ** 2;
  }

  die() {
    console.log("you suck");
    this.xPosition = 192;
    this.yPosition = 480;
  }
}

function setup() {
  canvas = createCanvas(width, height);

  let y = 0;
  let x = 0;
  for (let mapIndex = 0; mapIndex < map1.length; mapIndex += 2) {
    for (let counter = 0; counter < map1[mapIndex]; counter++) {
      if (x > 39) {
        x = 0;
        grid[++y] = [];
      }
      grid[y][x++] = new tile(map1[mapIndex + 1]);
    }
  }
}

function draw() {
  // draw tiles
  for (let y = 0; y < 23; y++) {
    for (let x = 0; x < 40; x++) {
      /* if (grid[y][x].color == b) noStroke(); // go to doctor
      else stroke(0); // smell toast */
      stroke(0);
      fill(grid[y][x].color);
      rect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  adeline.gravity();

  // left arrow key is down
  if (keyIsDown(37)) adeline.move(0);

  // right arrow key is down
  if (keyIsDown(39)) adeline.move(1);

  // c or space is down
  if (keyIsDown(67) || keyIsDown(32)) if (!adeline.jumpProgress) adeline.jump();

  // draw adeline
  fill([255, 255, 255]);
  rect(adeline.xPosition, adeline.yPosition, tileSize, tileSize * 2);

  if (keyIsDown(27)) {
    noLoop();
  }
}

const adeline = new player();

//https://www.desmos.com/calculator/ygxz4wv5s0
