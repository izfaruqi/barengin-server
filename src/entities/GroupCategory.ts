import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, JoinTable, ManyToOne } from 'typeorm'
import { Group } from './Group'
import { GroupProvider } from './GroupProvider'

@Entity()
export class GroupCategory {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => GroupProvider, groupProvider => groupProvider.categories, { nullable: true })
  provider!: GroupProvider
  
  @Column({
    default: ""
  })
  name!: string

  @Column({
    default: 0
  })
  price!: number

  @Column({
    default: 0
  })
  packagePrice!: number
  
  @Column({
    default: ""
  })
  description!: string

  @OneToMany(() => Group, group => group.groupCategory, { nullable: true })
  groups!: Group[]

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}