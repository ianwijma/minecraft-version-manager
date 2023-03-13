import * as fs from "fs-extra";

export class AbstractFsError extends Error {
  protected static async throwOnFound(path: string) {
    if (await fs.exists(path)) {
      throw new this(path)
    }
  }
  protected static async throwOnNotFound(path: string) {
    if (!await fs.exists(path)) {
      throw new this(path)
    }
  }
}
