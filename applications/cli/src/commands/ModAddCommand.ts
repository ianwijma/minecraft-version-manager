import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { InArrayError, ModProviders, MvmPackageIO, Sides } from "@mvm/common";
import process from "process";

export interface AddModCommandArguments extends AbstractCommandArguments {
  version: string,
  provider?: ModProviders,
  side: Sides
}

export class ModAddCommand extends AbstractCommand<AddModCommandArguments> {
  async handle(argv: AddModCommandArguments) {
    const { _: [ modName ] } = argv;
    const { modProvider: defaultProvider = null, } = this.mvmPackage
    const { allModNames = [] } = this.mvmPackage
    const { version = 'latest', provider = null, side = 'both' } = argv;

    InArrayError.validate(allModNames, modName);

    const mvmPackageIO = await MvmPackageIO.CreateFromDir(process.cwd());
    const { mvmPackage } = mvmPackageIO

    if (side === 'both') {
      await mvmPackageIO.updateWithLockfile({
        mods: {
          [modName]: {
            version: version,
            provider: provider ?? defaultProvider
          },
          ...mvmPackage.mods
        }
      });
    } else if (side === 'client') {
      await mvmPackageIO.updateWithLockfile({
        clientMods: {
          [modName]: {
            version: version,
            provider: provider ?? defaultProvider
          },
          ...mvmPackage.clientMods
        }
      });
    } else if (side === 'server') {
      await mvmPackageIO.updateWithLockfile({
        serverMods: {
          [modName]: {
            version: version,
            provider: provider ?? defaultProvider
          },
          ...mvmPackage.serverMods
        }
      });
    }
  }

  getDescription(): string {
    return 'Adds a mod'
  }

  getArguments(): string {
    return '<mod-name> [--version=string] [--provider=direct|github|github-build|curse-forge|modrinth] [--side=both|client|server]';
  }
}
