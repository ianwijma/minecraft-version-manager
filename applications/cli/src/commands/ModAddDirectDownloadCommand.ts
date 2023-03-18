import { AbstractCommand, AbstractSidedCommandArguments } from "./AbstractCommand";

export interface ModAddCurseForgeCommandArguments extends AbstractSidedCommandArguments {}

export class ModAddCurseForgeCommandCommand extends AbstractCommand<ModAddCurseForgeCommandArguments>{
  handle(argv: ModAddCurseForgeCommandArguments): Promise<void> | void {
    return undefined;
  }

}
