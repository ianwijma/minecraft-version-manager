import { AbstractCommand } from "./AbstractCommand";
import {
  ModAddDirectDownloadCommand,
  ModAddDirectDownloadCommandArguments
} from "./ModAddDirectDownloadCommand";
import { ModAddGithubBuildCommand, ModAddGithubBuildCommandArguments } from "./ModAddGithubBuildCommand";
import { ModAddGithubReleaseCommand, ModAddGithubReleaseCommandArguments } from "./ModAddGithubReleaseCommand";
import { ModAddModrinthCommand, ModAddModrinthCommandArguments } from "./ModAddModrinthCommand";
import { ModAddCurseForgeCommand, ModAddCurseForgeCommandArguments } from "./ModAddCurseForgeCommand";
import { ModProviders } from "@mvm/common";

export type ModAddCommandArguments = ModAddCurseForgeCommandArguments | ModAddDirectDownloadCommandArguments | ModAddGithubBuildCommandArguments | ModAddGithubReleaseCommandArguments | ModAddModrinthCommandArguments

export class ModAddCommand extends AbstractCommand<ModAddCommandArguments> {
  async handle(argv: ModAddCommandArguments): Promise<void> {
    const provider = argv._.shift();
    const command = this.getModAddCommand(provider as ModProviders);
    await command.initialize();
    await command.handle(argv);
  }

  getModAddCommand(provider: ModProviders): AbstractCommand {
    switch (provider) {
      case ModProviders.DIRECT_DOWNLOAD:
        return new ModAddDirectDownloadCommand();
      case ModProviders.CURSE_FORGE:
        return new ModAddCurseForgeCommand();
      case ModProviders.GITHUB_BUILD:
        return new ModAddGithubBuildCommand();
      case ModProviders.GITHUB_RELEASE:
        return new ModAddGithubReleaseCommand();
      case ModProviders.MODRINTH:
        return new ModAddModrinthCommand();
    }
  }

}
