import { AbstractCommand, AbstractSidedCommandArguments } from "./AbstractCommand";

export interface ModAddModrinthCommandArguments extends AbstractSidedCommandArguments {}

export class ModAddModrinthCommand  extends AbstractCommand<ModAddModrinthCommandArguments> {
  handle(argv: ModAddModrinthCommandArguments): Promise<void> | void {
    const { _: [ modName, modVersion = 'latest' ] } = argv;
    const { side } = argv;

    console.log({modName, modVersion, side});

    return undefined;
  }

}
