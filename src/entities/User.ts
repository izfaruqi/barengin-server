import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

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

  @Column({
    nullable: true
  })
  lastName!: string
}