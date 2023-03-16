import { AbstractDownloader } from "./AbstractDownloader";
import * as process from "process";
import { Constants, EnvironmentVariableMissingError } from "@mvm/common";
import { Octokit } from "octokit";

export class GithubDownloader extends AbstractDownloader {
  owner: string
  repo: string
  tag: string

  constructor(owner: string, repo: string, tag: string) {
    super();
    this.owner = owner;
    this.repo = repo;
    this.tag = tag;
  }

  async download(): Promise<string> {
    EnvironmentVariableMissingError.validate('MVM_GITHUB_TOKEN');
    const downloadUrl = await this.getGithubReleaseDownloadUrl();

    const tmpDir = await this.getTmpDir();
    return await this.downloadFile(downloadUrl, tmpDir);
  }

  async getGithubReleaseDownloadUrl(): Promise<string> {
    const octokit = new Octokit({
      auth: process.env['MVM_GITHUB_TOKEN']
    });

    let response;
    if (this.tag === 'latest') {
      response = await octokit.request(`GET /repos/${this.owner}/${this.repo}/releases/latest`, {
        owner: this.owner,
        repo: this.repo,
        headers: {
          'X-GitHub-Api-Version': Constants.GITHUB_API_VERSION
        }
      });
    } else {
      response = await octokit.request(`GET /repos/${this.owner}/${this.repo}/releases/tags/${this.tag}`, {
        owner: this.owner,
        repo: this.repo,
        tag: this.tag,
        headers: {
          'X-GitHub-Api-Version': Constants.GITHUB_API_VERSION
        }
      });
    }

    if (response?.data?.assets) {
      const { assets } = response.data;
      for (const asset of assets) {
        // This does not work if there are multiple files, but we will see when this time comes :D
        if (asset?.name?.endsWith('.jar') && asset?.browser_download_url) {
          return asset?.browser_download_url;
        }
      }
    }

    throw new Error(`Unable to find the download url for the release ${this.tag} for ${this.owner}/${this.repo}`);
  }
}
