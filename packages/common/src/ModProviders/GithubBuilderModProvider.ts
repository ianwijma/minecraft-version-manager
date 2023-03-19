import { AbstractModProvider, DownloadResult, ResolvedDependencies } from "./AbstractModProvider";
import { FileHandler, GithubBuildModDetail, ModName } from "@mvm/common";
import { exec as execSync } from 'child_process';
import { promisify } from "util";
import { join } from "path";
import * as fs from "fs-extra";
const exec = promisify(execSync);

export class GithubBuilderModProvider extends AbstractModProvider<GithubBuildModDetail> {
  async downloadOne(modName: ModName, modDetail: GithubBuildModDetail): Promise<DownloadResult> {
    const tmpDir = await FileHandler.getTmpDir();

    await this.cloneRepo(tmpDir, modDetail);
    await this.buildRepo(tmpDir, modDetail);
    return {
      downloadFilePath: await this.getArtifactPath(tmpDir, modDetail)
    };
  }

  async cloneRepo(tmpDir: string, modDetail: GithubBuildModDetail): Promise<void> {
    const { owner, repo } = modDetail;
    await exec(`git clone https://github.com/${owner}/${repo}.git ${tmpDir}`);
  }

  async buildRepo(tmpDir: string, modDetail: GithubBuildModDetail): Promise<void> {
    const { command } = modDetail;
    await exec(`cd '${tmpDir}' && ${command}`);
  }

  async getArtifactPath(tmpDir: string, modDetail: GithubBuildModDetail): Promise<string> {
    const { buildDir = 'build/libs' } = modDetail;
    const buildDirPath = join(tmpDir, buildDir);
    const [ fileName ] = await fs.readdir(buildDirPath)
    return join(buildDirPath, fileName);
  }

  resolveDependencies(modName: ModName, modDetail: GithubBuildModDetail): Promise<ResolvedDependencies> {
    return Promise.resolve({
      dependencies: {},
      optionalDependencies: {}
    });
  }

}
