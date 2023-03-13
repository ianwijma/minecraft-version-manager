import * as path from "path";
import { AbstractFsError } from "./AbstractFsError";
import { staticImplements } from "../Decorators/staticImplements";
import { ValidatableError } from "./ValidatableError";

@staticImplements<ValidatableError>()
export class FileFoundError extends AbstractFsError {
  constructor(filePath: string) {
    super(`File exists error: ${path.resolve(filePath)}`);
  }

  static async validate(path: string) {
    await super.throwOnFound(path);
  }
}
