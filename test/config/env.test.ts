import { describe, expect, it } from "vitest";
import { EnvSchema } from "../../src/config/env.js";

const validEnv = {
  PORT: "3001",
  HOST: "0.0.0.0",
  LOG_LEVEL: "info",
  CORE_API_BASE_URL: "http://localhost:4000",
  CORE_API_TOKEN: "test-token"
};

describe("EnvSchema", () => {
  it("parses valid env", () => {
    const result = EnvSchema.parse(validEnv);
    expect(result.PORT).toBe(3001);
    expect(result.HOST).toBe("0.0.0.0");
    expect(result.LOG_LEVEL).toBe("info");
    expect(result.CORE_API_BASE_URL).toBe("http://localhost:4000");
    expect(result.CORE_API_TOKEN).toBe("test-token");
  });

  it("defaults PORT to 3001", () => {
    const { PORT: _PORT, ...rest } = validEnv;
    const result = EnvSchema.parse(rest);
    expect(result.PORT).toBe(3001);
  });

  it("defaults HOST to 0.0.0.0", () => {
    const { HOST: _HOST, ...rest } = validEnv;
    const result = EnvSchema.parse(rest);
    expect(result.HOST).toBe("0.0.0.0");
  });

  it("defaults LOG_LEVEL to info", () => {
    const { LOG_LEVEL: _LOG_LEVEL, ...rest } = validEnv;
    const result = EnvSchema.parse(rest);
    expect(result.LOG_LEVEL).toBe("info");
  });

  it("rejects missing CORE_API_BASE_URL", () => {
    const { CORE_API_BASE_URL: _CORE_API_BASE_URL, ...rest } = validEnv;
    expect(() => EnvSchema.parse(rest)).toThrow();
  });

  it("rejects empty CORE_API_TOKEN", () => {
    expect(() =>
      EnvSchema.parse({ ...validEnv, CORE_API_TOKEN: "" })
    ).toThrow();
  });

  it("rejects non-URL CORE_API_BASE_URL", () => {
    expect(() =>
      EnvSchema.parse({ ...validEnv, CORE_API_BASE_URL: "not-a-url" })
    ).toThrow();
  });

  it("rejects non-numeric PORT", () => {
    expect(() => EnvSchema.parse({ ...validEnv, PORT: "abc" })).toThrow();
  });
});
