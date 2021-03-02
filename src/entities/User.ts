import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany } from 'typeorm'
import { Product } from './Group'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    unique: true
  })
  email!: string

  @Column({
    select: false
  })
  password!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column()
  birthDate!: Date

  @Column()
  address!: string // Will be stored as json

  @Column()
  phone!: number

  @Column()
  isAdmin!: boolean

  @Column()
  isSeller!: boolean

  @Column({
    default: 0
  })
  balance!: number

  @OneToMany(() => Product, product => product.seller)
  products!: Product[]

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}