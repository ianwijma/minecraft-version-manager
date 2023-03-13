import { Constants, FileHandler, FileHashMissMatchError, MvmPackage, MvmPackageContent } from "@mvm/common";
import { basename, dirname, join } from "path";
import * as fs from "fs";

export class MvmPackageIO {
  private readonly dir: string
  private readonly file: string
  private _mvmPackage: MvmPackage;
  private mvmPackageHash: string;

  get mvmPackage() : MvmPackage {
    return this._mvmPackage.clone();
  }

  get path(): string {
    return join(this.dir, this.file);
  }

  constructor(packagePath: string, mvmPackage: MvmPackage) {
    this.dir = packagePath ? dirname(packagePath) : '';
    this.file = packagePath ? basename(packagePath) : '';
    this._mvmPackage = mvmPackage;
    this.mvmPackageHash = fs.existsSync(packagePath) ? FileHandler.getFileHashSync(packagePath) : '';
  }

  static async CreateFromPath(path: string): Promise<MvmPackageIO> {
    const mvmPackageContent = await FileHandler.fromJson<MvmPackageContent>(path);
    const mvmPackage = new MvmPackage(mvmPackageContent);
    return new MvmPackageIO(path, mvmPackage);
  }

  static CreateNew(path: string, overwriteMvmPackageContent: MvmPackageContent = {}): MvmPackageIO{
    const mvmPackage = new MvmPackage({
      name: dirname(path),
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

    return new MvmPackageIO(path, mvmPackage);
  }

  async write() {
    await this.storeToFile();
    await this.updateHash();
  }

  async update(updatedMvmPackageContent: MvmPackageContent) {
    const actualHash = await FileHandler.getFileHash(this.path);
    FileHashMissMatchError.validate(this.mvmPackageHash, actualHash);

    this.updateMvmPackage(updatedMvmPackageContent);
    await this.storeToFile();
    await this.updateHash();
  }

  private updateMvmPackage(updatedMvmPackageContent: MvmPackageContent) {
    const currentMvmPackageContent = this._mvmPackage.toJson();
    this._mvmPackage = new MvmPackage({
      ...currentMvmPackageContent,
      ...updatedMvmPackageContent
    });
  }

  private async storeToFile() {
    await FileHandler.toJson(this.path, this._mvmPackage.toJson());
  }

  private async updateHash() {
    this.mvmPackageHash = await FileHandler.getFileHash(this.path);
  }
}
