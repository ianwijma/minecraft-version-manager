import * as fs from "fs-extra";
import * as crypto from "crypto";
import { FileNotFoundError } from "../Errors/FileNotFoundError";
import { Constants } from "./Constants";
import { basename, join, relative } from "path";
import * as process from "process";
import { Crypto } from "./Crypto";
import axios from "axios";
import { createWriteStream } from "fs";
import path from "path";
import os from "os";
import { nanoid } from "nanoid";

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
  static async fromJson<T extends object = {}>(path: string): Promise<T> {
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
    return Crypto.createHash(content);
  }

  static downloadFile(url: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios({
          method: 'GET',
          url: url,
          responseType: 'stream'
        });

        const { pathname } = new URL(url);
        const dirPath = await this.getTmpDir();
        const fileName = basename(pathname);
        const filePath = join(dirPath, fileName);
        const writer = createWriteStream(filePath);

        let error = null;
        writer.on('error', err => {
          error = err;
          writer.close();
          reject(err.message);
        });
        writer.on('close', () => {
          if (!error) {
            resolve(filePath)
          }
        });

        const { data } = response;
        data.pipe(writer);
      } catch (err) {
        reject(err.message);
      }
    })
  }

  static async getTmpDir() {
    const dir = path.join(os.tmpdir(), nanoid());
    await fs.ensureDir(dir);
    return dir;
  }
}
