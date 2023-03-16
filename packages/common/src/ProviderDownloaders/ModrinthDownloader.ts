import { AbstractDownloader } from "./AbstractDownloader";
import { ModListName, ModListVersion, MvmPackageIO, Stabilities } from "@mvm/common";
import axios, { AxiosInstance } from "axios";
import * as process from "process";

export class ModrinthDownloader extends AbstractDownloader {
  modName: ModListName
  version: ModListVersion

  constructor(modName: ModListName, version: ModListVersion) {
    super();
    this.modName = modName;
    this.version = version;
  }

  async download(): Promise<string> {
    const downloadUrl = await this.getModrinthDownloadUrl();
    const tmpDir = await this.getTmpDir();
    return await this.downloadFile(downloadUrl, tmpDir);
  }

  async getModrinthDownloadUrl(): Promise<string> {
    const { data: versions } = await this.getWrapper().get(`project/${this.modName}/version`);
    const { modLoader, minecraftVersion, stability } = await MvmPackageIO.MvmPackageFromDir(process.cwd());

    const [ version ] = versions.filter(({ version_number, game_versions, loaders, version_type }) => {
      const [ gameVersion ] = game_versions;
      const [ loader ] = loaders;
      return version_number === this.version
        && modLoader === loader
        && minecraftVersion === gameVersion
        && this.versionMatch(stability, version_type);
    });

    if (version) {
      const { files } = version;
      const [ firstFile ] = files;
      const [ primaryFile ] = files.filter(({primary}) => primary);

      if (primaryFile) {
        return primaryFile?.url;
      } else if (firstFile) {
        return firstFile?.url;
      }
    }

    throw new Error(`Unable to find Modrinth project ${this.modName} for version ${this.version}: ${JSON.stringify({ modLoader, minecraftVersion, stability })}}`);

  }

  private versionMatch(targetStability: Stabilities, stability) {
    let allowedStability;
    switch (targetStability) {
      case "release":
        allowedStability = ['release'];
        break;
      case "beta":
        allowedStability = ['release', 'beta'];
        break;
      case "alpha":
        allowedStability = ['release', 'beta', 'alpha'];
        break;
    }

    return allowedStability.includes(stability);
  }

  private getWrapper(): AxiosInstance {
    return axios.create({
      baseURL: 'https://api.modrinth.com/v2'
    })
  }
}
