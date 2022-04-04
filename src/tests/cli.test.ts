import { testCli } from "./support/cli-testing";

describe("CLI", () => {
  describe("info", () => {
    it("prints the version", () => testCli({
      args: ["info"],
      expectedExitCode: 0,
      expectedOutput: /aws-ecs-deployer v\d+\.\d+\.\d+\n/,
    }));
  });

  describe("init", () => {
    it("prints a message", () => testCli({
      args: ["init"],
      expectedExitCode: 0,
      expectedOutput: "Initializing\n",
    }));
  });

  describe("when not given a command", () => {
    it("prints an error and exits", () => testCli({
      args: [],
      expectedExitCode: 1,
      expectedOutput: { stderr: "No command specified\n" },
    }));
  });

  describe("when given an unrecognized command", () => {
    it("prints an error and exits", () => testCli({
      args: ["foobar"],
      expectedExitCode: 1,
      expectedOutput: { stderr: "Invalid command: foobar\n" },
    }));
  });
});
