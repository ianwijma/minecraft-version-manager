import { MvmPackageHandler, Sides } from "@mvm/common";
import process from "process";

export interface AbstractCommandArguments {
  _: string[]
}

export interface AbstractSidedCommandArguments extends AbstractCommandArguments {
  side: Sides
}

export abstract class AbstractCommand<Arguments extends AbstractCommandArguments = AbstractCommandArguments> {
  protected mvmPackageHandler: MvmPackageHandler;

  async initialize(): Promise<void> {
    this.mvmPackageHandler = await MvmPackageHandler.CreateFromProjectDir(process.cwd());
  }

  abstract handle(argv: Arguments): Promise<void>|void;

  getDescription(): string {
    return '';
  }

  getArguments(): string {
    return '';
  }
}
