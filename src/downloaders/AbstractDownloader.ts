import axios, { AxiosInstance, Method } from 'axios';
import { createWriteStream } from 'fs'
import ModDownload from '../Utilities/ModDownload'
import { basename, join } from 'path';

export default abstract class AbstractDownloader {
  wrapper: AxiosInstance;

  queue: ModDownload[] = [];

  constructor(baseUrl = null) {
    this.wrapper = axios.create({
      baseURL: baseUrl,
      timeout: 15000
    });
  }

  async _callWrapper(route: string, method: Method) {
    if (!route.startsWith('/')) route = `/${route}`;

    const response = await this.wrapper({ method, url: route });

    return response.data;
  }

  downloadFile(url: string, dirPath: string): Promise<true|string> {
    return new Promise(async (resolve, reject) => {
      const response = await this.wrapper({
        method: 'get',
        url: url,
        responseType: 'stream'
      });

      const { pathname } = new URL(url);
      const fileName = basename(pathname);
      const writer = createWriteStream(join(dirPath, fileName));

      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(true)
        }
      });

      const { data } = response;
      data.pipe(writer);
    });
  }

  setup() {
    this.queue = [];
  }

  addDownload(modDownload: ModDownload) {
    this.queue.push(modDownload);
  }

  async process(dirPath: string) {
    for (const modDownload of this.queue) {
      this.downloadMod(modDownload, dirPath);
    }
  }

  protected abstract downloadMod(modDownload: ModDownload, dirPath: string): Promise<boolean|string>;
  abstract validate(): Promise<string[]>;
}
