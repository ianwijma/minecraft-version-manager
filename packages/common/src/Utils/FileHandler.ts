import * as fs from "fs-extra";
import * as crypto from "crypto";
import { FileNotFoundError } from "../Errors/FileNotFoundError";
import { Constants } from "./Constants";
import { relative } from 'path';
import * as process from "process";

export interface ToJson<T> {
  toJson: () => T
}

export class FileHandler {
  static normalizePath(path: string): string {
    if (path.endsWith('/')) {
      path = path.slice(0, path.length-1);
    }

    return relative(process.cwd(), path);
  }
  static async fromJson<T extends object>(path: string): Promise<T> {
    await FileNotFoundError.validate(path);
    return fs.readJSON(path);
  }

  static async toJson(path: string, content: object): Promise<void> {
    await fs.writeJSON(path, content, { spaces: 4 });
  }

  static async getFileHash(path: string): Promise<string> {
    const content = await fs.readFile(path);
    const hashSum = crypto.createHash(Constants.DEFAULT_HASH_TYPE);
    hashSum.update(content);
    return hashSum.digest('hex');
  }

  static getFileHashSync(path: string): string {
    const content = fs.readFileSync(path);
    const hashSum = crypto.createHash(Constants.DEFAULT_HASH_TYPE);
    hashSum.update(content);
    return hashSum.digest('hex');
  }
}
