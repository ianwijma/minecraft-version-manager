import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { Constants, DirNotExistsError, FileExistsError, FileHandler, MvmPackage } from "@mvm/common";
import * as process from "process";
import * as fs from "fs-extra";
import * as path from "path";

export interface InitCommandArguments extends AbstractCommandArguments {}

export class InitCommand extends AbstractCommand<InitCommandArguments> {
  async handle(argv: InitCommandArguments) {
    const { _: [ target = process.cwd() ] } = argv;

    const targetDir = path.resolve(target);
    const targetPath = path.join(targetDir, Constants.PACKAGE_NAME);

    await fs.ensureDir(targetDir);

    if (!await fs.exists(targetDir)) {
      throw new DirNotExistsError(targetDir)
    }

    if (await fs.exists(targetPath)) {
      throw new FileExistsError(targetPath);
    }

    const mvmPackage = new MvmPackage(targetPath, {
      name: path.basename(targetDir),
      version: '0.0.1',
      stability: 'release',
      minecraftVersion: Constants.LATEST_MINECRAFT_VERSION,
      modLoader: 'vanilla',
      modLoaderVersion: Constants.LATEST_MINECRAFT_VERSION,
      modProvider: 'direct',
      mods: {},
      clientMods: {},
      serverMods: {},
      files: [],
    });

    await FileHandler.toJson(targetPath, mvmPackage);

    console.log(`${targetPath} created`);
  }

  getDescription(): string {
    return `Initializes ${Constants.COMMAND}, [target] defaults to current directory`;
  }

  getArguments(): string {
    return '[target]';
  }
}
