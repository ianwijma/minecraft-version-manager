import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { Constants, DirNotFoundError, FileFoundError, MvmPackageIO } from "@mvm/common";
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

    await DirNotFoundError.validate(targetDir);
    await FileFoundError.validate(targetPath);

    const mvmPackageIO = MvmPackageIO.CreateNew(targetPath);
    await mvmPackageIO.write();

    console.log(`${targetPath} created`);
  }

  getDescription(): string {
    return `Initializes ${Constants.COMMAND}, [target] defaults to current directory`;
  }

  getArguments(): string {
    return '[target]';
  }
}
