import * as fs from "fs-extra";
import * as crypto from "crypto";
import { FileNotFoundError } from "../Errors/FileNotFoundError";

export interface ToJson {
  toJson: Function
}

export class FileHandler {
  static async fromJson<T extends object>(path: string): Promise<T> {
    await FileNotFoundError.validate(path);
    return fs.readJSON(path);
  }

  static async toJson(path: string, content: object): Promise<void> {
    await fs.writeJSON(path, content, { spaces: 4 });
  }

  static async getFileHash(path: string): Promise<string> {
    const content = await fs.readFile(path);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(content);
    return hashSum.digest('hex');
  }

  static getFileHashSync(path: string): string {
    const content = fs.readFileSync(path);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(content);
    return hashSum.digest('hex');
  }
}
