import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { ModList, ModListName, ModListValue } from "@mvm/common";

export interface ModListDownloads {
  [key: ModListName]: string
}

export abstract class AbstractProvider {
  abstract getDownloader(modName: ModListName, modValue: ModListValue): AbstractDownloader;

  async downloadOne(modName: ModListName, modValue: ModListValue): Promise<string> {
    const downloader = this.getDownloader(modName, modValue);
    return await downloader.download();
  }

  async downloadMultiple(modList: ModList): Promise<ModListDownloads> {
    const downloadList: ModListDownloads = {};

    await Promise.all(Object.keys(modList).map(async (modName: ModListName) => {
      const modVersion = modList[modName];
      downloadList[modName] = await this.downloadOne(modName, modVersion);
    }))

    return downloadList;
  }


}
