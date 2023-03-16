import { staticImplements } from "@mvm/common";
import { ValidatableError } from "./ValidatableError";
import * as process from "process";

@staticImplements<ValidatableError>()
export class EnvironmentVariableMissingError<T> extends Error {
  constructor(environmentVariable: string, errorMessage: string = null) {
    if (!errorMessage) errorMessage = `Missing environment variable "${environmentVariable}"`;
    super(errorMessage);
  }

  static validate<T>(environmentVariable: string, errorMessage: string = null) {
    if (!(environmentVariable in process.env)) {
      throw new this(environmentVariable, errorMessage);
    }
  }
}
