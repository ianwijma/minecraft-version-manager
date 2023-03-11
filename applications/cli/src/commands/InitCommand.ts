import { AbstractCommand, AbstractCommandArguments } from "@mvm/common";

export interface InitCommandArguments extends AbstractCommandArguments {
  yes: boolean
}

export default class InitCommand extends AbstractCommand<InitCommandArguments> {
  handle(argv: InitCommandArguments) {

  }

}
