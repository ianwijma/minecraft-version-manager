import { AbstractProvider } from "./AbstractProvider";
import { CurseForgeDownloader } from "../ProviderDownloaders/CurseForgeDownloader";
import { ModListName, ModListVersion } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";

export class CurseForgeProvider extends AbstractProvider {
  getDownloader(modName: ModListName, modVersion: ModListVersion): AbstractDownloader {
    return new CurseForgeDownloader();
  }
}
