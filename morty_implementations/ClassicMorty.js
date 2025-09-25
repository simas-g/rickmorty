import { BaseMorty } from '../BaseMorty.js';

export class ClassicMorty extends BaseMorty {
  constructor(numBoxes) {
    super(numBoxes);
  }

  requiresRandomChoice() {
    return true;
  }

  async hidePortalGun(numBoxes, fairValue) {
    return fairValue;
  }

  selectBoxesToRemove(initialGuess, portalGunBox, remainingBoxes, fairValue) {
    const boxesNotInitialGuess = remainingBoxes.filter(box => box !== initialGuess);

    const indexToKeep = fairValue % boxesNotInitialGuess.length;
    const boxToKeep = boxesNotInitialGuess[indexToKeep];

    return boxesNotInitialGuess.filter(box => box !== boxToKeep);
  }

  getExactProbabilityStay() {
    return 1 / this.numBoxes;
  }

  getExactProbabilitySwitch() {
    return (this.numBoxes - 1) / this.numBoxes;
  }
}
