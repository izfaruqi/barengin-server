import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, JoinTable } from 'typeorm'
import { Group } from './Group'

@Entity()
export class GroupCategory {
  @PrimaryGeneratedColumn()
  id!: number

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