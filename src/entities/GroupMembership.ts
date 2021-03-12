import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { GroupCredential } from "./GroupCredential";
import { User } from "./User";

@Entity()
export class GroupMembership {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Group, group => group.memberships)
  group!: Group

  @ManyToOne(() => User)
  member!: User

  @OneToMany(() => GroupCredential, groupCredential => groupCredential.membership)
  credentials!: GroupCredential[]

  @Column({
    default: ""
  })
  relationToOwner!: string

  @Column({
    default: 0
  })
  slotsTaken!: number

  @Column()
  joinedAt!: Date

  @Column()
  expiresAt!: Date
}