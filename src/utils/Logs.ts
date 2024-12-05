// src/utils/log.ts
class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, ...meta: any[]) {
    console.info(`[INFO] [${this.context}] ${message}`, ...meta);
  }

  warn(message: string, ...meta: any[]) {
    console.warn(`[WARN] [${this.context}] ${message}`, ...meta);
  }

  error(message: string, ...meta: any[]) {
    console.error(`[ERROR] [${this.context}] ${message}`, ...meta);
  }

  debug(message: string, ...meta: any[]) {
    console.debug(`[DEBUG] [${this.context}] ${message}`, ...meta);
  }
}

// Export an instance of the logger
export default Logger;
