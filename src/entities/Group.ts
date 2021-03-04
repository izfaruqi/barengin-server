import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string


  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}