type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  meta?: Record<string, unknown>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

/**
 * Structured logger for server-side operations.
 * Outputs JSON-formatted log entries for consistent log parsing.
 */
function log(level: LogLevel, service: string, message: string, meta?: Record<string, unknown>) {
  if (LOG_LEVELS[level] < LOG_LEVELS[currentLevel]) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    service,
    message,
    ...(meta ? { meta } : {}),
  };

  switch (level) {
    case "error":
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(entry));
      break;
    case "warn":
      // eslint-disable-next-line no-console
      console.warn(JSON.stringify(entry));
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(entry));
  }
}

export const logger = {
  debug: (service: string, message: string, meta?: Record<string, unknown>) =>
    log("debug", service, message, meta),
  info: (service: string, message: string, meta?: Record<string, unknown>) =>
    log("info", service, message, meta),
  warn: (service: string, message: string, meta?: Record<string, unknown>) =>
    log("warn", service, message, meta),
  error: (service: string, message: string, meta?: Record<string, unknown>) =>
    log("error", service, message, meta),
};
