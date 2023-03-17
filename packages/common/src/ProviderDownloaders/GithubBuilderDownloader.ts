import { AbstractDownloader } from "./AbstractDownloader";
import { promisify } from "util";
import { exec as execSync } from 'child_process';
import * as path from "path";
import * as fs from "fs-extra";
const exec = promisify(execSync);

export class GithubBuilderDownloader extends AbstractDownloader {
  owner: string
  repo: string
  command: string
  buildDir: string

  constructor(owner: string, repo: string, command: string, buildDir: string) {
    super();
    this.owner = owner;
    this.repo = repo;
    this.command = command;
    this.buildDir = buildDir;
  }

  async download(): Promise<string> {
    const tmpDir = await this.getTmpDir();
    const downloadDir = await this.cloneRepo(tmpDir);
    return await this.buildRepo(downloadDir);
  }

  private async cloneRepo(tmpDir: string) : Promise<string> {
    await exec(`git clone 'https://github.com/${this.owner}/${this.repo}.git' ${tmpDir}`);
    return tmpDir;
  }

  private async buildRepo(tmpDir: string) : Promise<string> {
    await exec(`cd '${tmpDir}' && ${this.command}`);
    const buildDirPath = path.join(tmpDir, this.buildDir);
    const [ fileName ] = await fs.readdir(buildDirPath)
    return path.join(buildDirPath, fileName);
  }
}
