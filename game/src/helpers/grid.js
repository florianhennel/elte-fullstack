import { gridSize } from "../engine/config/config.json"

export const gridCells = n => {
  return n * gridSize;
}

/*TODO: dont be multiplied by gridsize */
export const isSpaceFree = (walls, x, y) => {
  // Convert to string format for easy lookup
  const str = `${x},${y}`;
  // Check if walls has an entry at this spot
  const isWallPresent = walls.has(str);
  return !isWallPresent;
}