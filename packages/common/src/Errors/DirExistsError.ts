import * as path from "path";

export class DirExistsError extends Error {
  constructor(dirPath: string) {
    super(`Directory exists error: ${path.resolve(dirPath)}`);
  }
}
