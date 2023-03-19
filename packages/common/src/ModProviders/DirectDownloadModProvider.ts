import { AbstractModProvider, DownloadResult, ResolvedDependencies } from "./AbstractModProvider";
import { DirectDownloadModDetail, FileHandler, ModName } from "@mvm/common";

export class DirectDownloadModProvider extends AbstractModProvider<DirectDownloadModDetail> {
  async downloadOne(modName: ModName, modDetail: DirectDownloadModDetail): Promise<DownloadResult> {
    return {
      downloadFilePath: await FileHandler.downloadFile(modDetail.downloadUrl),
    };
  }

  async resolveDependencies(modName: ModName, modDetail: DirectDownloadModDetail): Promise<ResolvedDependencies> {
    return {
      dependencies: {},
      optionalDependencies: {}
    };
  }

}
