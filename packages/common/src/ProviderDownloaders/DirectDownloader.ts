import { AbstractDownloader } from "./AbstractDownloader";

export class DirectDownloader extends AbstractDownloader {
  downloadUrl: string;

  constructor(downloadUrl: string) {
    super();
    this.downloadUrl = downloadUrl;
  }

  async download(): Promise<string> {
    const tmpDir = await this.getTmpDir();
    return await this.downloadFile(this.downloadUrl, tmpDir);
  }
}
