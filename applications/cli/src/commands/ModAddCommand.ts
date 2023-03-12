import { AbstractCommand, AbstractCommandArguments } from "./AbstractCommand";

export interface AddModCommandArguments extends AbstractCommandArguments {

}

export class ModAddCommand extends AbstractCommand<AddModCommandArguments> {
  handle(argv: AddModCommandArguments) {
    console.log(argv);
  }
}
