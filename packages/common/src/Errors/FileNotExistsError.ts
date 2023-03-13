import * as path from "path";

export class FileNotExistsError extends Error {
  constructor(filePath: string) {
    super(`File does not exists error: ${path.resolve(filePath)}`);
  }
}
