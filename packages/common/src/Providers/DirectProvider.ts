import { AbstractProvider } from "./AbstractProvider";
import { DirectDownloader } from "../ProviderDownloaders/DirectDownloader";
import { ModListName, ModListValue } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";

export class DirectProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modValue: ModListValue): AbstractDownloader {
    return new DirectDownloader(modValue.version);
  }

}
