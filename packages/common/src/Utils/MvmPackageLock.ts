import {
  Constants,
  ModListName,
  ModListVersion,
  Sides,
  ToJson
} from "@mvm/common";

export interface MvmPackageLockModContent {
  version?: ModListVersion
  integrity?: string
  side?: Sides
  dependencies?: MvmPackageLockModsContent
}

export interface MvmPackageLockModsContent {
  [key: ModListName]: MvmPackageLockModContent
}

export interface MvmPackageLockContent {
  name?: string
  version?: string
  lockFileVersion?: number
  mods?: MvmPackageLockModsContent
}

export class MvmPackageLock implements Required<MvmPackageLockContent>, ToJson<Required<MvmPackageLockContent>> {
  lockFileVersion: number;
  name: string;
  mods: MvmPackageLockModsContent;
  version: string;

  getModHash(modName: ModListName): string|null {
    const mod = this.mods[modName];
    return mod?.integrity
  }

  constructor(packageLockContent: MvmPackageLockContent = {}) {
    this.fromContent(packageLockContent);
  }

  private fromContent(packageContent: MvmPackageLockContent = {}) {
    this.name = packageContent.name
    this.version = packageContent.version;
    this.mods = packageContent.mods
    this.lockFileVersion = Constants.LOCK_VERSION
  }

  toJson() {
    return {
      name: this.name,
      version: this.version,
      lockFileVersion: this.lockFileVersion,
      mods: this.mods
    };
  }

  clone() {
    return new MvmPackageLock(this.toJson());
  }
}
