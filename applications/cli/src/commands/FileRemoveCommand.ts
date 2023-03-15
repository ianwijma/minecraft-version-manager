import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import process from "process";
import { FileHandler, MvmPackageIO, NotInArrayError } from "@mvm/common";

export interface FileRemoveCommandArguments extends AbstractCommandArguments {}

export class FileRemoveCommand extends AbstractCommand<FileRemoveCommandArguments> {
  async handle(argv: FileRemoveCommandArguments) {
    const { _: [ from ] } = argv;
    const fromPath = FileHandler.normalizePath(from);

    const mvmPackageIO = await MvmPackageIO.CreateFromDir(process.cwd());
    const { files } = mvmPackageIO.mvmPackage;

    NotInArrayError.validate(Object.keys(files), fromPath);

    delete files[fromPath];
    await mvmPackageIO.updatePackage({
      files: files,
    });

    console.log(`File "${fromPath}" was removed.`);
  }

  getDescription(): string {
    return 'Adds a file to copy over, either define a file to copy over or define from-to path';
  }

  getArguments(): string {
    return '<file/from> ?<to>';
  }
}
