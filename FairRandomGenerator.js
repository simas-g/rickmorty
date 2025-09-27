import crypto from 'crypto';

export class FairRandomGenerator {
  constructor() {
    this.secretKey = crypto.randomBytes(32).toString('hex');
  }
  getSecretMortyValue(range) {
    return crypto.randomInt(0, range);
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
