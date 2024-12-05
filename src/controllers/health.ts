import { JsonController, Get, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { singleton } from 'tsyringe';
import Logger from '../utils/Logs';
//import { LoggingMiddleware } from '../middlewares/LoggingMiddleware';

@singleton()
@JsonController()
//@UseBefore(LoggingMiddleware)
@OpenAPI({ security: [{ bearerAuth: [] }] })
export default class HealthController {
  @Get('/health')
  @OpenAPI({
    summary: 'Health check',
    responses: {
      '200': {
        description: 'Server is up & running',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async health(): Promise<string> {
    return 'Server is up & running for [backend-business-App-Service]';
  }
}
