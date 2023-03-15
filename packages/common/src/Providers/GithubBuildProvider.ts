import { AbstractProvider } from "./AbstractProvider";
import { ModListName, ModListValue } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { GithubBuilderDownloader } from "../ProviderDownloaders/GithubBuilderDownloader";

export class GithubBuildProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modValue: ModListValue): AbstractDownloader {
    return new GithubBuilderDownloader();
  }
}
