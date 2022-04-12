import packageInfo from "../../../package.json";

import { Deployer } from "./deployer";
import { Host } from "./host";
import { Output } from "./output";

export class Cli {
  private readonly deployer: Deployer;
  private readonly output: Output;

  constructor(host: Host) {
    this.output = new Output(host.stdout, host.stderr);
    this.deployer = new Deployer(this.output);
  }

  async run(args: readonly string[]): Promise<number> {
    const commandName = args[0];

    if (!commandName) {
      this.output.error("No command specified");
      return 1;
    }

    switch (commandName) {
      case "init":
        return await this.deployer.init();
      case "info":
        this.output.info(`${packageInfo.name} v${packageInfo.version}`);
        return 0;
      default:
        this.output.error(`Invalid command: ${commandName}`);
        return 1;
    }
  }
}
