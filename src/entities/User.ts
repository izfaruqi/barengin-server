import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, ManyToMany, Index, JoinTable, In, ManyToOne } from 'typeorm'
import { BalanceMutation } from './BalanceMutation'
import { Group } from './Group'
import { GroupMembership } from './GroupMembership'
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
  @Index()
  firstName!: string

  @Column({
    default: ""
  })
  @Index()
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

  @OneToMany(() => GroupMembership, groupMembership => groupMembership.member, { nullable: true })
  groupMemberships!: GroupMembership[]

  @OneToMany(() => Review, review => review.owner, { nullable: true })
  reviews!: Review[]

  @OneToMany(() => BalanceMutation, balanceMutation => balanceMutation.owner, { nullable: true })
  balanceMutations!: BalanceMutation

  @ManyToOne(() => User, user => user.referredUsers, { nullable: true })
  referredBy!: User

  @Column()
  @Index()
  referralCode!: string

  @OneToMany(() => User, user => user.referredBy, { nullable: true })
  referredUsers!: User[]

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}