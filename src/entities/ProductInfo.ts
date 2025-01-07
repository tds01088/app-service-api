// // src/entities/ProductInfo.ts
// import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// @Entity()
// export class ProductInfo {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @Column("decimal")
//   price: number;

//   @Column("int")
//   stock: number;
// }
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}
