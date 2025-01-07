// src/repositories/ProductRepository.ts

import { Product } from "../../entities/ProductInfo";

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  createProduct(product: Product): Promise<void>;
  updateProduct(id: number, product: Partial<Product>): Promise<void>;
  deleteProduct(id: number): Promise<void>;
}
