import { AbstractProvider } from "./AbstractProvider";
import { ModrinthDownloader } from "../ProviderDownloaders/ModrinthDownloader";
import { ModListName, ModListVersion } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";

export class ModrinthProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modVersion: ModListVersion): AbstractDownloader {
    return new ModrinthDownloader();
  }
}
