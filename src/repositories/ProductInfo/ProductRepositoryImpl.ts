import { Pool, RowDataPacket } from "mysql2/promise";
import { IProductRepository } from "./IProductRepository";
import { getDatabaseConnection } from "../../config/database";
import { Product } from "../../entities/ProductInfo";

export class ProductRepositoryImpl implements IProductRepository {
  private db: Pool;

  constructor() {
    this.db = getDatabaseConnection();
  }

  async getAllProducts(): Promise<Product[]> {
    const [rows] = await this.db.query<RowDataPacket[] & Product[]>(
      "SELECT * FROM product_info"
    );
    return rows;
  }

  async getProductById(id: number): Promise<Product | null> {
    const [rows] = await this.db.query<RowDataPacket[] & Product[]>(
      "SELECT * FROM product_info WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createProduct(product: Product): Promise<void> {
    const { name, description, price, stock } = product;
    await this.db.execute(
      "INSERT INTO product_info (name, description, price, stock) VALUES (?, ?, ?, ?)",
      [name, description, price, stock]
    );
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<void> {
    const updates = Object.keys(product)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(product), id];
    await this.db.execute(
      `UPDATE product_info SET ${updates} WHERE id = ?`,
      values
    );
  }

  async deleteProduct(id: number): Promise<void> {
    await this.db.execute("DELETE FROM product_info WHERE id = ?", [id]);
  }
}
