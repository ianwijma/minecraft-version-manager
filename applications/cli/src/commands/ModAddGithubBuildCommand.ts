import { AbstractCommand, AbstractSidedCommandArguments } from "./AbstractCommand";

export interface ModAddGithubBuildCommandArguments extends AbstractSidedCommandArguments {}

export class ModAddGithubBuildCommand extends AbstractCommand<ModAddGithubBuildCommandArguments> {
  handle(argv: ModAddGithubBuildCommandArguments): Promise<void> | void {
    return undefined;
  }

}
