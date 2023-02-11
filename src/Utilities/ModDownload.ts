import { ModName } from './MvmPackage'

export default class ModDownload {
  private readonly _name: ModName;
  private readonly _version: string;
  private readonly _hash: string | null;

  constructor(name: ModName, version: string, hash: string | null = null) {
    this._name = name
    this._version = version
    this._hash = hash
  }

  get name(): ModName {
    return this._name
  }

  get version(): string {
    return this._version
  }

  hasHash(): boolean {
    return !! this._hash;
  }

  get hash(): string | null {
    return this._hash
  }
}
