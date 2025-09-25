export class BaseMorty {
  constructor(numBoxes) {
    this.numBoxes = numBoxes;
  }
  requiresRandomChoice() {
    throw new Error('Morty implementations must provide a requiresRandomChoice method.');
  }
  async hidePortalGun(numBoxes, fairValue) {
    throw new Error('Morty implementations must provide a hidePortalGun method.');
  }
  selectBoxesToRemove(initialGuess, portalGunBox, remainingBoxes, fairValue) {
    throw new Error('Morty implementations must provide a selectBoxesToRemove method.');
  }
  getExactProbabilityStay() {
    throw new Error('Morty implementations must provide a getExactProbabilityStay method.');
  }
  getExactProbabilitySwitch() {
    throw new Error('Morty implementations must provide a getExactProbabilitySwitch method.');
  }
}
