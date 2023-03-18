import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { Constants, DirNotFoundError, FileFoundError, MvmPackageHandler } from "@mvm/common";
import * as process from "process";
import * as fs from "fs-extra";
import * as path from "path";

export interface InitCommandArguments extends AbstractCommandArguments {}

export class InitCommand extends AbstractCommand<InitCommandArguments> {

  async initialize(): Promise<void> {
    // handle will do the initializing!~
  }

  async handle(argv: InitCommandArguments) {
    const { _: [ target = process.cwd() ] } = argv;

    const targetDir = path.resolve(target);

    await fs.ensureDir(targetDir);

    await DirNotFoundError.validate(targetDir);
    await FileFoundError.validate(path.join(targetDir, Constants.PACKAGE_FILE_NAME));

    const mvmPackageIO = MvmPackageHandler.CreateNew(targetDir);
    await mvmPackageIO.initialize();

    console.log(`${targetDir} created`);
  }

  getDescription(): string {
    return `Initializes ${Constants.COMMAND}, [target] defaults to current directory`;
  }

  getArguments(): string {
    return '<target>';
  }
}
