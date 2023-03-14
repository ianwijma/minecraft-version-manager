import * as os from "os";
import { Constants } from "@mvm/common";
import * as path from "path";
import * as fs from "fs-extra";

export abstract class AbstractFileCache {
  private static getCacheDirName(): string {
    switch (os.platform()) {
      case 'win32':
        return Constants.CACHE_DIR;
      default:
        return `.${Constants.CACHE_DIR}`;
    }
  }

  static getCacheSubDir(): string {
    return '';
  };

  static async getCacheDir(): Promise<string> {
    const dirPath = path.join(
      os.homedir(),
      this.getCacheDirName(),
      this.getCacheSubDir()
    );

    await fs.ensureDir(dirPath);
    return dirPath;
  }
}
