import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { GroupCategory } from "./GroupCategory";
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

  // The three columns below are included to act as "snapshots"
  // in case that the original price, name, and category name changed.
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

  @CreateDateColumn({ select: false })
  createdAt!: Date
}