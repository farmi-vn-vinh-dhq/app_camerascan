import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "@/lib/logger";

describe("logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("logs error level with JSON format", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("TestService", "Something failed", { code: "ERR_001" });

    expect(spy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.level).toBe("error");
    expect(logged.service).toBe("TestService");
    expect(logged.message).toBe("Something failed");
    expect(logged.meta).toEqual({ code: "ERR_001" });
    expect(logged.timestamp).toBeDefined();
  });

  it("logs warn level", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("TestService", "Warning message");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("logs info level", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("TestService", "Info message");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("includes meta when provided", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("Svc", "err", { key: "value" });
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.meta).toEqual({ key: "value" });
  });

  it("omits meta field when not provided", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("Svc", "err");
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.meta).toBeUndefined();
  });
});
