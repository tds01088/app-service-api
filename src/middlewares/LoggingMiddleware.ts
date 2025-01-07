import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import Logger from "../utils/Logs";

const logger = new Logger("LoggingMiddleware");

@Middleware({ type: "before" })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(req: any, res: any, next: (err?: any) => any): void {
    logger.info(`Incoming Request: ${req.method} ${req.url}`);
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info(`[INFO] ${req.method} ${req.url} completed in ${duration}ms`);
    });

    next();
  }
}
