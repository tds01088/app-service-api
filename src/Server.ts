import "reflect-metadata";
import { ConfigSettings } from "./config/ConfigSettings";
import express, { Request, Response } from "express";
import { HttpsUtils } from "https-utils";
import "source-map-support/register"; // shows stack traces using ts files line numbers
import {
  Action,
  ClassConstructor,
  Interceptor,
  InterceptorInterface,
  useContainer,
  useExpressServer,
} from "routing-controllers";
import { container } from "tsyringe";
import HealthController from "./controllers/HealthController";
import { Logger, LoggerMetaDataExtractor, TraceLogger } from "trace-logger";
import axios from "axios";
import * as swagger from "swagger-ui-express";

import fs from "fs";
import path from "path";

//import swaggerDocument from './swagger.json';
import swaggerSpec from "./swagger";
import ProductController from "./controllers/ProductController";
import { LoggingMiddleware } from "./middlewares/LoggingMiddleware";
const logger = new Logger("server.ts");

const loggingIgnore = ["/swagger", "/health", "/metrics", "/integration"];
ConfigSettings.loadConfigs();
ConfigSettings.configAxios();

// Create an express server and a GraphQL endpoint
const app = express();

// express middleware for https validation
app.use(HttpsUtils.createHttpsValidationMiddleware(logger));
app.use(express.json({ limit: "50mb" }));

// TracingService.applyTracingMiddleware(app, ClsUtil.getNamespace());
// MetricsUtils.applyPrometheusMiddleware(app, true);
TraceLogger.applyRestTracingMiddleware(app);
TraceLogger.applyLogHeaderMiddleware(app, loggingIgnore);
TraceLogger.applyAxiosTracingInterceptor(axios);

// express middleware for logging incoming requests
app.use((req: Request, _res: Response, next: any) => {
  const match = loggingIgnore.find((_path) => req.path.includes(_path));
  if (match === undefined) {
    logger.debug(`[${req.method}] ${req.url}`);
    logger.trace("Incoming request payload: ", req.body);
  }
  next();
});

// express middleware for logging global rest errors
/* istanbul ignore next */
app.use((err: any, _req: Request, _res: Response, next: () => any) => {
  if (err) {
    logger.error("Internal server error", { err });
  }
  next();
});

//Logging interceptor for the controllers
@Interceptor()
export class NameCorrectionInterceptor implements InterceptorInterface {
  async intercept(_action: Action, result: any): Promise<any> {
    const match = loggingIgnore.find((_path) =>
      _action.request.path.includes(_path)
    );
    if (match === undefined) {
      logger.debug("Request completed");
      logger.trace("Controller returned:", result);
    }

    return result;
  }
}

const routingControllersOptions = {
  defaultErrorHandler: false,
  controllers: [HealthController, ProductController],
};

function setupControllers(
  appExpress: any,
  routingOptions: {
    defaultErrorHandler: boolean;
    controllers: (typeof HealthController | typeof ProductController)[];
  }
): void {
  const patchedContainer = {
    get<T>(someClass: ClassConstructor<T>): T {
      return container.resolve(someClass);
    },
  };
  useContainer(patchedContainer);
  //useExpressServer(appExpress, routingOptions);
  // Add the LoggingMiddleware to the middlewares array
  useExpressServer(appExpress, {
    ...routingOptions,
    middlewares: [LoggingMiddleware], // Include your middleware here
  });
}
setupControllers(app, routingControllersOptions);
app.use("/swagger", swagger.serve, swagger.setup(swaggerSpec));

// Serve the Swagger JSON dynamically at /swagger.json
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});
const swaggerFilePath = path.join(__dirname, "swagger.json");
//fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerSpec, null, 2), "utf8");

const servers = HttpsUtils.createAndStartServers(app, logger);
export default servers;
