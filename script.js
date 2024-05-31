/* *
 * ICS4U - Final Project
 *
 * Description:
 *
 * Author: Mark McKay
 */

"use strict";

let canvas;
let grid = [];

// 1x 320:180 8
// 4x 1280:720 32
// 6x 1920:1080 48
// 8x 2560:1440 64
let width = 1280;
let height = 720;
let tileSize = 32;

let map1 = [
  ["B", 40],
  ["B", 40],
  ["B", 40]
];

class tile {
  color = [0, 150, 255];
  half = false;

  constructor(color = [0, 150, 255], half = false) {
    this.color = color;
    this.half = half;
  }
}

class player {
  hitbox = new hitbox();
  hurtbox = new hurtbox();
}

class hitbox {}

class hurtbox {}

function setup() {
  canvas = createCanvas(width, height);
  for (let y = 0; y < 22; y++) {
    grid[y] = [];
    for (let x = 0; x < 40; x++) grid[y].push(new tile([0, 150, 255]));
  }
  // half rows
  grid[22] = [];
  for (let x = 0; x < 40; x++) grid[22].push(new tile([255, 0, 0], true));
}

function draw() {
  background([255, 0, 0]);

  noStroke(); // lower the risk of the canvas having a stroke
  for (let y = 0; y < 22; y++) {
    for (let x = 0; x < 40; x++) {
      fill(grid[y][x].color);
      rect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
  stroke(0); // make them smell burt toast
  for (let x = 0; x < 40; x++) {
    fill(grid[22][x].color);
    rect(x * tileSize, 22 * tileSize, tileSize, tileSize / 2);
  }
}

function draw_grid() {}
