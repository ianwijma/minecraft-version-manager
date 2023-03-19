import { AbstractClient } from "./AbstractClient";
import axios, { AxiosInstance } from "axios";
import { Constants, ModName } from "@mvm/common";

export interface Project {

}

export interface ProjectVersionFile {
  hashes: {
    sha1: string
    sha512: string
  }
  url: string
  filename: string
  primary: boolean
  size: number
  file_type: unknown
}

export interface ProjectVersionDependency {
  version_id?: string,
  project_id?: string,
  file_name?: string,
  dependency_type: 'required' | 'optional'

}

export interface ProjectVersion {
  version_number: string
  game_versions: string
  loaders: string
  version_type: string
  files: ProjectVersionFile[],
  dependencies: ProjectVersionDependency[],
}

export class ModrinthApiClient extends AbstractClient<AxiosInstance> {
  setupClient(): AxiosInstance {
    return axios.create({
      baseURL: Constants.MODRINTH_API_BASEURL
    });
  }

  protected async callApi<T>(path: string): Promise<T> {
    const { data } = await this.client.get(path);
    return data;
  }

  getProject(modName: ModName): Promise<Project> {
    return this.callApi<Project>(`project/${modName}`);
  }

  getVersion(modrinthVersion: string): Promise<ProjectVersion> {
    return this.callApi<ProjectVersion>(`version/${modrinthVersion}`);
  }

  getProjectVersions(modName: ModName): Promise<ProjectVersion[]> {
    return this.callApi<ProjectVersion[]>(`project/${modName}/version`);
  }


}
