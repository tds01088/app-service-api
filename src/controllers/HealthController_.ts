import { Get, JsonController, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { singleton } from 'tsyringe';
import { ErrorRestResponse } from '../types/ErrorRestResponse';
import { trace } from '@opentelemetry/api';
import { LoggingMiddleware } from '../middlewares/LoggingMiddleware';
import Logger from '../utils/Logs';

//import swaggerDocument from './swagger.json';
const logger = new Logger('HealthController.ts');

/** constants */
const success = 'Operation successful';
const healthEndPoint = '/health';

@JsonController()
@ResponseSchema(ErrorRestResponse, {
  statusCode: 400,
  description: 'Bad request error'
})
@ResponseSchema(ErrorRestResponse, {
  statusCode: 401,
  description: 'Authorization error'
})
@ResponseSchema(ErrorRestResponse, {

  statusCode: 500,
  description: 'Internal error'
})

@OpenAPI({
  security: [{ BearerAuth: [] }],
  tags: ['Health']
})
@singleton()
//@UseBefore(LoggingMiddleware) // Apply middleware only for this controller
export default class HealthController {
  @OpenAPI({
    responses: {
      '200': {
        description: 'Health check status',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { type: 'string' } // Directly specifying `type: 'string'`
            }
          }
        }
      }
    }
  })
  @ResponseSchema(String, {
    isArray: true,
    statusCode: 200,
    description: success
  })
  @Get(healthEndPoint)
  async health(): Promise<string> {
      // Create a tracer and start a new span
      const tracer = trace.getTracer('health-controller-tracer');
      const span = tracer.startSpan('health-check');

      // Add attributes to the span
      span.setAttribute('route', healthEndPoint);
      span.setAttribute('operation', 'GET');


    logger.info('[INFO] Log at the start of the method(`operation:Get /healthcheck`'); // Log at the start of the method(`operation:Get /healthcheck`);
    span.end(); // End the span when the response is sent
    return 'Server is up & running for [backend-business-App-Service]';
  }
}
