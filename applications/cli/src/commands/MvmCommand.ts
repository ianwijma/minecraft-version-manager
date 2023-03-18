import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { PackageJson } from "@mvm/common";
import { HelpText } from "../utils/HelpText";

export interface MvmCommandArguments extends AbstractCommandArguments {
  version: boolean,
  help: boolean,
}

export class MvmCommand extends AbstractCommand<MvmCommandArguments> {

  async initialize(): Promise<void> {
    // handle will do the initializing!~
  }

  handle(argv: MvmCommandArguments) {
    if (argv.version) {
      console.log(`v${PackageJson.version}`)
    }
    if (argv.help) {
      console.log(HelpText.getText())
    }
  }

  getDescription(): string {
    return '--help / --version';
  }
}
