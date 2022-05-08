import { spawnSync } from "child_process";
import path from "path";

const programPath = path.join(__dirname, "../../../build/dist/bin.js");

describe("program executable", () => {
  function runProgram(...args: string[]) {
    return spawnSync("node", [programPath, ...args]);
  }

  describe("info", () => {
    it("prints information about the deployer", () => {
      const result = runProgram("info");

      expect(result.error).toBe(undefined);
      expect(result.stderr.toString()).toBe("");
      expect(result.stdout.toString()).toBe("aws-ecs-deployer v0.1.0\n");
      expect(result.status).toBe(0);
    });
  });
});
