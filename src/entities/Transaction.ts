import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TransactionItem } from "./TransactionItem";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number
 
  @OneToMany(() => TransactionItem, transactionItem => transactionItem.transaction)
  items!: TransactionItem[]
}