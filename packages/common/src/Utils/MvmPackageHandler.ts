import {
  AbstractProvider,
  Constants,
  CurseForgeProvider, DirectDownloadProvider,
  FileHandler,
  FileHashMissMatchError, GithubBuildProvider, GithubReleaseProvider,
  ModDetailMap,
  ModDetails,
  ModLoaders,
  ModProviders, ModrinthProvider,
  MvmPackage,
  MvmPackageContent,
  Stabilities
} from "@mvm/common";
import { basename, join } from "path";
import { ModCache } from "../FileCaches/ModCache";
import * as fs from "fs";

export class MvmPackageHandler {
  readonly projectDir: string;
  private _mvmPackage: MvmPackage;
  private _mvmPackageBackup: MvmPackage;
  private _mvmPackageHash: string

  get mvmPackage(): MvmPackage {
    return this._mvmPackage.clone();
  }

  get mvmPackagePath(): string {
    return join(this.projectDir, Constants.PACKAGE_FILE_NAME);
  }

  constructor(projectDir: string, mvmPackage: MvmPackage) {
    this.projectDir = projectDir;
    this._mvmPackage = mvmPackage.clone();
    this._mvmPackageBackup = mvmPackage.clone();

    const mvmPackagePath = join(this.projectDir, Constants.PACKAGE_FILE_NAME);
    const mvmPackageExists = fs.existsSync(mvmPackagePath);
    this._mvmPackageHash = mvmPackageExists ? FileHandler.getFileHashSync(mvmPackagePath) : '';
  }

  static async CreateFromProjectDir(projectDir: string): Promise<MvmPackageHandler> {
    const mvmPackagePath = join(projectDir, Constants.PACKAGE_FILE_NAME);
    const mvmPackageContent = await FileHandler.fromJson<MvmPackageContent>(mvmPackagePath);
    const mvmPackage = new MvmPackage(mvmPackageContent);
    return new this(projectDir, mvmPackage);
  }

  static CreateNew(projectDir: string, mvmPackageContent: MvmPackageContent = {}): MvmPackageHandler {
    const mvmPackage = new MvmPackage({
      _package_version: Constants.PACKAGE_VERSION,
      name: basename(projectDir),
      version: '0.0.1',
      stability: Stabilities.RELEASE,
      minecraftVersion: Constants.LATEST_MINECRAFT_VERSION,
      modLoader: ModLoaders.VANILLA,
      modLoaderVersion: Constants.LATEST_MINECRAFT_VERSION,
      modProvider: ModProviders.DIRECT_DOWNLOAD,
      mods: {},
      files: {},
      ...mvmPackageContent
    });

    return new MvmPackageHandler(projectDir, mvmPackage);
  }

  update(updatePackageContent: MvmPackageContent): MvmPackageHandler {
    const currentPackageContent = this.mvmPackage.toJson();
    this._mvmPackage = new MvmPackage({
      ...currentPackageContent,
      ...updatePackageContent
    });

    return this;
  }

  async save(): Promise<MvmPackageHandler> {
    FileHashMissMatchError.validate(this.mvmPackagePath, this._mvmPackageHash);

    try {
      await FileHandler.toJson(this.mvmPackagePath, this.mvmPackage.toJson());
      this._mvmPackageHash = await FileHandler.getFileHash(this.mvmPackagePath);

      // Create a per provider modDetail map
      const { mods } = this.mvmPackage;
      const providerModDetailMap: {[key in ModProviders]?: ModDetailMap} = {};
      for (const modName in mods) {
        const mod = mods[modName];

        if (!(mod.provider in providerModDetailMap)) {
          providerModDetailMap[mod.provider] = {} as ModDetailMap
        }

        providerModDetailMap[mod.provider][modName] = mod;
      }

      // Initialise all downloads.
      await Promise.all(Object.keys(providerModDetailMap).map(async (modProvider: ModProviders) => {
        const provider = this.getProvider(modProvider);
        const modDetailMap = providerModDetailMap[modProvider];
        const modDetailMapNotInCache: ModDetailMap = {};

        for (const modName in modDetailMap) {
          const modDetail = modDetailMap[modName];
          const inCache = ModCache.inCache(modName, modDetail);
          if (!inCache) {
            modDetailMapNotInCache[modName] = modDetail
          }
        }

        const modDownloadList = await provider.downloadMultiple(modDetailMapNotInCache);
        for (const modName in modDownloadList) {
          mods[modName].hash =
            await ModCache.toCache(modName, mods[modName], modDownloadList[modName]);
        }
      }));

      // Update mvmPackage with hashes
      this.update({ mods });
      await FileHandler.toJson(this.mvmPackagePath, this.mvmPackage.toJson());
      this._mvmPackageHash = await FileHandler.getFileHash(this.mvmPackagePath);

    } catch (error) {
      this._mvmPackage = this._mvmPackageBackup;
      await FileHandler.toJson(this.mvmPackagePath, this.mvmPackage.toJson());
      this._mvmPackageHash = await FileHandler.getFileHash(this.mvmPackagePath);
      throw error;
    }

    return this;
  }

  async initialize(): Promise<MvmPackageHandler> {
    await FileHandler.toJson(this.mvmPackagePath, this.mvmPackage.toJson());
    this._mvmPackageHash = await FileHandler.getFileHash(this.mvmPackagePath);

    return this;
  }

  private getProvider(provider: ModProviders): AbstractProvider<ModDetails> {
    switch (provider) {
      case ModProviders.DIRECT_DOWNLOAD:
        return new DirectDownloadProvider()
      case ModProviders.GITHUB_RELEASE:
        return new GithubReleaseProvider()
      case ModProviders.GITHUB_BUILD:
        return new GithubBuildProvider()
      case ModProviders.CURSE_FORGE:
        return new CurseForgeProvider()
      case ModProviders.MODRINTH:
        return new ModrinthProvider()
    }
  }
}
