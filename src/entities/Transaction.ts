import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TransactionItem } from "./TransactionItem";
import { User } from "./User";

export enum PaymentMethod {
  MIDTRANS = "midtrans",
  BALANCE = "balance"
}

export enum PaymentStatus {
  PENDING = "pending",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  SETTLED = "settled"
}

export enum TransactionType {
  SALE = "sale",
  TOPUP = "topup"
}
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: "enum",
    enum: TransactionType,
    default: TransactionType.SALE
  })
  transactionType!: TransactionType
 
  @OneToMany(() => TransactionItem, transactionItem => transactionItem.transaction)
  items!: TransactionItem[]

  @ManyToOne(() => User)
  buyer!: User

  @Column({
    default: 0
  })
  totalPrice!: number

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  paymentStatus!: PaymentStatus

  @Column({
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.MIDTRANS
  })
  paymentMethod!: PaymentMethod

  @Column({
    nullable: true
  })
  midtransRedirect!: string

  @Column({
    nullable: true
  })
  @Index()
  midtransOrderId!: string

  @Column({
    nullable: true,
    type: "text",
    select: false
  })
  successPayload!: string

  @Column({ nullable: true })
  paidAt!: Date

  @Column({ nullable: true })
  expiresAt!: Date

  @CreateDateColumn()
  createdAt!: Date
}