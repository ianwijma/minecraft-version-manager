import { AbstractCommand, AbstractSidedCommandArguments } from "./AbstractCommand";

export interface ModAddGithubReleaseCommandArguments extends AbstractSidedCommandArguments {
  file: string
  tag: string
}

export class ModAddGithubReleaseCommand extends AbstractCommand<ModAddGithubReleaseCommandArguments>{
  handle(argv: ModAddGithubReleaseCommandArguments): Promise<void> | void {
    const { _: [ modName, owner, repo ] } = argv;
    const { side, file, tag } = argv;

    console.log({ modName, owner, repo, side, file, tag });

    return undefined;
  }

}
