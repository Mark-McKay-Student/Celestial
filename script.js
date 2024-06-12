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
const resolution = 4;
const width = 320 * resolution;
const height = 180 * resolution;
const tileSize = 8 * resolution;
const pixel = resolution;

const b = 0;
const g = 1;
const y = 2;
const r = 3;

// I could have made this readable, but this was more fun
// nnnnnnnnncc number color (try to figure out what this means)
const map1 = [1020, 17, 144, 19, 496, 18, 372, 9, 84, 17, 52, 9, 52, 17, 84, 9, 52, 17, 84, 9, 44, 9, 17, 84, 125, 24, 101, 7, 56, 101, 7, 56, 101, 7, 56, 13, 125, 24, 137, 24, 13];
// [255, b, 4, g, 36, b, 4, r, 124, b, 4, y, 13, b, 2, b, 38, b, 2, b, 38, b, 2, g, 21, b, 4, g, 13, b, 2, g, 13, b, 4, g, 21, b, 2, g, 13, b, 4, g, 21, b, 2, g, 11, b, 2, g, 4, g, 21, b, 31, g, 6, b, 25, g, 1, r, 14, b, 3, g, 22, g, 1, r, 14, b, 3, g, 22, g, 1, r, 14, b, 3, g, 31, g, 6, b, 3, g, 31, g, 6, b, 3, g];

let paused = 0;
let cheat = 0;
let freezeFrame = 0;

class tile {
  //hcc   1 bit for half, 2 bits for color
  color = 0;

  constructor(color) {
    this.color = color;
  }
}

class player {
  xPosition = tileSize * 6; // spawn location
  yPosition = tileSize * 15; //

  coyoteFrames = 7; // 5-0 if it is not 0, it goes down 1 every frame. When the player jumps, we check if this is above 0
  fallFrames = 0; // -18 to -1 means jump in progress, 0 means peak of jump or on solid ground, above 0 means currently falling
  dashFrames = 0;

  /** Returns the distance the player moves. Gets called every frame either left or right is pressed down
   * @param {number} dir Either 0 or 1, with 0 being move left, and 1 being move right
   * @returns {number} How much the player moves, minus 1 pixel for moving one pixel left, 0 if movement didn't go through, and plus 1 pixel for moving 1 pixel right  */
  move(dir) {
    const left = Math.floor((this.xPosition - pixel) / tileSize);
    const right = Math.ceil((this.xPosition + pixel) / tileSize);
    const top = tileOf(this.yPosition); // adding 1 to this value gives you the bottom row of the player
    if (!dir && left < 0) return;
    if (!dir && grid[tileOf(this.yPosition) + 1][left].color != g && grid[tileOf(this.yPosition)][left].color != g) {
      if (!dir && (grid[top + 1][left].color == r || grid[top][left].color == r)) {
        console.log("you suck");
        this.xPosition = tileSize * 6;
        this.yPosition = tileSize * 15;
      }
      return (this.xPosition -= pixel);
    }
    if (dir && grid[top + 1][right].color != g && grid[top][right].color != g) {
      if (dir && (grid[top + 1][right].color == r || grid[top][right].color == r)) {
        console.log("you suck");
        this.xPosition = tileSize * 6;
        this.yPosition = yPosition = tileSize * 15;
      }
      return (this.xPosition += pixel);
    }
    return 0;
  }

  /** Apply physics. If a jump is in progress, continue upwards, if not, and the tile below is blue, apply gravity
   * @param {Bool} jump wether or not the player is currently pressing a jump button and trying to start a new jump */
  physics(jump) {
    let gravity = (1 / 54) * (this.fallFrames++) ** 2 * pixel; // calculate gravity, and add one to fall frames afterwards

    if (tileOf(this.yPosition - gravity) < 0) {
      this.yPosition = tileOf(this.yPosition) * tileSize;
      return (this.fallFrames = 0);
    }
    let left = grid[tileOf(this.yPosition + gravity) + 2][tileOf(this.xPosition)].color;
    let right = grid[tileOf(this.yPosition + gravity) + 2][tileOf(this.xPosition - pixel) + 1].color;
    let topLeft = grid[tileOf(this.yPosition - gravity)][tileOf(this.xPosition)].color;
    let topRight = grid[tileOf(this.yPosition - gravity)][tileOf(this.xPosition - pixel) + 1].color;

    // start jump
    if (jump) {
      if (this.coyoteFrames > 0) {
        this.coyoteFrames = 0;
        this.fallFrames = -17;
      }
      if (cheat) this.fallFrames = -15;
    }

    // apply jump (and check collision)
    if (this.fallFrames < 0) {
      if (topLeft == 1 || topRight == 1) {
        this.yPosition = tileOf(this.yPosition) * tileSize;
        return (this.fallFrames = 0);
      }
      if (topLeft == 3 || topRight == 3) return this.die();

      return (this.yPosition -= gravity);
    }

    // gravity
    if (left + right == 0) {
      if (this.coyoteFrames) this.coyoteFrames--;
      return (this.yPosition += gravity);
    }

    if (left + right == 6) return this.die();

    // solid
    this.yPosition += gravity;
    this.fallFrames = 0;
    this.coyoteFrames = 7;
    this.yPosition = tileOf(this.yPosition) * tileSize;
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
  for (let mapIndex in map1) {
    for (let counter = 0; counter < map1[mapIndex] >> 2; counter++) {
      if (x > 39) {
        x = 0;
        grid[++y] = [];
      }
      grid[y][x++] = new tile(map1[mapIndex] & 3);
    }
  }
}

function draw() {
  if (freezeFrame) return freezeFrame--;

  // draw tiles
  // noStroke();
  stroke(0);
  for (let y = 0; y < 23; y++) {
    for (let x = 0; x < 40; x++) {
      if (grid[y][x].color < 1) fill([0, 150, 255]); // blue
      else if (grid[y][x].color < 2) fill([100, 100, 100]); // grey
      else if (grid[y][x].color < 3) fill([255, 255, 0]); // yellow
      else if (grid[y][x].color < 4) fill([255, 0, 0]); // red
      rect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // c or space is down
  adeline.physics(keyIsDown(67) || keyIsDown(32));

  // left arrow key is down
  if (keyIsDown(37)) adeline.move(0);

  // right arrow key is down
  if (keyIsDown(39)) adeline.move(1);

  // draw adeline
  fill([255, 0, 150]);
  rect(adeline.xPosition, adeline.yPosition, tileSize, tileSize * 2);
}

function keyPressed() {
  if (key.toLowerCase() === "f") redraw();

  if (key.toLowerCase() === "d" || key.toLowerCase() == "escape") (paused = !paused) ? noLoop() : loop();

  if (key.toLowerCase() === "a") cheat = !cheat;

  if (key.toLowerCase() === "x") freezeFrame = 4;
}

function tileOf(input) {
  return Math.floor(input / tileSize);
}

const adeline = new player();

//https://www.desmos.com/calculator/1xptyhpdeu
