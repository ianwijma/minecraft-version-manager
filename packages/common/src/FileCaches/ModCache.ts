import { AbstractFileCache } from "./AbstractFileCache";
import { FileHandler, ModListName, ModListVersion } from "@mvm/common";
import * as path from "path";
import * as fs from "fs-extra";

export class ModCache extends AbstractFileCache {
  static getCacheSubDir(): string {
    return 'mods';
  }

  static async getModCacheDir(modName: ModListName, modVersion: ModListVersion): Promise<string> {
    const cacheDir = path.join(
      await this.getCacheDir(),
      modName,
      modVersion
    );

    await fs.ensureDir(cacheDir);
    return cacheDir;
  }

  static async toCache(modName: ModListName, modVersion: ModListVersion, fromPath: string): Promise<string> {
    const fileHash = await FileHandler.getFileHash(fromPath);
    const cachePath = path.join(await this.getModCacheDir(modName, modVersion), fileHash)

    if (await fs.exists(cachePath)) {
      await fs.rm(cachePath); // Cache already exists
    }

    await fs.move(fromPath, cachePath);
    return fileHash;
  }

  static async fromCache(modName: ModListName, modVersion: ModListVersion, fileHash: string, toPath: string): Promise<void> {
    const cachePath = path.join(await this.getModCacheDir(modName, modVersion), fileHash);
    await fs.copy(cachePath, toPath);
  }

  static async inCache(modName: ModListName, modVersion: ModListVersion, fileHash: string): Promise<boolean> {
    const cachePath = path.join(await this.getModCacheDir(modName, modVersion), fileHash);
    return await fs.exists(cachePath);
  }
}
