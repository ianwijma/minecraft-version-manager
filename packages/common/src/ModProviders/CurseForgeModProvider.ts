import { AbstractModProvider, DownloadResult, ResolvedDependencies } from "./AbstractModProvider";
import { CurseForgeModDetail, ModName } from "@mvm/common";

export class CurseForgeModProvider extends AbstractModProvider<CurseForgeModDetail> {
  downloadOne(modName: ModName, modDetail: CurseForgeModDetail): Promise<DownloadResult> {
    return Promise.resolve({
      downloadFilePath: ''
    });
  }

  resolveDependencies(modName: ModName, modDetail: CurseForgeModDetail): Promise<ResolvedDependencies> {
    return Promise.resolve({
      dependencies: {},
      optionalDependencies: {}
    });
  }

}
