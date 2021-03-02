import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne } from 'typeorm'
import { ProductCategory } from './ProductCategory'
import { User } from './User'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  price!: string

  @ManyToOne(() => ProductCategory, productCategory => productCategory.products)
  category!: ProductCategory

  @ManyToOne(() => User, user => user.products)
  seller!: User

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}