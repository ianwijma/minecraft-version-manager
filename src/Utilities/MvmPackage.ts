import { VanillaModLoaderNamespace } from '../modLoaders/VanillaModLoader'
import { ForgeModLoaderNamespace } from '../modLoaders/ForgeModLoader'
import { FabricModLoaderNamespace } from '../modLoaders/FabricModLoader'
import { QuiltModLoaderNamespace } from '../modLoaders/QuiltModLoader'
import ModDownload from './ModDownload'
import { DirectDownloadModProviderNamespace } from '../modProviders/DirectDownloadModProvider'
import { CurseForgeModProviderNamespace } from '../modProviders/CurseForgeModProvider'
import { ModrinthModProviderNamespace } from '../modProviders/ModrinthModProvider'

export type ModLoaderNamespaces = VanillaModLoaderNamespace | ForgeModLoaderNamespace | FabricModLoaderNamespace | QuiltModLoaderNamespace;
export type ModProviderNamespaces = DirectDownloadModProviderNamespace | CurseForgeModProviderNamespace | ModrinthModProviderNamespace;

export type ModName = string

export type ModsList = {
  [key: ModName]: ModDownload
}

export type ModsContentList = {
  [key: string]: string
}

export interface MvmPackageFileContent {
  name?: string
  version?: string,
  minecraftVersion?: string
  modLoader?: string
  modLoaderVersion?: string
  mods?: ModsContentList
  modProvider?: string;
  files?: string | string[]
}

export default class MvmPackage {
  private _name: string;
  private _version: string;
  private _minecraftVersion: string;
  private _modLoader: ModLoaderNamespaces;
  private _modLoaderVersion: string;
  private _mods: ModsList;
  private _modProvider: ModProviderNamespaces;
  private _files: string[];

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get version(): string {
    return this._version
  }

  set version(value: string) {
    this._version = value
  }

  get minecraftVersion(): string {
    return this._minecraftVersion
  }

  set minecraftVersion(value: string) {
    this._minecraftVersion = value
  }

  get modLoader(): ModLoaderNamespaces {
    return this._modLoader
  }

  set modLoader(value: ModLoaderNamespaces) {
    this._modLoader = value
  }

  get modLoaderVersion(): string {
    return this._modLoaderVersion
  }

  set modLoaderVersion(value: string) {
    this._modLoaderVersion = value
  }

  get mods(): ModsList {
    return this._mods
  }

  set mods(value: ModsList) {
    this._mods = value
  }

  addMod(name: ModName, version: string | ModDownload) {
    if (typeof version === 'string') version = new ModDownload(name, version);

    this._mods[name] = version;
  }

  get modProvider(): ModProviderNamespaces {
    return this._modProvider
  }

  set modProvider(value: ModProviderNamespaces) {
    this._modProvider = value
  }

  get files(): string[] {
    return this._files
  }

  set files(value: string | string[]) {
    if (typeof value === 'string') value = [value];

    this._files = value
  }

  constructor(packageFileContent: MvmPackageFileContent = {}) {
    this.fromContent(packageFileContent);
  }

  public fromContent(packageFileContent: MvmPackageFileContent): void {
    this.name = packageFileContent.name
    this.version = packageFileContent.version;
    this.minecraftVersion = packageFileContent.minecraftVersion
    this.modLoader = packageFileContent.modLoader as ModLoaderNamespaces
    this.modLoaderVersion = packageFileContent.modLoaderVersion
    this.mods = this.modsFromContent(packageFileContent.mods)
    this.modProvider = packageFileContent.modProvider as ModProviderNamespaces
    this.files = packageFileContent.files
  }

  public toContent(): MvmPackageFileContent {
    return {
      name: this.name,
      version: this.version,
      minecraftVersion: this.minecraftVersion,
      modLoader: this.modLoader,
      modLoaderVersion: this.modLoaderVersion,
      mods: this.modsToContent(this.mods),
      modProvider: this.modProvider,
      files: this.files,
    }
  }

  private modsFromContent(mods: ModsContentList): ModsList {
    const packageMods: ModsList = {};

    for (const key in mods) {
      packageMods[key] = new ModDownload(key, mods[key]);
    }

    return packageMods;
  }

  private modsToContent(mods: ModsList): { [key: string]: string } {
    const packageMods: ModsContentList = {};

    for (const key in mods) {
      packageMods[key] = mods[key].version;
    }

    return packageMods;
  }

  public validate(): string[] {
    const errors: string[] = [];
    const pe = (message: string): void => { errors.push(message) };

    if (!this.name) pe('Package name is required.');
    if (!this.version) pe('Package version is required.');
    if (!this.minecraftVersion) pe('Package minecraftVersion is required.');
    if (this.modLoader !== 'vanilla' && !this.modLoaderVersion) pe('Packages required a modLoaderVersion if modLoader is not vanilla');
    if (Object.keys(this.mods).length > 0 && !this.modProvider) pe('Packages required a modProvider if there are mods declared');

    return errors;
  }
}
