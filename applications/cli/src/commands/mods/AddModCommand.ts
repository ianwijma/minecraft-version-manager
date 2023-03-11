import { AbstractCommand, AbstractCommandArguments } from "@mvm/common";

export interface AddModCommandArguments extends AbstractCommandArguments {

}

export default class AddModCommand extends AbstractCommand<AddModCommandArguments> {
  handle(argv: AddModCommandArguments) {
    console.log(argv);
  }
}
