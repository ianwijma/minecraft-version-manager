import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { NotInArrayError, Sides } from "@mvm/common";

export interface ModRemoveCommandArguments extends AbstractCommandArguments {
  side?: Sides
}

export class ModRemoveCommand extends AbstractCommand<ModRemoveCommandArguments> {
  async handle(argv: ModRemoveCommandArguments) {
    const { _: [ modName ] } = argv;
    const { mods } = this.mvmPackageHandler.mvmPackage;

    NotInArrayError.validate(Object.keys(mods), modName);

    delete mods[modName];

    await this.mvmPackageHandler
      .update({ mods })
      .save();
  }

  getDescription(): string {
    return 'Removes a mod'
  }

  getArguments(): string {
    return '<mod-name>';
  }
}
