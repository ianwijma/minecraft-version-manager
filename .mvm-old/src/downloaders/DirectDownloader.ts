import AbstractDownloader from './AbstractDownloader'
import ModDownload from '../Utilities/ModDownload'

export default class DirectDownloader extends AbstractDownloader {
  protected async downloadMod(modDownload: ModDownload, dirPath: string): Promise<boolean|string> {
    return this.downloadFile(modDownload.version, dirPath);
  }

  async validate(): Promise<(string | null)[]> {
    const errors = [];

    for (const modDownload of this.queue) {
      try {
        new URL(modDownload.version);
      } catch (err) {
        errors.push(`${modDownload.name} is not a valid URL: ${modDownload.version}`);
      }
    }

    return errors;
  }

}
