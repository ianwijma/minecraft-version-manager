import * as path from "path";
import { AbstractFsError } from "./AbstractFsError";
import { staticImplements } from "../Decorators/staticImplements";
import { ValidatableError } from "./ValidatableError";

@staticImplements<ValidatableError>()
export class FileNotFoundError extends AbstractFsError {
  constructor(filePath: string) {
    super(`File does not exists error: ${path.resolve(filePath)}`);
  }

  static async validate(path: string) {
    await super.throwOnNotFound(path);
  }
}
