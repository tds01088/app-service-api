import { Product } from "../entities/ProductInfo";
import { IProductRepository } from "../repositories/ProductInfo/IProductRepository";

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  getAllProducts(): Promise<Product[]> {
    return this.productRepository.getAllProducts();
  }

  getProductById(id: number): Promise<Product | null> {
    return this.productRepository.getProductById(id);
  }

  createProduct(product: Product): Promise<void> {
    return this.productRepository.createProduct(product);
  }

  updateProduct(id: number, product: Partial<Product>): Promise<void> {
    return this.productRepository.updateProduct(id, product);
  }

  deleteProduct(id: number): Promise<void> {
    return this.productRepository.deleteProduct(id);
  }
}
