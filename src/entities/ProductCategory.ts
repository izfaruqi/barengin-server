import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany } from 'typeorm'
import { Product } from './Product'

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @OneToMany(() => Product, product => product.category)
  products!: Product[]

  @Column({
    type: "blob"
  })
  image!: Uint8Array;

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}