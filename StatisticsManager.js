
export class StatisticsManager {
  constructor() {
    this.winsStay = 0;
    this.roundsStay = 0;
    this.winsSwitch = 0;
    this.roundsSwitch = 0;
  }

  recordResult(win, isSwitch) {
    if (isSwitch) {
      this.roundsSwitch++;
      if (win) {
        this.winsSwitch++;
      }
    } else {
      this.roundsStay++;
      if (win) {
        this.winsStay++;
      }
    }
  }

  getStats() {
    return {
      winsStay: this.winsStay,
      roundsStay: this.roundsStay,
      winsSwitch: this.winsSwitch,
      roundsSwitch: this.roundsSwitch
    };
  }
}
