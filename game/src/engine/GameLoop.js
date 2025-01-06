import { fps } from "./config/config.json"

export class GameLoop {
  constructor(update, render) {

    this.lastFrameTime = 0;
    this.accumulatedTime = 0;
    this.timeStep = 1000 / fps; // 60 frames per second

    this.update = update;
    this.render = render;

    this.rafId = null;
    this.isRunning = false;
  }

  mainLoop = (timestamp) => {
    if (!this.isRunning) return;

    let deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    // Accumulate all the time since the last frame.
    this.accumulatedTime += deltaTime;
    if (this.justStarted) this.accumulatedTime = this.timeStep

    // Fixed time step updates.
    // If there's enough accumulated time to run one or more fixed updates, run them.
    while (this.accumulatedTime >= this.timeStep) {
      this.update(this.timeStep); // Here, we pass the fixed time step size.
      this.accumulatedTime -= this.timeStep;
    }

    // Render
    this.render();

    this.justStarted = false
    this.rafId = requestAnimationFrame(this.mainLoop);
  }

  start() {
    if (this.isRunning)
      return
    this.isRunning = true;
    this.justStarted = true
    this.rafId = requestAnimationFrame(this.mainLoop);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

}












