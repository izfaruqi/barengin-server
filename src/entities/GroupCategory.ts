import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany } from 'typeorm'

@Entity()
export class GroupCategory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  price!: number
  
  @Column({
    default: ""
  })
  description!: string

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}