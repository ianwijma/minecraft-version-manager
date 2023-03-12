import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";
import { PackageJson } from "@mvm/common";

export interface MvmCommandArguments extends AbstractCommandArguments {
  version: boolean
}

export class MvmCommand extends AbstractCommand<MvmCommandArguments> {
  handle(argv: MvmCommandArguments) {
    if (argv.version) {
      console.log(`v${PackageJson.version}`)
    }
  }

}
