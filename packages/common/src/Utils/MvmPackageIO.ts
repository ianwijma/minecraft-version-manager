import {
  AbstractProvider,
  Constants, DirectProvider,
  FileHandler,
  FileHashMissMatchError, ModList, ModProviders,
  MvmPackage,
  MvmPackageContent,
  MvmPackageLock, MvmPackageLockContent, Sides
} from "@mvm/common";
import { basename, join } from "path";
import * as fs from "fs";
import { ModCache } from "../FileCaches/ModCache";

export class MvmPackageIO {
  readonly dirPath: string
  private _mvmPackage: MvmPackage;
  private _mvmPackageBackup: MvmPackage;
  private _mvmPackageLock?: MvmPackageLock;
  private _mvmPackageLockBackup?: MvmPackageLock;
  private mvmPackageHash: string;
  private mvmPackageHashBackup: string;
  private mvmPackageLockHash: string;
  private mvmPackageLockHashBackup: string;

  get mvmPackage() : MvmPackage {
    return this._mvmPackage.clone();
  }

  get mvmPackageLock() : MvmPackageLock {
    return this._mvmPackageLock.clone();
  }

  get mvmPackagePath(): string {
    return join(this.dirPath, Constants.PACKAGE_FILE_NAME);
  }

  get mvmPackageLockPath(): string {
    return join(this.dirPath, Constants.LOCK_FILE_NAME);
  }

  constructor(dirPath: string, mvmPackage: MvmPackage, mvmPackageLock: MvmPackageLock) {
    this.dirPath = dirPath;
    this._mvmPackage = mvmPackage;
    this._mvmPackageBackup = mvmPackage;
    this._mvmPackageLock = mvmPackageLock;
    this._mvmPackageLockBackup = mvmPackageLock;

    this.mvmPackageHash = fs.existsSync(this.mvmPackagePath)
      ? FileHandler.getFileHashSync(this.mvmPackagePath) : '';
    this.mvmPackageLockHash = fs.existsSync(this.mvmPackageLockPath)
      ? FileHandler.getFileHashSync(this.mvmPackageLockPath) : '';
  }

  static async CreateFromDir(dirPath: string): Promise<MvmPackageIO> {
    const mvmPackage = new MvmPackage(await FileHandler.fromJson<MvmPackageContent>(
      join(dirPath, Constants.PACKAGE_FILE_NAME)
    ));
    const mvmLock = new MvmPackageLock(await FileHandler.fromJson<MvmPackageLockContent>(
      join(dirPath, Constants.LOCK_FILE_NAME)
    ));
    return new MvmPackageIO(dirPath, mvmPackage, mvmLock);
  }

  static async MvmPackageFromDir(dirPath: string): Promise<MvmPackage> {
    const IO = await this.CreateFromDir(dirPath);
    return IO.mvmPackage;
  }

  static async MvmPackageLockFromDir(dirPath: string): Promise<MvmPackageLock> {
    const IO = await this.CreateFromDir(dirPath);
    return IO.mvmPackageLock;
  }

  static CreateNew(path: string, overwriteMvmPackageContent: MvmPackageContent = {}, overwriteMvmPackageLockContent: MvmPackageLockContent = {}): MvmPackageIO{
    const mvmPackage = new MvmPackage({
      name: basename(path),
      version: '0.0.1',
      stability: 'release',
      minecraftVersion: Constants.LATEST_MINECRAFT_VERSION,
      modLoader: 'vanilla',
      modLoaderVersion: Constants.LATEST_MINECRAFT_VERSION,
      modProvider: 'direct',
      mods: {},
      clientMods: {},
      serverMods: {},
      files: [],
      ...overwriteMvmPackageContent
    });

    const mvmLock = new MvmPackageLock({
      name: basename(path),
      version: '0.0.1',
      mods: {},
      ...overwriteMvmPackageLockContent
    })

    return new MvmPackageIO(path, mvmPackage, mvmLock);
  }

  async writePackage() {
    await this.packageToFile();
    await this.updatePackageHash();
  }

  async writePackageLock() {
    await this.packageLockToFile();
    await this.updatePackageLockHash();
  }

  async updatePackage(updatedMvmPackageContent: MvmPackageContent) {
    const actualHash = await FileHandler.getFileHash(this.mvmPackagePath);
    FileHashMissMatchError.validate(this.mvmPackageHash, actualHash);

    this.updateMvmPackage(updatedMvmPackageContent);
    await this.savePackage();
  }

