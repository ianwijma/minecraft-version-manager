import crypto, { BinaryLike } from "crypto";
import { Constants } from "@mvm/common";

export class Crypto {
  static createHash(content: BinaryLike): string {
    const hashSum = crypto.createHash(Constants.DEFAULT_HASH_TYPE);
    hashSum.update(content);
    return hashSum.digest('hex');
  }
}
