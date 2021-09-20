import { createHmac } from 'crypto';
import { v4 } from 'uuid';

export default class CryptoTool {
  static hash(data, algorithm = 'sha256', key = '') {
    const hash = createHmac(algorithm, key);
    hash.update(data);
    return hash.digest('hex');
  }

  static uuid() {
    return v4();
  }
}
