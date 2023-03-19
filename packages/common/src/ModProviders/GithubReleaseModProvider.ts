import { AbstractModProvider, DownloadResult, ResolvedDependencies } from "./AbstractModProvider";
import { FileHandler, GithubReleaseModDetail, ModName } from "@mvm/common";
import { GithubApiClient } from "../Clients/GithubApiClient";

export class GithubReleaseModProvider extends AbstractModProvider<GithubReleaseModDetail> {
  async downloadOne(modName: ModName, modDetail: GithubReleaseModDetail): Promise<DownloadResult> {
    const { owner, repo, tag = 'latest', file = null } = modDetail;

    const githubApiClient = new GithubApiClient();

    let data;
    if (tag === 'latest') {
      data = await githubApiClient.getLatestRelease(owner, repo);
    } else {
      data = await githubApiClient.getSpecificRelease(owner, repo, tag);
    }

    const downloadUrl = this.getDownloadUrl(data, file);
    if (!downloadUrl) {
      throw new Error(`Unable to find the download url for the release ${tag} for ${owner}/${repo}`);
    }

    return {
      downloadFilePath: await FileHandler.downloadFile(downloadUrl)
    };
  }

  private getDownloadUrl(data: any, file: string = null): string {
    if (data?.assets) {
      for (const asset of data.assets) {
        const assetName = asset?.name;
        const downloadUrl = asset?.browser_download_url;

        if (!asset?.name) break;

        if (file) {
          if (file === assetName && downloadUrl) {
            return downloadUrl;
          }
        } else {
          if (assetName.endsWith('.jar') && downloadUrl) {
            return downloadUrl;
          }
        }


      }
    }
  }

  resolveDependencies(modName: ModName, modDetail: GithubReleaseModDetail): Promise<ResolvedDependencies> {
    return Promise.resolve({
      dependencies: {},
      optionalDependencies: {}
    });
  }

}
