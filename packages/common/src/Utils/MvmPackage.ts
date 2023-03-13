import { ToJson } from "./FileHandler";

export type StabilityRelease = 'release';
export type StabilityBeta = 'beta';
export type StabilityAlpha = 'alpha';
export type Stabilities = StabilityRelease | StabilityBeta | StabilityAlpha;

export type ModLoaderVanilla = 'vanilla';
export type ModLoaderForge = 'forge';
export type ModLoaderFabric = 'fabric';
export type ModLoaderQuilt = 'quilt';
export type ModLoaders = ModLoaderVanilla | ModLoaderForge | ModLoaderFabric | ModLoaderQuilt;

export type ModProviderDirect = 'direct';
export type ModProviderGithub = 'github';
export type ModProviderGithubBuild = 'github-build';
export type ModProviderCurseForge = 'curse-forge';
export type ModProviderModrinth = 'modrinth';
export type ModProviders = ModProviderDirect | ModProviderGithub | ModProviderGithubBuild | ModProviderCurseForge | ModProviderModrinth;

export type ModListVersion = string;
export interface ModListItem {
  version: ModListVersion,
  provider: ModProviders
}

export interface ModList {
  [key: string]: ModListVersion | ModListItem
}

export interface FilesObject {
  [key: string]: string
}
export type FilesArray = string[];
export type Files = FilesObject | FilesArray;

export interface MvmPackageContent {
  name?: string
  version?: string
  stability?: Stabilities
  minecraftVersion?: string
  modLoader?: ModLoaders
  modLoaderVersion?: string
  modProvider?: ModProviders
  mods?: ModList
  clientMods?: ModList
  serverMods?: ModList
  files?: Files
}

export class MvmPackage implements Required<MvmPackageContent>, ToJson{
  name: string;
  version: string
  stability: Stabilities
  minecraftVersion: string
  modLoader: ModLoaders
  modLoaderVersion: string
  modProvider: ModProviders
  mods: ModList
  clientMods: ModList
  serverMods: ModList
  files: Files

  addMod(modName: string, modVersion: string) {
    this.mods[modName] = modVersion;
  }

  addClientMod(modName: string, modVersion: string) {
    this.clientMods[modName] = modVersion;
  }

  addServerMod(modName: string, modVersion: string) {
    this.serverMods[modName] = modVersion;
  }

  addFile(from: string, to: string) {
    this.files[from] = to;
  }

  constructor(packageContent: MvmPackageContent = {}) {
    this.fromContent(packageContent);
  }

  private fromContent(packageContent: MvmPackageContent = {}) {
    this.name = packageContent.name
    this.stability = packageContent.stability as Stabilities
    this.version = packageContent.version;
    this.minecraftVersion = packageContent.minecraftVersion
    this.modLoader = packageContent.modLoader as ModLoaders
    this.modLoaderVersion = packageContent.modLoaderVersion
    this.mods = packageContent.mods
    this.clientMods = packageContent.clientMods
    this.serverMods = packageContent.serverMods
    this.modProvider = packageContent.modProvider as ModProviders
    this.files = packageContent.files
  }

  public toJson(): MvmPackageContent {
    return {
      name: this.name,
      stability: this.stability,
      version: this.version,
      minecraftVersion: this.minecraftVersion,
      modLoader: this.modLoader,
      modLoaderVersion: this.modLoaderVersion,
      mods: this.mods,
      serverMods: this.serverMods,
      clientMods: this.clientMods,
      modProvider: this.modProvider,
      files: this.files,
    }
  }

  clone() {
    return new MvmPackage(this.toJson());
  }
}
