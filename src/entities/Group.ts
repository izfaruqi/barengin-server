import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { GroupCategory } from './GroupCategory'
import { User } from './User'

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    default: ""
  })
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

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}