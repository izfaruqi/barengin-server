import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { Transaction } from "./Transaction";
import { User } from "./User";

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Transaction)
  transaction!: Transaction

  @ManyToOne(() => User)
  seller!: User

  @ManyToOne(() => Group)
  group!: Group

  @Column()
  price!: number

  @Column()
  name!: string
}