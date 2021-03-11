import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { GroupCredential } from "./GroupCredential";
import { User } from "./User";

@Entity()
export class GroupMembership {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Group)
  group!: Group

  @ManyToOne(() => User)
  member!: User

  @OneToOne(() => GroupCredential)
  @JoinColumn()
  credential!: GroupCredential

  @Column({
    default: ""
  })
  relationToOwner!: string

  @Column()
  joinedAt!: Date

  @Column()
  expiresAt!: Date
}