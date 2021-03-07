import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, JoinTable } from 'typeorm'
import { Group } from './Group'

@Entity()
export class GroupCategory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  price!: number

  @Column()
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