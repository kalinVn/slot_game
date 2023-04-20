import * as PIXI from 'pixi.js';
import Game from "./Game.js";
import "../assets/style.css";

global.PIXI = PIXI;

let game = new Game();
await game.init();

