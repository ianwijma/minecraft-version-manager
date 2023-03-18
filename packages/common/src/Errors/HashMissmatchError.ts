import { ValidatableError } from "./ValidatableError";
import { Crypto, staticImplements } from "@mvm/common";

@staticImplements<ValidatableError>()
export class HashMissMatchError extends Error {
  constructor(content: string, expected: string, actual: string) {
    super(`Hash miss match, expected "${expected}" but got "${actual}". Content: ${content}`);
  }

  static validate(content: string, expected: string): void {
    const actual = Crypto.createHash(content);
    if (expected !== actual) {
      throw new this(content, expected, actual);
    }
  }
}
