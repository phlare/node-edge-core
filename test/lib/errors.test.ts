import { describe, expect, it } from "vitest";
import { AppError } from "../../src/lib/errors.js";

describe("AppError", () => {
  it("constructs with code, message, statusCode, and details", () => {
    const err = new AppError("CUSTOM_ERROR", "Something broke", 422, {
      field: "email"
    });

    expect(err.code).toBe("CUSTOM_ERROR");
    expect(err.message).toBe("Something broke");
    expect(err.statusCode).toBe(422);
    expect(err.details).toEqual({ field: "email" });
  });

  it("defaults statusCode to 500 and details to {}", () => {
    const err = new AppError("SERVER_ERROR", "Oops");

    expect(err.statusCode).toBe(500);
    expect(err.details).toEqual({});
  });

  it("is an instance of Error", () => {
    const err = new AppError("TEST", "test");

    expect(err).toBeInstanceOf(Error);
  });
});
