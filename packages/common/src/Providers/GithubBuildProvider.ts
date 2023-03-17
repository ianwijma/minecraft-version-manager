import { AbstractProvider } from "./AbstractProvider";
import { ModListName, ModListValue } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { GithubBuilderDownloader } from "../ProviderDownloaders/GithubBuilderDownloader";

export class GithubBuildProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modValue: ModListValue): AbstractDownloader {
    const { version } = modValue; // version format -> <owner>/<repo>:fileName~"command"
    const [ownerRepoBuildDir, command = './gradlew build'] = version.split('~');
    const [ownerRepo, buildDir] = ownerRepoBuildDir.split(':');
    const [owner, repo] = ownerRepo.split('/');

    return new GithubBuilderDownloader(owner, repo, command, buildDir);
  }
}
