import * as path from "path";
import { AbstractFsError } from "./AbstractFsError";
import { staticImplements } from "../Decorators/staticImplements";
import { ValidatableError } from "./ValidatableError";

@staticImplements<ValidatableError>()
export class DirNotFoundError extends AbstractFsError {
  constructor(dirPath: string) {
    super(`Directory does not exists error: ${path.resolve(dirPath)}`);
  }

  static async validate(path: string) {
    await super.throwOnNotFound(path);
  }
}
