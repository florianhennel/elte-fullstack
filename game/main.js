import './style.css'
import { Vector2 } from "./src/engine/types/Vectors.js";
import { GameLoop } from "./src/engine/GameLoop.js";
import { Main } from "./src/objects/Main/Main.js";
import config from "./src/engine/config/config.json"
import { Level1 } from './src/levels/Level1.js';
import { EventHandler } from './src/engine/Events/EventHandler.js';
import { GameState } from './src/core/GameState.js';
import { EndgameScreen } from './src/helpers/EndgameScreen.js';

// Grabbing the canvas to draw to
const canvas = document.querySelector("#game-canvas");
canvas.setAttribute("width", config.canvasSize[0])
canvas.setAttribute("height", config.canvasSize[1])
const ctx = canvas.getContext("2d");


// Establish the root scene
const mainScene = new Main({
  position: new Vector2(0, 0)
})

// mainScene.setLevel(new OutdoorLevel1())
mainScene.setLevel(new Level1())

// Establish update and draw loops
const update = (delta) => {
  mainScene.stepEntry(delta, mainScene);
  mainScene.input?.update();
};

const draw = () => {

  // Clear anything stale
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the sky
  mainScene.drawBackground(ctx);

  // Save the current state (for camera offset)
  ctx.save();

  //Offset by camera position
  if (mainScene.camera) {
    ctx.translate(mainScene.camera.position.x, mainScene.camera.position.y);
  }

  // Draw objects in the mounted scene
  mainScene.drawObjects(ctx);

  // Restore to original state
  ctx.restore();

  // Draw anything above the game world
  mainScene.drawForeground(ctx);

}


const gameLoop = new GameLoop(update, draw);

const gameState = new GameState()

// Setup events
const eventHandler = new EventHandler(gameLoop, gameState)

// Start the game
gameLoop.start();