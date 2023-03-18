import { ToJson } from "./FileHandler";
import { Constants } from "./Constants";

export enum Sides {
  BOTH = 'both',
  CLIENT = 'both',
  SERVER = 'both',
}

export enum Stabilities {
  RELEASE = 'release',
  BETA = 'beta',
  ALPHA = 'alpha',
}

export enum ModLoaders {
  VANILLA = 'vanilla',
  FORGE = 'forge',
  FABRIC = 'fabric',
  QUILT = 'quilt',
}

export enum ModProviders {
  DIRECT_DOWNLOAD = 'direct-download',
  GITHUB_RELEASE = 'github-release',
  GITHUB_BUILD = 'github-build',
  CURSE_FORGE = 'curse-forge',
  MODRINTH = 'modrinth',
}

export type ModName = string;
export type ModVersion = string;
export type ModFileHash = string;

export interface BaseModDetail {
  provider: ModProviders
  version: ModVersion
  side: Sides
  hash: ModFileHash
}

export interface DirectDownloadModDetail extends BaseModDetail {
  provider: ModProviders.DIRECT_DOWNLOAD,
  downloadUrl: string
}

export interface CurseForgeModDetail extends BaseModDetail {
  provider: ModProviders.CURSE_FORGE
}
export interface ModrinthModDetail extends BaseModDetail {
  provider: ModProviders.MODRINTH
}
export interface GithubReleaseModDetail extends BaseModDetail {
  provider: ModProviders.GITHUB_RELEASE
  owner: string
  repo: string
  tag?: string
  file?: string
}

export interface GithubBuildModDetail extends BaseModDetail {
  provider: ModProviders.GITHUB_BUILD
  owner: string
  repo: string
  command: string
}

export type ModDetails = DirectDownloadModDetail | CurseForgeModDetail | ModrinthModDetail | GithubReleaseModDetail | GithubBuildModDetail

export interface ModDetailMap<T extends BaseModDetail = ModDetails> {
  [key: ModName]: T
}

export interface Files {
  [key: string]: string
}

export interface MvmPackageContent {
  _package_version?: number
  name?: string
  version?: string
  stability?: Stabilities
  minecraftVersion?: string
  modLoader?: ModLoaders
  modLoaderVersion?: string
  modProvider?: ModProviders
  mods?: ModDetailMap
  files?: Files
}

export class MvmPackage implements Required<MvmPackageContent>, ToJson<Required<MvmPackageContent>>{
  _package_version: number;
  name: string;
  version: string
  stability: Stabilities
  minecraftVersion: string
  modLoader: ModLoaders
  modLoaderVersion: string
  modProvider: ModProviders
  mods: ModDetailMap
  files: Files

  constructor(packageContent: MvmPackageContent = {}) {
    this.fromContent(packageContent);
  }

  private fromContent(packageContent: MvmPackageContent = {}) {
    this._package_version = packageContent._package_version
    this.name = packageContent.name
    this.stability = packageContent.stability as Stabilities
    this.version = packageContent.version;
    this.minecraftVersion = packageContent.minecraftVersion
    this.modLoader = packageContent.modLoader as ModLoaders
    this.modLoaderVersion = packageContent.modLoaderVersion
    this.mods = packageContent.mods
    this.modProvider = packageContent.modProvider as ModProviders
    this.files = packageContent.files
  }

  public toJson() {
    return {
      _package_version: this._package_version,
      name: this.name,
      stability: this.stability,
      version: this.version,
      minecraftVersion: this.minecraftVersion,
      modLoader: this.modLoader,
      modLoaderVersion: this.modLoaderVersion,
      modProvider: this.modProvider,
      mods: this.mods,
      files: this.files,
    }
  }

  clone() {
    return new MvmPackage(this.toJson());
  }

  getModHash(modName: ModName): ModFileHash {
    return this?.mods[modName]?.hash ?? Constants.UNKNOWN_FILE_HASH;
  }
}
