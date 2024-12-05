// Entry point of your application (e.g., app.ts or server.ts)
import 'reflect-metadata'; // Required for decorators and tsyringe
import {
  Action,
  ClassConstructor,
  Interceptor,
  InterceptorInterface,
  useContainer,
  useExpressServer,
} from "routing-controllers";
import { container } from "tsyringe";
import express, { Request, Response } from "express";
import { HttpsUtils } from "https-utils";
import axios from "axios";
//import { ChassisExtractor } from './util/ChassisExtractor';
import * as swagger from "swagger-ui-express";
import "reflect-metadata";
import fs from "fs";
import path from "path";
import swaggerSpec from "./swagger";
import { ConfigSettings } from "./config/ConfigSettings";
import HealthController from "./controllers/HealthController_";
import "./tracing_";
import { TraceLogger } from "./TraceLogger";
//import { LoggingMiddleware } from "./middlewares/LoggingMiddleware"; // Import LoggingMiddleware¨
import health from './controllers/health';


//const loggingMiddlewareInstance = new LoggingMiddleware();
//import swaggerDocument from './swagger.json';
const logger = console;
logger.info("Logger initialized");
logger.info("Starting application setup...");

const loggingIgnore = ["/swagger", "/health", "/metrics", "/integration"];
ConfigSettings.loadConfigs();
ConfigSettings.configAxios();

// Create an express server and a GraphQL endpoint
const app = express();

app.use(express.json({ limit: "50mb" }));

TraceLogger.applyRestTracingMiddleware(app);
TraceLogger.applyLogHeaderMiddleware(app, loggingIgnore);
TraceLogger.applyAxiosTracingInterceptor(axios);

// Use the instance as middleware
//app.use(loggingMiddlewareInstance.use.bind(loggingMiddlewareInstance));


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
  controllers: [HealthController, health]

};
function setupControllers(
  appExpress: any,
  routingOptions: {
    defaultErrorHandler: boolean;
    controllers: (
      | typeof HealthController
      | typeof health
    )[];
  }
): void {
  const patchedContainer = {
    get<T>(someClass: ClassConstructor<T>): T {
      return container.resolve(someClass);
    },
  };
  useContainer(patchedContainer);
  useExpressServer(appExpress, routingOptions);
    // Add the LoggingMiddleware to the middlewares array
    // useExpressServer(appExpress, {
    //   ...routingOptions,
    //   middlewares: [LoggingMiddleware] // Include your middleware here
    // });
}

setupControllers(app, routingControllersOptions);

//app.use("/swagger", swagger.serve, swagger.setup(swaggerSpec));

// Use Swagger UI to serve documentation
app.use('/swagger', swagger.serve, swagger.setup(swaggerSpec));

// Serve the Swagger JSON dynamically at /swagger.json
/*app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});*/

// Write Swagger JSON to a file when server starts
/**/
const swaggerFilePath = path.join(__dirname, "swagger.json");
/*fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerSpec, null, 2), "utf8");*/

//app.use(ErrorUtils.defaultErrorHandlingMiddleware);
const servers = HttpsUtils.createAndStartServers(app, logger);

export default servers;
