import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export enum BalanceMutationStatus {
  SETTLED = "settled",
  HELD = "held"
}

@Entity()
export class BalanceMutation {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    default: 0
  })
  mutation!: number

  @ManyToOne(() => User, user => user.balanceMutations)
  owner!: User

  @Column({
    type: 'enum',
    enum: BalanceMutationStatus,
    default: BalanceMutationStatus.SETTLED
  })
  mutationStatus!: BalanceMutationStatus
}