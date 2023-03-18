import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { FileHandler, FileNotFoundError, InArrayError } from "@mvm/common";

export interface FileAddCommandArguments extends AbstractCommandArguments {}

export class FileAddCommand extends AbstractCommand<FileAddCommandArguments> {
  async handle(argv: FileAddCommandArguments) {
    const { _: [ from, to = from ] } = argv;
    const fromPath = FileHandler.normalizePath(from);
    const toPath = FileHandler.normalizePath(to);

    const { files } = this.mvmPackageHandler.mvmPackage;

    InArrayError.validate(Object.keys(files), fromPath);
    await FileNotFoundError.validate(fromPath);
    if (fromPath.startsWith('..')) {
      throw new Error(`From file "${from}" (resolved path "${fromPath}") can not be outside this directory.`);
    }


    files[fromPath] = toPath;
    await this.mvmPackageHandler
      .update({ files })
      .save();

    console.log(`File "${fromPath}" has been added.`);
  }

  getDescription(): string {
    return 'Adds a file to copy over, defining to is optional';
  }

  getArguments(): string {
    return '<from> [<to>]';
  }
}
