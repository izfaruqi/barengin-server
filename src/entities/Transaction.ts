import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @Column()
  totalPrice!: number

  @Column()
  paid!: boolean
}