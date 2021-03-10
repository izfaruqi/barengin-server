import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, ManyToMany, Index, JoinTable } from 'typeorm'
import { Group } from './Group'
import { Review } from './Review'
//import { Product } from './Group'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    unique: true,
    select: false
  })
  firebaseUid!: string

  @Column({
    unique: true
  })
  email!: string
  
  @Column({
    default: false
  })
  emailVerified!: boolean

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

  @Column({
    default: false
  })
  isAdmin!: boolean

  @Column({
    default: false
  })
  isSeller!: boolean

  @Column({
    default: 0
  })
  balance!: number

  @OneToMany(() => Group, group => group.owner, { nullable: true })
  groupsOwned!: Group[]

  @ManyToMany(() => Group, group => group.members, { nullable: true })
  groupsJoined!: Group[]

  @OneToMany(() => Review, review => review.owner, { nullable: true })
  reviews!: Review[]

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}