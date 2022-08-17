import { EnvRecord } from "../../support/test-lab";

import { IntegrationTestLab } from "./integration-test-lab";

describe("IntegrationTestLab", () => {
  it("sets environment variables, and resets them on clean up", () => {
    const env: EnvRecord = {};
    const lab = new IntegrationTestLab(env);

    lab.setEnvironmentVariable("FOO", "foo");
    lab.setEnvironmentVariable("BAR", "bar");
    lab.setEnvironmentVariable("BAR", "bar2");

    expect(env["FOO"]).toEqual("foo");
    expect(env["BAR"]).toEqual("bar2");

    lab.cleanUp();

    expect(process.env["FOO"]).toEqual("originalfoo");
    expect(process.env["BAR"]).toEqual("originalbar");
  });
});
