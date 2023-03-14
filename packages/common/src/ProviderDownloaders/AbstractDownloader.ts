import * as os from "os";
import * as path from "path";
import { nanoid } from 'nanoid';
import * as fs from "fs-extra";
import axios from "axios";
import { basename, join } from "path";
import { createWriteStream } from "fs";

export abstract class AbstractDownloader {
  abstract download(): Promise<string>;

  protected async getTmpDir(): Promise<string> {
    const dir = path.join(os.tmpdir(), nanoid());
    await fs.ensureDir(dir);
    return dir;
  }

  protected downloadFile(url: string, dirPath: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios({
          method: 'GET',
          url: url,
          responseType: 'stream'
        });

        const { pathname } = new URL(url);
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
}
