import readline from 'readline';
import Table from 'cli-table3';
import { MortyLoader } from './MortyLoader.js';
import { StatisticsManager } from './StatisticsManager.js';
import { FairRandomGenerator } from './FairRandomGenerator.js';

export class Game {
  constructor(numBoxes, mortyFilePath, mortyClassName) {
    this.numBoxes = numBoxes;
    this.mortyFilePath = mortyFilePath;
    this.mortyClassName = mortyClassName;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.stats = new StatisticsManager();
    this.morty = null;
    this.fairRandomizer = new FairRandomGenerator();
  }

  async startGame() {
    try {
      const loader = new MortyLoader(this.mortyFilePath, this.mortyClassName);
      this.morty = await loader.loadMorty(this.numBoxes); 
      console.log(`Morty: Oh geez, Rick, I'm gonna hide your portal gun in one of the ${this.numBoxes} boxes, okay?`);
      await this.runGameLoop();
      this.rl.close();
    } catch (error) {
      console.error(error.message);
      this.rl.close();
      process.exit(1);
    }
  }

  async runGameLoop() {
    let playAgain = 'y';
    while (playAgain.toLowerCase() === 'y') {
      await this.playRound();
      playAgain = await this.askQuestion("Morty: D-do you wanna play another round (y/n)?\nRick: ");
    }
    console.log("Morty: Okay… uh, bye!");
    this.displayStats();
  }

  async playRound() {
    const mortyValue1 = this.fairRandomizer.getSecretMortyValue(this.numBoxes);
    const hmac1 = this.fairRandomizer.generateHmac(mortyValue1);
    console.log(`Morty: HMAC1=${hmac1}`);
    const rickValue1 = parseInt(await this.askQuestion(`Morty: Rick, enter your number [0,${this.numBoxes}) so you don’t whine later that I cheated, alright?\nRick: `), 10);
    const fairValue1 = this.fairRandomizer.getFairValue(mortyValue1, rickValue1, this.numBoxes);
    const portalGunBox = await this.morty.hidePortalGun(this.numBoxes, fairValue1);

    const initialGuess = parseInt(await this.askQuestion(`Morty: Okay, okay, I hid the gun. What’s your guess [0,${this.numBoxes})?\nRick: `), 10);
    if (isNaN(initialGuess) || initialGuess < 0 || initialGuess >= this.numBoxes) {
      console.log("Morty: Aww man, that's not a valid number. Let's try again.");
      return;
    }

    const remainingBoxes = Array.from({ length: this.numBoxes }, (_, i) => i).filter(box => box !== initialGuess);

    let boxesToRemove = [];
    if (this.numBoxes > 2 && this.morty.requiresRandomChoice()) {
      console.log("Morty: Let’s, uh, generate another value now, I mean, to select a box to keep in the game.");
      const mortyValue2 = this.fairRandomizer.getSecretMortyValue(remainingBoxes.length);
      const hmac2 = this.fairRandomizer.generateHmac(mortyValue2);
      console.log(`Morty: HMAC2=${hmac2}`);
      const rickValue2 = parseInt(await this.askQuestion(`Morty: Rick, enter your number [0,${remainingBoxes.length}), and, uh, don’t say I didn’t play fair, okay?\nRick: `), 10);
      const fairValue2 = this.fairRandomizer.getFairValue(mortyValue2, rickValue2, remainingBoxes.length);
      
      console.log(`Morty: Aww man, my 2nd random value is ${mortyValue2}.`);
      console.log(`Morty: KEY2=${this.fairRandomizer.secretKey}`);
      console.log(`Morty: Uh, okay, the 2nd fair number is (${mortyValue2} + ${rickValue2}) % ${remainingBoxes.length} = ${fairValue2}`);

      boxesToRemove = this.morty.selectBoxesToRemove(initialGuess, portalGunBox, remainingBoxes, fairValue2);
    } else {
      boxesToRemove = this.morty.selectBoxesToRemove(initialGuess, portalGunBox, remainingBoxes);
    }

    const finalBoxes = remainingBoxes.filter(box => !boxesToRemove.includes(box));

    if (finalBoxes.length === 1) {
      const switchOption = finalBoxes[0];
      const choice = parseInt(await this.askQuestion(`Morty: You can switch your box (enter ${switchOption}), or, you know, stick with it (enter ${initialGuess}).\nRick: `), 10);
      
      console.log(`Morty: Aww man, my 1st random value is ${mortyValue1}.`);
      console.log(`Morty: KEY1=${this.fairRandomizer.secretKey}`);
      console.log(`Morty: So the 1st fair number is (${mortyValue1} + ${rickValue1}) % ${this.numBoxes} = ${fairValue1}`);

      const win = choice === portalGunBox;
      const isSwitch = choice === switchOption;

      this.stats.recordResult(win, isSwitch);
      
      console.log(`Morty: You portal gun is in the box ${portalGunBox}.`);
      if (win) {
        console.log("Morty: Aww man, you won, Rick!");
      } else {
        console.log("Morty: Aww man, you lost, Rick. Now we gotta go on one of *my* adventures!");
      }
    } else {
      const win = initialGuess === portalGunBox;
      this.stats.recordResult(win, false);
      console.log(`Morty: The portal gun was in the box ${portalGunBox}.`);
      if (win) {
        console.log("Morty: Aww man, you won, Rick!");
      } else {
        console.log("Morty: Aww man, you lost, Rick!");
      }
    }
  }

  askQuestion(query) {
    return new Promise(resolve => this.rl.question(query, resolve));
  }

  displayStats() {
    const { winsStay, roundsStay, winsSwitch, roundsSwitch } = this.stats.getStats();

    const pExactStay = this.morty.getExactProbabilityStay();
    const pExactSwitch = this.morty.getExactProbabilitySwitch();
    
    const pEstimateStay = roundsStay > 0 ? (winsStay / roundsStay).toFixed(3) : 0.000;
    const pEstimateSwitch = roundsSwitch > 0 ? (winsSwitch / roundsSwitch).toFixed(3) : 0.000;

    const table = new Table({
      head: ['Game results', 'Rick switched', 'Rick stayed'],
      colWidths: [15, 15, 15]
    });

    table.push(
      ['Rounds', roundsSwitch, roundsStay],
      ['Wins', winsSwitch, winsStay],
      ['P (estimate)', pEstimateSwitch, pEstimateStay],
      ['P (exact)', pExactSwitch.toFixed(3), pExactStay.toFixed(3)]
    );

    console.log("\n             GAME STATS ");
    console.log(table.toString());
  }
}
