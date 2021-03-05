import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm'
import { GroupCategory } from './GroupCategory'
import { User } from './User'

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

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