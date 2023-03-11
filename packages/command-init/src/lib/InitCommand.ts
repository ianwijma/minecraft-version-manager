import { AbstractCommand, AbstractCommandArguments } from "@mvm/common";

export interface InitCommandArguments extends AbstractCommandArguments {
  yes: boolean
}

export class InitCommand extends AbstractCommand<InitCommandArguments> {
  handle(argv: InitCommandArguments) {

  }

}
