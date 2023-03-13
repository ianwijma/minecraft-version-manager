import * as path from "path";

export class DirNotExistsError extends Error {
  constructor(dirPath: string) {
    super(`Directory does not exists error: ${path.resolve(dirPath)}`);
  }
}
