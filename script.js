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
  jumpProgress = 1;

  /** Returns the distance the player moves. Gets called every frame either left or right is pressed down
   * @param {number} dir Either 0 or 1, with 0 being move left, and 1 being move right
   * @returns {number} How much the player moves, minus 1 pixel for moving one pixel left, 0 if movement didn't go through, and plus 1 pixel for moving 1 pixel right  */
  move(dir) {
    const left = Math.floor((this.xPosition - pixel) / tileSize);
    const right = Math.ceil((this.xPosition + pixel) / tileSize);
    const top = Math.floor(this.yPosition / tileSize); // adding 1 to this value gives you the bottom row of the player
    if (!dir && grid[top + 1][left].color != g && grid[top][left].color != g) return -pixel;
    if (dir && grid[top + 1][right].color != g && grid[top][right].color != g) return pixel;
    return 0;
  }

  /** Cook a grilled cheese
   * @returns grilled cheese  */
  jump() {}
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
  // draw
  noStroke();
  for (let y = 0; y < 23; y++) {
    for (let x = 0; x < 40; x++) {
      if (grid[y][x].color == b) noStroke(); // go to doctor
      else stroke(0); // smell toast
      fill(grid[y][x].color);
      rect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // if left arrow key is down
  if (keyIsDown(37)) {
    adeline.xPosition += adeline.move(0);
  }
  // if right arrow key is down
  if (keyIsDown(39)) {
    adeline.xPosition += adeline.move(1);
  }

  if (keyIsDown(67)) {
    console.log("*insert jump here*");
  }

  // draw adeline
  fill([255, 255, 255]);
  rect(adeline.xPosition, adeline.yPosition, tileSize, tileSize * 2);
}

const adeline = new player();
