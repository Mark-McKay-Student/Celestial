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
// 1x 320:180 8
// 1x 320:180 8
// 1x 320:180 8
let width = 320;
let height = 180;
let tileSize = 8;

class screen {}

class tile {
  color;
  half;

  constructor(color = [0, 150, 255], half = false) {
    this.color = color;
    this.half = half;
  }
}

class player {}

class hitbox {}

class hurtbox {}

function setup() {
  canvas = createCanvas(width, height);
  for (let y = 0; y < 22; y++) {
    grid[y] = [];
    for (let x = 0; x < 40; x++) grid[y].push(new tile([0, 150, 255]));
  }
  //Half rows
}

function draw() {
  background([255, 0, 0]);
  draw_grid();
}

function draw_grid() {
  for (let y = 0; y < 22; y++) {
    for (let x = 0; x < 40; x++) {
      fill(grid[y][x].color); //
      rect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}
