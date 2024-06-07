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
  jumpProgress = 0;

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
      return (adeline.xPosition -= pixel);
    }
    if (dir && grid[top + 1][right].color != g && grid[top][right].color != g) {
      if (dir && (grid[top + 1][right].color == r || grid[top][right].color == r)) {
        console.log("you suck");
        this.xPosition = 192;
        this.yPosition = 480;
      }
      return (adeline.xPosition += pixel);
    }
    return 0;
  }

  /** Cook a grilled cheese
   * @returns grilled cheese  */
  jumpGravity() {
    // 1/108(x-18)^2+3)-(1/108(x-19)^2+3) // yay math
    let complicatedMath = (1 / 108) * (this.jumpProgress - 18) ** 2 - (1 / 108) * (this.jumpProgress - 19) ** 2;
    // if (grid[Math.floor((this.yPosition + complicatedMath) / tileSize + 2)][Math.floor(this.xPosition / tileSize + 1)].color == g) {
    //   this.yPosition += this.yPosition % tileSize;
    //   this.jumpProgress = -1;
    // }
    this.yPosition += complicatedMath * tileSize * 2; // input is 1/3 of space jumped. In celeste madeline can jump over 3 tiles thus with this default value of
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
    adeline.move(0);
  }
  // if right arrow key is down
  if (keyIsDown(39)) {
    adeline.move(1);
  }

  //c is down
  if (keyIsDown(67) || keyIsDown(32)) {
    if (!adeline.jumpProgress) {
      adeline.jumpProgress++;
    }
  }

  if (adeline.jumpProgress) {
    adeline.jumpProgress < 37 ? adeline.jumpGravity(adeline.jumpProgress) : (adeline.jumpProgress = -1);
    adeline.jumpProgress++;
  }

  // draw adeline
  fill([255, 255, 255]);
  rect(adeline.xPosition, adeline.yPosition, tileSize, tileSize * 2);
}

const adeline = new player();

// f\left(x\right)=\frac{1}{54}(x-18)^{2}-6\left\{0\le x\le90\right\}
// f_{1}\left(x\right)=\left(\frac{1}{54}(x-18)^{2}-6)-\left(\frac{1}{54}(x-19)^{2}-6)\right)\right)
