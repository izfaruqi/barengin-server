import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany } from 'typeorm'
import { Product } from './Group'

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  price!: string

  @OneToMany(() => Product, product => product.category)
  products!: Product[]

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}