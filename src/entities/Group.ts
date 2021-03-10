import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany, Index } from 'typeorm'
import { GroupCategory } from './GroupCategory'
import { Review } from './Review'
import { User } from './User'

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    default: ""
  })
  @Index()
  name!: string

  @Column({
    default: 0
  })
  slotsAvailable!: number

  @Column({
    default: 0
  })
  slotsTaken!: number

  @Column({
    default: ""
  })
  rules!: string

  @Column({
    default: "",
    select: false
  })
  credentials!: string

  @ManyToOne(() => GroupCategory, groupCategory => groupCategory.groups, { nullable: false })
  groupCategory!: GroupCategory

  @ManyToOne(() => User, user => user.groupsOwned, { nullable: false })
  owner!: User

  @ManyToMany(() => User, user => user.groupsJoined, { nullable: true })
  @JoinTable()
  members!: User[]

  @OneToMany(() => Review, review => review.group, { nullable: true })
  reviews!: Review[]

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}