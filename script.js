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
let width = 1280;
let height = 720;
let tileSize = 32;
let pixel = tileSize / 8;

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
  xPosition = tileSize * 6;
  yPosition = tileSize * 15;
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
      /* if (grid[y][x].color == b) noStroke();
      else  */ stroke(0);
      fill(grid[y][x].color);
      rect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // if left arrow key is down
  if (keyIsDown(37)) {
    if (grid[Math.floor(adeline.yPosition / tileSize)][Math.floor((adeline.xPosition - pixel) / tileSize)].color != g) adeline.xPosition -= pixel;
    console.log(Math.floor((adeline.yPosition - pixel) / tileSize), Math.floor((adeline.xPosition - pixel) / tileSize));
  }
  // if right arrow key is down
  if (keyIsDown(39)) {
    if (grid[Math.ceil((adeline.yPosition + pixel) / tileSize)][Math.ceil((adeline.xPosition + pixel) / tileSize)].color != g) adeline.xPosition += pixel;
    console.log(Math.floor((adeline.yPosition - pixel) / tileSize), Math.floor((adeline.xPosition - pixel) / tileSize));
  }

  // draw adeline
  fill([255, 255, 255]);
  rect(adeline.xPosition, adeline.yPosition, tileSize, tileSize * 2);
}

let adeline = new player();
