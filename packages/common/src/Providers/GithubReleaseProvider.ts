import { AbstractProvider } from "./AbstractProvider";
import { GithubReleaseModDetail, ModName } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { GithubDownloader } from "../ProviderDownloaders/GithubDownloader";

export class GithubReleaseProvider extends AbstractProvider<GithubReleaseModDetail> {
  getDownloader(modName: ModName, modDetail: GithubReleaseModDetail): AbstractDownloader {
    const { version } = modDetail; // version format (tag optional) -> <owner>/<repo>[#<tag>]
    const [ownerRepo, tag = 'latest'] = version.split('#');
    const [owner, repo] = ownerRepo.split('/');

    return new GithubDownloader(owner, repo, tag);
  }
}
