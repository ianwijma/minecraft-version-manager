import * as path from "path";

export class FileExistsError extends Error {
  constructor(filePath: string) {
    super(`File exists error: ${path.resolve(filePath)}`);
  }
}
