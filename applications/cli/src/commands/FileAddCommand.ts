import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import process from "process";
import { MvmPackageIO } from "@mvm/common";

export interface FileAddCommandArguments extends AbstractCommandArguments {}

export class FileAddCommand extends AbstractCommand<FileAddCommandArguments> {
  async handle(argv: FileAddCommandArguments) {
    const { _: [ fileOrFrom, to = null ] } = argv;

    const mvmPackageIO = await MvmPackageIO.CreateFromDir(process.cwd());

    // See if we need to convert the files array to an object
    const { files: currentFiles } = mvmPackageIO.mvmPackage;
    let files = currentFiles;
    if (Array.isArray(currentFiles) && to !== null) {
      files = {};
      for (const currentFile of currentFiles) {
        files[currentFile] = currentFile;
      }
    }

    // Add the file based on the files object.
    if (Array.isArray(files)) {
      files.push(fileOrFrom);
    } else {
      files[fileOrFrom] = to ?? fileOrFrom;
    }

    await mvmPackageIO.updatePackage({
      files: files,
    });

    console.log(`File "${fileOrFrom}" has been added.`);
  }

  getDescription(): string {
    return 'Adds a file to copy over, either define a file to copy over or define from-to path';
  }

  getArguments(): string {
    return '<file/from> ?<to>';
  }
}
