import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { GroupCategory } from './GroupCategory'
import { User } from './User'

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  slotsAvailable!: number

  @Column()
  slotsTaken!: number

  @Column()
  rules!: string

  @Column({
    select: false
  })
  credentials!: string

  @ManyToOne(() => GroupCategory, groupCategory => groupCategory.groups, { nullable: false })
  groupCategory!: GroupCategory

  @ManyToOne(() => User, user => user.groupsOwned, { nullable: false })
  owner!: User

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  members!: User[]

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}