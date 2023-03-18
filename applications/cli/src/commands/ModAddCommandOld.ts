import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { InArrayError, ModProviders, Sides } from "@mvm/common";

export interface AddModCommandArguments extends AbstractCommandArguments {
  version: string,
  provider?: ModProviders,
  side: Sides
}

export class ModAddCommandOld extends AbstractCommand<AddModCommandArguments> {
  async handle(argv: AddModCommandArguments) {
    const { _: [ modName ] } = argv;
    const { modProvider: defaultProvider = null, } = this.mvmPackageHandler.mvmPackage
    const { mods } = this.mvmPackageHandler.mvmPackage
    const { version = 'latest', provider = null, side = 'both' } = argv;

    InArrayError.validate(Object.keys(mods), modName);

    const { mvmPackage } = this.mvmPackageHandler;
    console.log(mvmPackage);

    // Move to separate class.
  //   if (side === 'both') {
  //     await mvmPackageIO.updateWithLockfile({
  //       mods: {
  //         [modName]: {
  //           version: version,
  //           provider: provider ?? defaultProvider
  //         },
  //         ...mvmPackage.mods
  //       }
  //     });
  //   } else if (side === 'client') {
  //     await mvmPackageIO.updateWithLockfile({
  //       clientMods: {
  //         [modName]: {
  //           version: version,
  //           provider: provider ?? defaultProvider
  //         },
  //         ...mvmPackage.clientMods
  //       }
  //     });
  //   } else if (side === 'server') {
  //     await mvmPackageIO.updateWithLockfile({
  //       serverMods: {
  //         [modName]: {
  //           version: version,
  //           provider: provider ?? defaultProvider
  //         },
  //         ...mvmPackage.serverMods
  //       }
  //     });
  //   }
  }

  getDescription(): string {
    return 'Adds a mod'
  }

  getArguments(): string {
    return '<mod-name> [--version=string] [--provider=direct|github|github-build|curse-forge|modrinth] [--side=both|client|server]';
  }
}
