import { staticImplements } from "@mvm/common";
import { ValidatableError } from "./ValidatableError";

@staticImplements<ValidatableError>()
export class InArrayError<T> extends Error {
  constructor(array: T[], key: T) {
    super(`"${key}" already in: ${JSON.stringify(array)}`);
  }

  static validate<T>(array: T[], key: T) {
    if (array.includes(key)) {
      throw new this<T>(array, key)
    }
  }
}
