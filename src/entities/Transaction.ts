import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TransactionItem } from "./TransactionItem";
import { User } from "./User";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number
 
  @OneToMany(() => TransactionItem, transactionItem => transactionItem.transaction)
  items!: TransactionItem[]

  @ManyToOne(() => User)
  buyer!: User

  @Column({
    default: 0
  })
  totalPrice!: number

  @Column({
    default: false
  })
  paid!: boolean

  @Column({
    default: false
  })
  cancelled!: boolean

  @CreateDateColumn()
  createdAt!: Date
}