import AbstractDownloader from './AbstractDownloader'
import ModDownload from '../Utilities/ModDownload'

export default class ModrinthDownloader extends AbstractDownloader {
  protected async downloadMod(modDownload: ModDownload, dirPath: string): Promise<boolean|string> {
    return new Promise((resolve) => resolve(true)); // TODO: Make work
  }

  async validate(): Promise<(string | null)[]> {
    return Promise.resolve([])
  }
}
