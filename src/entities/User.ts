import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    unique: true
  })
  email!: string

  @Column({
    select: false
  })
  password!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column()
  isAdmin!: boolean

  @Column({
    default: 0
  })
  balance!: number

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}