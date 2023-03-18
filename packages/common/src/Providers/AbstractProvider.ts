import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { BaseModDetail, ModDetailMap, ModDetails, ModName } from "@mvm/common";

export interface ModListDownloads {
  [key: ModName]: string
}

export abstract class AbstractProvider<T extends BaseModDetail = ModDetails> {
  abstract getDownloader(modName: ModName, modDetail: T): AbstractDownloader;

  async downloadOne(modName: ModName, modDetail: T): Promise<string> {
    const downloader = this.getDownloader(modName, modDetail);
    return await downloader.download();
  }

  async downloadMultiple(mods: ModDetailMap<T>): Promise<ModListDownloads> {
    const downloadList: ModListDownloads = {};

    for (const modName in mods) {
      const mod = mods[modName];
      downloadList[modName] = await this.downloadOne(modName, mod);
    }

    return downloadList;
  }


}
