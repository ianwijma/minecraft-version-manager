import { AbstractProvider } from "./AbstractProvider";
import { ModListName, ModListVersion } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { GithubBuilderDownloader } from "../ProviderDownloaders/GithubBuilderDownloader";

export class GithubBuildProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modVersion: ModListVersion): AbstractDownloader {
    return new GithubBuilderDownloader();
  }
}
