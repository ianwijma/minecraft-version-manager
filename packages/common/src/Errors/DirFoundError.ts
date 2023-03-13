import * as path from "path";
import { AbstractFsError } from "./AbstractFsError";
import { staticImplements } from "../Decorators/staticImplements";
import { ValidatableError } from "./ValidatableError";

@staticImplements<ValidatableError>()
export class DirFoundError extends AbstractFsError {
  constructor(dirPath: string) {
    super(`Directory exists error: ${path.resolve(dirPath)}`);
  }

  static async validate(path: string) {
    await super.throwOnFound(path);
  }
}
