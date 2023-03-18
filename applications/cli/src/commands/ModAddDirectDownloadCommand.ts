import { AbstractCommand, AbstractSidedCommandArguments } from "./AbstractCommand";

export interface ModAddDirectDownloadCommandArguments extends AbstractSidedCommandArguments {}

export class ModAddDirectDownloadCommand extends AbstractCommand<ModAddDirectDownloadCommandArguments>{
  handle(argv: ModAddDirectDownloadCommandArguments): Promise<void> | void {
    const { _: [ modName, downloadUrl ] } = argv;
    const { side } = argv;

    console.log({ modName, downloadUrl, side });

    return undefined;
  }

}
