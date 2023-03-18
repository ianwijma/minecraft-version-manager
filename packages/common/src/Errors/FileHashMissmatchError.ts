import { ValidatableError } from "./ValidatableError";
import { FileHandler, staticImplements } from "@mvm/common";

@staticImplements<ValidatableError>()
export class FileHashMissMatchError extends Error {
  constructor(path: string, expected: string, actual: string) {
    super(`File "${path}" hash miss match, expected "${expected}" but got "${actual}"`);
  }

  static validate(path: string, expected: string): void {
    const actual = FileHandler.getFileHashSync(path);
    if (expected !== actual) {
      throw new this(path, expected, actual);
    }
  }
}
