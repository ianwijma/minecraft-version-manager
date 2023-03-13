import * as fs from "fs-extra";

export interface ToJson {
  toJson: Function
}

export class FileHandler {
  static fromJson<T extends object>(path): Promise<T> {
    return fs.readJSON(path);
  }

  static async toJson(path, data: ToJson): Promise<void> {
    const content = data.toJson();
    await fs.writeJSON(path, content, { spaces: 4 });
  }
}
