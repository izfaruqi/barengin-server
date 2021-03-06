import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { GroupMembership } from "./GroupMembership";

@Entity()
export class GroupCredential {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Group, group => group.memberships)
  group!: Group

  @Column({
    type: "text",
    nullable: true
  })
  credential!: string

  @ManyToOne(() => GroupMembership, groupMembership => groupMembership.credentials, { nullable: true, onDelete: "SET NULL" })
  membership!: GroupMembership
}