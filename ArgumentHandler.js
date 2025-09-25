
import fs from 'fs';
import path from 'path';
import { MortyLoader } from './MortyLoader.js';

export class ArgumentHandler {
  async validate(numBoxesStr, mortyFilePath, mortyClassName) {
    const numBoxes = parseInt(numBoxesStr, 10);

    if (isNaN(numBoxes) || numBoxes <= 2) {
      return {
        error: "Invalid number of boxes. The number must be an integer greater than 2."
      };
    }

    const resolvedPath = path.resolve(mortyFilePath);
    if (!fs.existsSync(resolvedPath)) {
      return {
        error: `The specified Morty file '${mortyFilePath}' does not exist.`
      };
    }
    
    try {
      const loader = new MortyLoader(mortyFilePath, mortyClassName);
      await loader.loadMorty();
    } catch (error) {
      return {
        error: error.message
      };
    }

    return {
      numBoxes,
      mortyFilePath,
      mortyClassName,
      error: null
    };
  }
}
