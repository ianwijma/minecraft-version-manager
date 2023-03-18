import { AbstractProvider } from "./AbstractProvider";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { GithubBuilderDownloader } from "../ProviderDownloaders/GithubBuilderDownloader";
import { GithubBuildModDetail, ModName } from "../Utils/MvmPackage";

export class GithubBuildProvider extends AbstractProvider<GithubBuildModDetail> {
  getDownloader(modName: ModName, modDetail: GithubBuildModDetail): AbstractDownloader {
    const { version } = modDetail; // version format -> <owner>/<repo>:fileName~"command"
    const [ownerRepoBuildDir, command = './gradlew build'] = version.split('~');
    const [ownerRepo, buildDir] = ownerRepoBuildDir.split(':');
    const [owner, repo] = ownerRepo.split('/');

    return new GithubBuilderDownloader(owner, repo, command, buildDir);
  }
}
