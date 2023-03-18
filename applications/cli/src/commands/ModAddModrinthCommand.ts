import { AbstractCommand, AbstractSidedCommandArguments } from "./AbstractCommand";

export interface ModAddModrinthCommandArguments extends AbstractSidedCommandArguments {}

export class ModAddModrinthCommand  extends AbstractCommand<ModAddModrinthCommandArguments> {
  handle(argv: ModAddModrinthCommandArguments): Promise<void> | void {
    return undefined;
  }

}
