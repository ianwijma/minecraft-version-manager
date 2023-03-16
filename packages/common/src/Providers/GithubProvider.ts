import { AbstractProvider } from "./AbstractProvider";
import { ModListName, ModListValue } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { GithubDownloader } from "../ProviderDownloaders/GithubDownloader";

export class GithubProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modValue: ModListValue): AbstractDownloader {
    const { version } = modValue; // version format (tag optional) -> <owner>/<repo>[#<tag>]
    const [ownerRepo, tag = 'latest'] = version.split('#');
    const [owner, repo] = ownerRepo.split('/');

    return new GithubDownloader(owner, repo, tag);
  }
}
