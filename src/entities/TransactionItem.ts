import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { GroupCategory } from "./GroupCategory";
import { Review } from "./Review";
import { Transaction } from "./Transaction";
import { User } from "./User";

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Transaction, transaction => transaction.items)
  transaction!: Transaction

  @ManyToOne(() => User)
  seller!: User

  @ManyToOne(() => Group)
  group!: Group

  @ManyToOne(() => GroupCategory)
  groupCategory!: GroupCategory

  @OneToMany(() => Review, review => review.transactionItem, { nullable: true })
  review!: Review

  // The three columns below are included to act as "snapshots"
  // in case that the original price, name, and category name changed.
  @Column({
    default: 1
  })
  slotsTaken!: number

  @Column({
    default: 0
  })
  price!: number

  @Column({
    default: ""
  })
  name!: string

  @Column({
    default: ""
  })
  categoryName!: string

  @Column({
    default: ""
  })
  relationToOwner!: string

  @CreateDateColumn({ select: false })
  createdAt!: Date
}