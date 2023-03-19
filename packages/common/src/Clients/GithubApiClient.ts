import { AbstractClient } from "./AbstractClient";
import { Octokit } from "octokit";
import { Constants } from "@mvm/common";
export class GithubApiClient extends AbstractClient<Octokit> {
  setupClient(): Octokit {
    return new Octokit({
      auth: this.getEnvironmentVariable('MVM_GITHUB_TOKEN')
    });
  }

  async getLatestRelease(owner: string, repo: string) {
    const { data } = await this.client.request('GET /repos/{owner}/{repo}/releases/latest', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': Constants.GITHUB_API_VERSION
      }
    });

    return data;
  }

  async getSpecificRelease(owner: string, repo: string, tag: string) {
    const { data } = await this.client.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
      owner: owner,
      repo: repo,
      tag: tag,
      headers: {
        'X-GitHub-Api-Version': Constants.GITHUB_API_VERSION
      }
    });

    return data;
  }

}
