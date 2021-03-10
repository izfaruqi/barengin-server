import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, user => user.reviews)
  owner!: User

  @ManyToOne(() => Group, group => group.reviews)
  group!: Group

  @Column({
    default: 5
  })
  rating!: number

  @Column({
    type: "text",
    default: ""
  })
  content!: string

  @Column({
    default: false
  })
  published!: boolean

  @Column({
    default: false
  })
  anonymous!: boolean

  @Column({ nullable: true })
  publishedAt!: Date
}