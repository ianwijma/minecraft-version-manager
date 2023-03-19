import { BaseModDetail, ModDetailMap, ModDetails, ModName } from "@mvm/common";
import path, { basename, join } from "path";
import os from "os";
import { nanoid } from "nanoid";
import * as fs from "fs-extra";
import axios from "axios/index";
import { createWriteStream } from "fs";

export interface DownloadResult {
  downloadFilePath: string
}
export interface DownloadList<T extends BaseModDetail = ModDetails>  {
  [key: ModName]: T
}
export interface DownloadResults {
  [key: ModName]: DownloadResult
}
export interface ResolvedDependencies<T extends BaseModDetail = ModDetails> {
  dependencies: ModDetailMap<T>
  optionalDependencies: ModDetailMap<T>
}

export abstract class AbstractModProvider<T extends BaseModDetail = ModDetails> {
  abstract downloadOne(modName: ModName, modDetail: T): Promise<DownloadResult>;

  abstract resolveDependencies(modName: ModName, modDetail: T): Promise<ResolvedDependencies>;

  async downloadMultiple(downloadList: DownloadList<T>): Promise<DownloadResults> {
    const downloadResults: DownloadResults = {};

    for (const modName in downloadList) {
      const modDetail = downloadList[modName];
      downloadResults[modName] = await this.downloadOne(modName, modDetail);
    }

    return downloadResults;
  }

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
