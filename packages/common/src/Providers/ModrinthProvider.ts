import { AbstractProvider } from "./AbstractProvider";
import { ModrinthDownloader } from "../ProviderDownloaders/ModrinthDownloader";
import { ModListName, ModListValue } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";

export class ModrinthProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modValue: ModListValue): AbstractDownloader {
    return new ModrinthDownloader();
  }
}
