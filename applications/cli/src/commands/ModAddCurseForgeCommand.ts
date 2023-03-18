import { AbstractCommand, AbstractSidedCommandArguments } from "./AbstractCommand";

export interface ModAddCurseForgeCommandArguments extends AbstractSidedCommandArguments {}

export class ModAddCurseForgeCommand extends AbstractCommand<ModAddCurseForgeCommandArguments> {
  handle(argv: ModAddCurseForgeCommandArguments): Promise<void> | void {
    const { _: [ modName, modVersion = 'latest' ] } = argv;
    const { side } = argv;

    console.log({ modName, modVersion, side });

    return undefined;
  }

}
