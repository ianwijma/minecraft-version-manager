import { AbstractProvider } from "./AbstractProvider";
import { CurseForgeDownloader } from "../ProviderDownloaders/CurseForgeDownloader";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { CurseForgeModDetail, ModName } from "../Utils/MvmPackage";

export class CurseForgeProvider extends AbstractProvider<CurseForgeModDetail> {
  getDownloader(modName: ModName, modDetail: CurseForgeModDetail): AbstractDownloader {
    return new CurseForgeDownloader();
  }
}
