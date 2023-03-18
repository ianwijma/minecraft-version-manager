import { AbstractFileCache } from "./AbstractFileCache";
import { FileHandler, ModDetails, ModName } from "@mvm/common";
import * as path from "path";
import * as fs from "fs-extra";

export class ModCache extends AbstractFileCache {
  static getCacheSubDir(): string {
    return 'mods';
  }

  static async getModCacheDir(modName: ModName, modDetail: ModDetails): Promise<string> {
    const cacheDir = path.join(
      await this.getCacheDir(),
      modName,
      modDetail.version
    );

    await fs.ensureDir(cacheDir);
    return cacheDir;
  }

  static async toCache(modName: ModName, modDetail: ModDetails, fromPath: string): Promise<string> {
    const fileHash = await FileHandler.getFileHash(fromPath);
    const cachePath = path.join(await this.getModCacheDir(modName, modDetail), fileHash)

    if (await fs.exists(cachePath)) {
      await fs.rm(cachePath); // Cache already exists
    }

    await fs.move(fromPath, cachePath);
    return fileHash;
  }

  static async fromCache(modName: ModName, modDetail: ModDetails, toPath: string): Promise<void> {
    const cachePath = path.join(await this.getModCacheDir(modName, modDetail), modDetail.hash);
    await fs.copy(cachePath, toPath);
  }

  static async inCache(modName: ModName, modDetail: ModDetails): Promise<boolean> {
    const cachePath = path.join(await this.getModCacheDir(modName, modDetail), modDetail.hash);
    return await fs.exists(cachePath);
  }
}
