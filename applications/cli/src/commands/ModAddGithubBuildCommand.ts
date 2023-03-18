import { AbstractCommand, AbstractSidedCommandArguments } from "./AbstractCommand";

export interface ModAddGithubBuildCommandArguments extends AbstractSidedCommandArguments {}

export class ModAddGithubBuildCommand extends AbstractCommand<ModAddGithubBuildCommandArguments> {
  handle(argv: ModAddGithubBuildCommandArguments): Promise<void> | void {
    const { _: [ modName, owner, repo, buildCommand ] } = argv;
    const { side } = argv;

    console.log({ modName, owner, repo, buildCommand, side });

    return undefined;
  }

}
