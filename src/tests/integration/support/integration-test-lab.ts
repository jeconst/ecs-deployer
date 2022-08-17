import { strict as assert } from "assert";

import { Host } from "../../../dist/core/host";
import { getSystemHost } from "../../../dist/ext/system-host";
import { TestLab, TestAwsConfig, EnvRecord } from "../../support/test-lab";

type EnvRecord = Record<string, string | undefined>;

function getRequiredEnvVar(env: EnvRecord, name: string): string {
  const value = env[name];
  assert(value !== undefined, `Missing required environment variable: ${name}`);

  return value;
}

function readAwsConfig(env: EnvRecord): TestAwsConfig {
  return {
    // Note: These can be defined in local-dev.env
    accountId: getRequiredEnvVar(env, "TEST_AWS_ACCOUNT_ID"),
    region: getRequiredEnvVar(env, "TEST_AWS_REGION"),
    accessKeyId: getRequiredEnvVar(env, "TEST_AWS_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnvVar(env, "TEST_AWS_SECRET_ACCESS_KEY"),
    sessionToken: env["TEST_AWS_SESSION_TOKEN"],
  };
}

export class IntegrationTestLab implements TestLab {
  readonly host: Host;
  readonly awsConfig: TestAwsConfig;
  private readonly originalEnvVars: EnvRecord;

  constructor(env: EnvRecord = process.env) {
    this.host = getSystemHost();
    this.awsConfig = readAwsConfig(env);
    this.originalEnvVars = {};
  }

  setEnvironmentVariable(name: string, value: string | undefined): void {
    if (!Object.prototype.hasOwnProperty.call(this.originalEnvVars, name)) {
      this.originalEnvVars[name] = process.env[name];
    }

    if (value === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  }

  cleanUp(): void {
    for (const [key, value] of Object.entries(this.originalEnvVars)) {
      this.setEnvironmentVariable(key, value);
    }
  }
}
