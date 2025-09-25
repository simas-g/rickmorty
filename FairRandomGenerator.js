import crypto from 'crypto';

export class FairRandomGenerator {
  constructor() {
    this.secretKey = crypto.randomBytes(32).toString('hex');
  }
  getSecretMortyValue(range) {
    const randomBytes = crypto.randomBytes(32);
    const randomNumber = randomBytes.readUInt32BE(0);
    return randomNumber % range;
  }
  generateHmac(mortyValue) {
    const hmac = crypto.createHmac('sha3-256', this.secretKey);
    hmac.update(String(mortyValue));
    return hmac.digest('hex');
  }
  getFairValue(mortyValue, rickValue, range) {
    return (mortyValue + rickValue) % range;
  }
}
