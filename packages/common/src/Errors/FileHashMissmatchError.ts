import { ValidatableError } from "./ValidatableError";
import { staticImplements } from "@mvm/common";

@staticImplements<ValidatableError>()
export class FileHashMissMatchError extends Error {
  constructor(path, expected, actual) {
    super(`File "${path}" hash miss match, expected "${expected}" but got "${actual}"`);
  }

  static validate(path, expected, actual): void {
    if (expected !== actual) {
      throw new this(path, expected, actual);
    }
  }
}
