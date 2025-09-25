import { BaseMorty } from '../BaseMorty.js';

export class LazyMorty extends BaseMorty {
  constructor(numBoxes) {
    super(numBoxes);
  }

  requiresRandomChoice() {
    return false;
  }

  async hidePortalGun(numBoxes, fairValue) {
    return fairValue;
  }

  selectBoxesToRemove(initialGuess, portalGunBox, remainingBoxes) {
    return [];
  }

  getExactProbabilityStay() {
    return 1 / this.numBoxes;
  }

  getExactProbabilitySwitch() {
    return 0;
  }
}
