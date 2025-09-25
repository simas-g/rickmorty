import { Game } from './Game.js';
import { ArgumentHandler } from './ArgumentHandler.js';

async function startProgram() {
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.log("Error: Invalid number of arguments.");
    console.log("Usage: node main.js <num_boxes> <morty_file_path> <morty_class_name>");
    console.log("Example: node main.js 3 ./morty_implementations/ClassicMorty.js ClassicMorty");
    process.exit(1);
  }

  const [numBoxesStr, mortyFilePath, mortyClassName] = args;
  
  const argHandler = new ArgumentHandler();
  const validationResult = await argHandler.validate(numBoxesStr, mortyFilePath, mortyClassName);

  if (validationResult.error) {
    console.log(`Error: ${validationResult.error}`);
    console.log("Please check your arguments and try again.");
    process.exit(1);
  }

  const { numBoxes } = validationResult;
  const game = new Game(numBoxes, mortyFilePath, mortyClassName);
  game.startGame();
}

startProgram();
