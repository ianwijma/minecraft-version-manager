import { VanillaModLoaderNamespace } from '../modLoaders/VanillaModLoader'
import { ForgeModLoaderNamespace } from '../modLoaders/ForgeModLoader'
import { FabricModLoaderNamespace } from '../modLoaders/FabricModLoader'
import { QuiltModLoaderNamespace } from '../modLoaders/QuiltModLoader'
import ModDownload from './ModDownload'
import DirectDownloadModProvider, { DirectDownloadModProviderNamespace } from '../modProviders/DirectDownloadModProvider'
import CurseForgeModProvider, { CurseForgeModProviderNamespace } from '../modProviders/CurseForgeModProvider'
import ModrinthModProvider, { ModrinthModProviderNamespace } from '../modProviders/ModrinthModProvider'
import AbstractDownloader from '../downloaders/AbstractDownloader'
import DirectDownloader from '../downloaders/DirectDownloader'
import CurseForgeDownloader from '../downloaders/CurseForgeDownloader'
import ModrinthDownloader from '../downloaders/ModrinthDownloader'
import { basename, dirname } from 'path'

export type ModLoaderNamespaces = VanillaModLoaderNamespace | ForgeModLoaderNamespace | FabricModLoaderNamespace | QuiltModLoaderNamespace;
export type ModProviderNamespaces = DirectDownloadModProviderNamespace | CurseForgeModProviderNamespace | ModrinthModProviderNamespace;

export type ServerType = 'server';
export type ClientType = 'client';
export type BothType = 'both';
export type Types = ServerType | ClientType | BothType;

export type ReleaseStability = 'release';
export type BetaStability = 'beta';
export type AlphaStability = 'alpha';
export type Stability = ReleaseStability | BetaStability | AlphaStability;

export type ModName = string

export type ModsList = {
  [key: ModName]: ModDownload
}

export type ModsContentList = {
  [key: string]: string
}

export interface MvmPackageFileContent {
  name?: string
  defaultType?: string
  stability?: string
  version?: string,
  minecraftVersion?: string
  modLoader?: string
  modLoaderVersion?: string
  mods?: ModsContentList
  serverMods?: ModsContentList
  clientMods?: ModsContentList
  modProvider?: string;
  files?: string | string[]
}

export default class MvmPackage {
  private __dir: string;
  private __file: string;
  private _name: string;
  private _defaultType: Types;
  private _stability: Stability;
  private _version: string;
  private _minecraftVersion: string;
  private _modLoader: ModLoaderNamespaces;
  private _modLoaderVersion: string;
  private _mods: ModsList;
  private _serverMods: ModsList;
  private _clientMods: ModsList;
  private _modProvider: ModProviderNamespaces;
  private _files: string[];

  get _dir(): string {
    return this.__dir
  }
  get _file(): string {
    return this.__file
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get defaultType(): Types {
    return this._defaultType
  }

  set defaultType(value: Types) {
    this._defaultType = value
  }

  get stability(): Stability {
    return this._stability
  }

  set stability(value: Stability) {
    this._stability = value
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

  addMod(modDownload: ModDownload) {
    this._mods[modDownload.name] = modDownload;
  }

  get serverMods(): ModsList {
    return this._serverMods
  }

  set serverMods(value: ModsList) {
    this._serverMods = value
  }

  addServerMod(modDownload: ModDownload) {
    this._serverMods[modDownload.name] = modDownload;
  }

  get clientMods(): ModsList {
    return this._clientMods
  }

  set clientMods(value: ModsList) {
    this._clientMods = value
  }

  addClientMod(modDownload: ModDownload) {
    this._clientMods[modDownload.name] = modDownload;
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

  constructor(packageFile: string|null = null, packageFileContent: MvmPackageFileContent = {}) {
    this.__dir = packageFile ? dirname(packageFile) : '';
    this.__file = packageFile ? basename(packageFile) : '';
    this.fromContent(packageFileContent);
  }

  public fromContent(packageFileContent: MvmPackageFileContent): void {
    this.name = packageFileContent.name
    this.stability = packageFileContent.stability as Stability
    this.version = packageFileContent.version;
    this.minecraftVersion = packageFileContent.minecraftVersion
    this.modLoader = packageFileContent.modLoader as ModLoaderNamespaces
    this.modLoaderVersion = packageFileContent.modLoaderVersion
    this.mods = this.modsFromContent(packageFileContent.mods)
    this.serverMods = this.modsFromContent(packageFileContent.serverMods)
    this.clientMods = this.modsFromContent(packageFileContent.clientMods)
    this.modProvider = packageFileContent.modProvider as ModProviderNamespaces
    this.files = packageFileContent.files
  }

  public toContent(): MvmPackageFileContent {
    return {
      name: this.name,
      stability: this.stability,
      version: this.version,
      minecraftVersion: this.minecraftVersion,
      modLoader: this.modLoader,
      modLoaderVersion: this.modLoaderVersion,
      mods: this.modsToContent(this.mods),
      serverMods: this.modsToContent(this.serverMods),
      clientMods: this.modsToContent(this.clientMods),
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

  public async validate(): Promise<string[]> {
    const errors: string[] = [];
    const pe = (message: string): void => { errors.push(message) };

    if (!this.name) {
      pe('Package name is required.');
    }
    if (!this.stability) {
      pe('Package stability is required.');
    }
    if (!this.version) {
      pe('Package version is required.');
    }
    if (!this.minecraftVersion) {
      pe('Package minecraftVersion is required.');
    }
    if (this.modLoader !== 'vanilla' && !this.modLoaderVersion) {
      pe('Packages required a modLoaderVersion if modLoader is not vanilla');
    }
    if (Object.keys(this.mods).length > 0 && !this.modProvider) {
      pe('Packages required a modProvider if there are mods declared');
    }
    if (Object.keys(this.serverMods).length > 0 && !this.modProvider) {
      pe('Packages required a modProvider if there are serverMods declared');
    }
    if (Object.keys(this.clientMods).length > 0 && !this.modProvider) {
      pe('Packages required a modProvider if there are clientMods declared');
    }

    const downloader = this.getDownloader();
    for (const error of await downloader.validate()) {
      if (!!error) pe(error);
    }
    return errors;
  }

  public getDownloader(): AbstractDownloader|null {
    let downloader;

    const provider = this.modProvider;
    if (provider instanceof DirectDownloadModProvider) downloader = new DirectDownloader();
    if (provider instanceof CurseForgeModProvider) downloader = new CurseForgeDownloader();
    if (provider instanceof ModrinthModProvider) downloader = new ModrinthDownloader();
    if (!downloader) return null;

    let modDownloads = {};
    if (this.defaultType === 'both') modDownloads = {...this.mods, ...this.serverMods, ...this.clientMods};
    if (this.defaultType === 'server') modDownloads = {...this.mods, ...this.serverMods};
    if (this.defaultType === 'client') modDownloads = {...this.mods, ...this.clientMods};

    for (const index in modDownloads) {
      downloader.addDownload(modDownloads[index]);
    }

    return downloader;
  }
}
