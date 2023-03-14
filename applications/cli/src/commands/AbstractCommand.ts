import { MvmPackage, MvmPackageIO } from "@mvm/common";
import process from "process";

export interface AbstractCommandArguments {
  _: string[]
}

export abstract class AbstractCommand<Arguments extends AbstractCommandArguments = AbstractCommandArguments> {
  protected mvmPackage: MvmPackage;

  async initialize(): Promise<void> {
    this.mvmPackage = await MvmPackageIO.MvmPackageFromDir(process.cwd())
  }

  abstract handle(argv: Arguments): Promise<void>|void;

  getDescription(): string {
    return '';
  }

  getArguments(): string {
    return '';
  }
}
