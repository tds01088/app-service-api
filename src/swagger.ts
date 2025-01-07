import { routingControllersToSpec } from "routing-controllers-openapi";
import { getMetadataArgsStorage } from "routing-controllers";

// Generate OpenAPI (Swagger) specification

const storage = getMetadataArgsStorage();
const swaggerSpec = routingControllersToSpec(
  storage,
  {},
  {
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    info: {
      title: "Business Service Api V1",
      version: "1.0.0",
    },
    paths: {},
  }
);

console.log(JSON.stringify(swaggerSpec, null, 2)); // Log the OpenAPI spec to confirm

export default swaggerSpec;
