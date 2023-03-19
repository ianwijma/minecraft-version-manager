import { EnvironmentVariableMissingError } from "@mvm/common";
import * as process from "process";

export abstract class AbstractClient<T> {
  client: T;

  constructor() {
    this.client = this.setupClient();
  }

  abstract setupClient(): T;

  protected getEnvironmentVariable(variableName: string): string {
    EnvironmentVariableMissingError.validate(variableName);
    return process.env[variableName];

  }
}
