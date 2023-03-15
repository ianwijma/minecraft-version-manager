import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { MvmPackageIO, NotInArrayError, Sides } from "@mvm/common";
import process from "process";

export interface ModRemoveCommandArguments extends AbstractCommandArguments {
  side?: Sides
}

export class ModRemoveCommand extends AbstractCommand<ModRemoveCommandArguments> {
  async handle(argv: ModRemoveCommandArguments) {
    const { _: [ modName ] } = argv;
    const { allModNames = [] } = this.mvmPackage;
    const { side = null } = argv;

    NotInArrayError.validate(allModNames, modName);

    const mvmPackageIO = await MvmPackageIO.CreateFromDir(process.cwd());
    const { mvmPackage } = mvmPackageIO

    if (side === 'both') {
      delete mvmPackage.mods[modName];
      await mvmPackageIO.updateWithLockfile({ mods: mvmPackage.mods });
    } else if (side === 'client') {
      delete mvmPackage.clientMods[modName];
      await mvmPackageIO.updateWithLockfile({ clientMods: mvmPackage.clientMods });
    } else if (side === 'server') {
      delete mvmPackage.serverMods[modName];
      await mvmPackageIO.updateWithLockfile({ serverMods: mvmPackage.serverMods });
    } else {
      delete mvmPackage.mods[modName];
      delete mvmPackage.clientMods[modName];
      delete mvmPackage.serverMods[modName];
      await mvmPackageIO.updateWithLockfile({
        mods: mvmPackage.mods,
        clientMods: mvmPackage.clientMods,
        serverMods: mvmPackage.serverMods,
      });
    }
  }

  getDescription(): string {
    return 'Removes a mod'
  }

  getArguments(): string {
    return '<mod-name> [--side=any|both|client|server]';
  }
}
