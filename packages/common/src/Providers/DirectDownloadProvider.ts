import { AbstractProvider } from "./AbstractProvider";
import { DirectDownloader } from "../ProviderDownloaders/DirectDownloader";
import { DirectDownloadModDetail, ModName } from "@mvm/common";
import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";

export class DirectDownloadProvider extends AbstractProvider<DirectDownloadModDetail> {
  getDownloader(modName: ModName, modDetail: DirectDownloadModDetail): AbstractDownloader {
    return new DirectDownloader(modDetail.version);
  }

}
