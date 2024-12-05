import { Get, JsonController } from "routing-controllers";
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { singleton } from 'tsyringe';
@JsonController()
@OpenAPI({ security: [{ bearerAuth: [] }] })
@singleton()
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
  @Get('/health')
  async health(): Promise<string> {
    return 'Server is up & running';
  }
}
