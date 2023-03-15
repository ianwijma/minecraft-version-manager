import { AbstractProvider } from "./AbstractProvider";
import { ModListName, ModListValue } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { GithubDownloader } from "../ProviderDownloaders/GithubDownloader";

export class GithubProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modValue: ModListValue): AbstractDownloader {
    return new GithubDownloader();
  }
}
