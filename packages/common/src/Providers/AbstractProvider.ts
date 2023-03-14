import { AbstractDownloader } from "../ProviderDownloaders/AbstractDownloader";
import { ModList, ModListName, ModListValue, ModListVersion } from "@mvm/common";

export interface ModListDownloads {
  [key: ModListName]: string
}

export abstract class AbstractProvider {
  abstract getDownloader(modName: ModListName, modVersion: ModListVersion): AbstractDownloader;

  async downloadOne(modName: ModListName, modVersion: ModListValue): Promise<string> {
    if (typeof modVersion === 'object') {
      modVersion = modVersion.version;
    }

    const downloader = this.getDownloader(modName, modVersion);
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
