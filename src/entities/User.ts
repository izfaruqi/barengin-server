import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, Index } from 'typeorm'
//import { Product } from './Group'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    unique: true,
    select: false
  })
  @Index()
  firebaseUid!: string

  @Column({
    unique: true
  })
  email!: string

  @Column()
  firstName!: string

  @Column({
    default: ""
  })
  lastName!: string

  @Column({
    nullable: true
  })
  birthDate!: Date

  @Column({
    nullable: true
  })
  address!: string // Will be stored as json

  @Column({
    nullable: true
  })
  phone!: number

  @Column()
  isAdmin!: boolean

  @Column()
  isSeller!: boolean

  @Column({
    default: 0
  })
  balance!: number

  //@OneToMany(() => Product, product => product.seller)
  //products!: Product[]

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}