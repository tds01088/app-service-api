import { Get, JsonController, Post } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { singleton } from "tsyringe";
import { Product } from "../entities/ProductInfo";
import { ProductService } from "../services/ProductService";
import { ProductRepositoryImpl } from "../repositories/ProductInfo/ProductRepositoryImpl";

const productsEndPoint = "/products";

@JsonController()
@OpenAPI({ security: [{ bearerAuth: [] }] })
@singleton()
export default class ProductController {
  constructor(private productService: ProductService) {
    this.productService = new ProductService(new ProductRepositoryImpl());
  }
  @OpenAPI({
    responses: {
      "200": {
        description: "get products",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
  })
  @Get("/products")
  async products(): Promise<Product[]> {
    const products = await this.productService.getAllProducts();
    return products;
  }
}
// #items: { $ref: "#/components/schemas/products" },
