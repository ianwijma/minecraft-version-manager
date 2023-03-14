import { AbstractProvider } from "./AbstractProvider";
import { ModListName, ModListVersion } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { GithubDownloader } from "../ProviderDownloaders/GithubDownloader";

export class GithubProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modVersion: ModListVersion): AbstractDownloader {
    return new GithubDownloader();
  }
}
