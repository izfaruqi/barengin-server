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

  // If owner is null, the mutation goes to the system. E.g. top ups and fees. 
  @ManyToOne(() => User, user => user.balanceMutations, { nullable: true })
  owner!: User

  @Column({
    type: 'enum',
    enum: BalanceMutationStatus,
    default: BalanceMutationStatus.SETTLED
  })
  mutationStatus!: BalanceMutationStatus
}