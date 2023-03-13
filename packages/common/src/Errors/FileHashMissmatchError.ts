import { ValidatableError } from "./ValidatableError";
import { staticImplements } from "@mvm/common";

@staticImplements<ValidatableError>()
export class FileHashMissMatchError extends Error {
  constructor(expected, actual) {
    super(`File hash miss match, expected "${expected}" but got "${actual}"`);
  }

  static validate(expected, actual): void {
    if (expected !== actual) {
      throw new this(expected, actual);
    }
  }
}
