import { BaseMorty } from './BaseMorty.js';

export class MortyLoader {

  constructor(mortyFilePath, mortyClassName) {
    this.mortyFilePath = mortyFilePath;
    this.mortyClassName = mortyClassName;
  }

  async loadMorty(numBoxes) {
    try {
      const { [this.mortyClassName]: MortyClass } = await import(this.mortyFilePath);
      if (!MortyClass) {
        throw new Error(`Class '${this.mortyClassName}' not found in file.`);
      }

      const mortyInstance = new MortyClass(numBoxes);

      const requiredMethods = [
        'requiresRandomChoice',
        'hidePortalGun',
        'selectBoxesToRemove',
        'getExactProbabilityStay',
        'getExactProbabilitySwitch'
      ];
      for (const method of requiredMethods) {
        if (typeof mortyInstance[method] !== 'function') {
          throw new Error(`Morty class '${this.mortyClassName}' is missing required method: ${method}`);
        }
      }

      if (!(mortyInstance instanceof BaseMorty)) {
        throw new Error(`Morty class '${this.mortyClassName}' must extend BaseMorty.`);
      }

      return mortyInstance;
    } catch (error) {
      throw new Error(`Failed to load Morty implementation: ${error.message}`);
    }
  }
}
