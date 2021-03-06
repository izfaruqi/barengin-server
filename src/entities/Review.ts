import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { TransactionItem } from "./TransactionItem";
import { User } from "./User";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, user => user.reviews)
  owner!: User

  @ManyToOne(() => Group, group => group.reviews)
  group!: Group

  @ManyToOne(() => TransactionItem, transactionItem => transactionItem.review)
  transactionItem!: TransactionItem

  @Column({
    default: 5
  })
  rating!: number

  @Column({
    type: "text"
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