import { ToJson } from "./FileHandler";

export type SideBoth = 'both';
export type SideClient = 'client';
export type SideServer = 'server';
export type Sides = SideBoth | SideClient | SideServer;

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

export type ModListName = string;
export type ModListVersion = string;
export interface ModListItem {
  version: ModListVersion,
  provider: ModProviders
}

export type ModListValue = ModListItem;

export interface ModList {
  [key: ModListName]: ModListValue
}

export interface Files {
  [key: string]: string
}

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

export class MvmPackage implements Required<MvmPackageContent>, ToJson<Required<MvmPackageContent>>{
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

  get allModNames(): string[] {
    return [
      ...Object.keys(this.mods),
      ...Object.keys(this.clientMods),
      ...Object.keys(this.serverMods),
    ]
  }

  get allMods(): ModList {
    return {
      ...this.mods,
      ...this.clientMods,
      ...this.serverMods,
    }
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

  public toJson() {
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
