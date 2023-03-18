import { AbstractCommand, AbstractSidedCommandArguments } from "./AbstractCommand";

export interface ModAddGithubReleaseCommandArguments extends AbstractSidedCommandArguments {}

export class ModAddGithubReleaseCommand extends AbstractCommand<ModAddGithubReleaseCommandArguments>{
  handle(argv: ModAddGithubReleaseCommandArguments): Promise<void> | void {
    return undefined;
  }

}
