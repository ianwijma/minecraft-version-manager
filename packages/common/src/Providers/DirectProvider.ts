import { AbstractProvider } from "./AbstractProvider";
import { DirectDownloader } from "../ProviderDownloaders/DirectDownloader";
import { ModListName, ModListVersion } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";

export class DirectProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modVersion: ModListVersion): AbstractDownloader {
    return new DirectDownloader(modVersion);
  }

}