  private async savePackage() {
    await this.packageToFile();
    await this.updatePackageHash();
  }

  private async savePackageLock() {
    await this.packageLockToFile();
    await this.updatePackageLockHash();
  }

  private updateMvmPackage(updatedMvmPackageContent: MvmPackageContent) {
    const currentMvmPackageContent = this.mvmPackage.toJson();
    this._mvmPackage = new MvmPackage({
      ...currentMvmPackageContent,
      ...updatedMvmPackageContent
    });
  }

  private updateMvmPackageLock(updatedMvmPackageLockContent: MvmPackageLockContent) {
    const currentMvmPackageLockContent = this.mvmPackageLock.toJson();
    this._mvmPackageLock = new MvmPackageLock({
      ...currentMvmPackageLockContent,
      ...updatedMvmPackageLockContent
    });
  }

  private async packageToFile() {
    await FileHandler.toJson(this.mvmPackagePath, this._mvmPackage.toJson());
  }

  private async packageLockToFile() {
    await FileHandler.toJson(this.mvmPackageLockPath, this._mvmPackageLock.toJson());
  }

  private async updatePackageHash() {
    this.mvmPackageHash = await FileHandler.getFileHash(this.mvmPackagePath);
  }

  private async updatePackageLockHash() {
    this.mvmPackageLockHash = await FileHandler.getFileHash(this.mvmPackageLockPath);
  }

  async updateWithLockfile(updatedMvmPackageContent: MvmPackageContent): Promise<void> {
    const packageHash = await FileHandler.getFileHash(this.mvmPackageHash);
    FileHashMissMatchError.validate(this.mvmPackageHash, packageHash);

    const packageLockHash = await FileHandler.getFileHash(this.mvmPackageLockHash);
    FileHashMissMatchError.validate(this.mvmPackageLockHash, packageLockHash);

    try {
      this.updateMvmPackage(updatedMvmPackageContent);
      await this.savePackage();

      const { mods, clientMods, serverMods } = this.mvmPackage;
      const { modProvider: defaultProvider = null } = this.mvmPackage


      const updateMods = async (mods: ModList, side: Sides) => {
        for (const modName in mods) {
          const modValue = mods[modName];

          const version = modValue.version;
          const provider = modValue.provider;

          const modProviderName = provider ?? defaultProvider;
          const cacheVersion = modProviderName === 'direct' ? 'latest' : version;

          let fileHash = this.mvmPackageLock.getModHash(modName) ?? Constants.UNKNOWN_FILE_HASH;
          const inCache = await ModCache.inCache(modName, cacheVersion, fileHash);
          if (!inCache) {
            const modProvider = this.getProvider(modProviderName);
            const downloadPath = await modProvider.downloadOne(modName, modValue);

            fileHash = await ModCache.toCache(modName, cacheVersion, downloadPath);
          }

          this.updateMvmPackageLock({
            mods: {
              [modName]: {
                version: version,
                side:side,
                integrity: fileHash,
                dependencies: {}
              },
              ...this.mvmPackageLock.mods
            }
          });

        }
      }

      await updateMods(mods, 'both');
      await updateMods(clientMods, 'client');
      await updateMods(serverMods, 'server');
      await this.writePackageLock();

      this._mvmPackageBackup = this._mvmPackage;
      this.mvmPackageHashBackup = this.mvmPackageHash;
      this._mvmPackageLockBackup = this._mvmPackageLock;
      this.mvmPackageLockHashBackup = this.mvmPackageLockHash;
    } catch (error) {
      console.error(`Error happened, storing ${Constants.PACKAGE_FILE_NAME} & ${Constants.LOCK_FILE_NAME}`)
      this._mvmPackage = this._mvmPackageBackup;
      this.mvmPackageHash = this.mvmPackageHashBackup;
      this._mvmPackageLock = this._mvmPackageLockBackup;
      this.mvmPackageLockHash = this.mvmPackageLockHashBackup;
      await this.savePackage();
      await this.savePackageLock();
      throw error;
    }
  }

  private getProvider(provider: ModProviders): AbstractProvider {
    switch (provider) {
      case "direct":
        return new DirectProvider()
      case "github":
        return new DirectProvider()
      case "github-build":
        return new DirectProvider()
      case "curse-forge":
        return new DirectProvider()
      case "modrinth":
        return new DirectProvider()
    }
  }
}
