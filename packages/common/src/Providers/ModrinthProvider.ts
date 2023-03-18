import { AbstractProvider } from "./AbstractProvider";
import { ModrinthDownloader } from "../ProviderDownloaders/ModrinthDownloader";
import { ModName, ModrinthModDetail } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";

export class ModrinthProvider extends AbstractProvider<ModrinthModDetail> {
  getDownloader(modName: ModName, modDetail: ModrinthModDetail): AbstractDownloader {
    const { version } = modDetail;
    return new ModrinthDownloader(modName, version);
  }
}
