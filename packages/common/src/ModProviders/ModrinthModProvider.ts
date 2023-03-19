import { AbstractModProvider, DownloadResult, ResolvedDependencies } from "./AbstractModProvider";
import {
  FileHandler,
  ModDetailMap,
  ModName,
  ModProviders,
  ModrinthModDetail,
  MvmPackageHandler, Sides,
  Stabilities
} from "@mvm/common";
import { ModrinthApiClient, ProjectVersion } from "../Clients/ModrinthApiClient";
import * as process from "process";

export class ModrinthModProvider extends AbstractModProvider<ModrinthModDetail> {
  async downloadOne(modName: ModName, modDetail: ModrinthModDetail): Promise<DownloadResult> {
    const downloadUrl = await this.getDownloadUrl(modName, modDetail);
    return {
      downloadFilePath: await FileHandler.downloadFile(downloadUrl)
    };
  }

  async getProjectVersion(modName: ModName, modDetail: ModrinthModDetail): Promise<ProjectVersion> {
    const modrinthModProvider = new ModrinthApiClient();
    const versions = await modrinthModProvider.getProjectVersions(modName);
    const { mvmPackage } = await MvmPackageHandler.CreateFromProjectDir(process.cwd());
    const { modLoader, minecraftVersion, stability } = mvmPackage;
    const { version: modVersion } = modDetail;

    const [ projectVersion = null ] = versions.filter(({ version_number, game_versions, loaders, version_type }) => {
      const [ gameVersion ] = game_versions;
      const [ loader ] = loaders;
      return version_number === modVersion
        && modLoader === loader
        && minecraftVersion === gameVersion
        && this.versionMatch(stability, version_type);
    });

    if (projectVersion) {
      return projectVersion;
    }

    throw new Error(`Unable to find Modrinth project ${modName} for version ${modVersion}: ${JSON.stringify({ modLoader, minecraftVersion, stability })}}`);
  }

  async getDownloadUrl(modName: ModName, modDetail: ModrinthModDetail): Promise<string> {
    const { files } = await this.getProjectVersion(modName, modDetail);
    const [ firstFile ] = files;
    const [ primaryFile ] = files.filter(({primary}) => primary);

    if (primaryFile) {
      return primaryFile?.url;
    } else if (firstFile) {
      return firstFile?.url;
    }
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

  async resolveDependencies(modName: ModName, modDetail: ModrinthModDetail): Promise<ResolvedDependencies> {
    const { dependencies: projectDependencies } = await this.getProjectVersion(modName, modDetail);

    const dependencies: ModDetailMap<ModrinthModDetail> = {};
    const optionalDependencies: ModDetailMap<ModrinthModDetail> = {};

    projectDependencies.map((dependency) => {
      // TODO: resolve version_id and project_id, ex: https://api.modrinth.com/v2/project/botania/version
      const { version_id, project_id, dependency_type } = dependency;


      const dependencyModName = '';
      const dependencyModDetail: ModrinthModDetail = {
        provider: ModProviders.MODRINTH,
        version: '',
        side: Sides.BOTH,
        hash: '',
      };


      if (dependency_type === 'required') {
        dependencies[dependencyModName] = dependencyModDetail;
      } else {
        optionalDependencies[dependencyModName] = dependencyModDetail;
      }
    })

    return { dependencies, optionalDependencies };
  }

}
