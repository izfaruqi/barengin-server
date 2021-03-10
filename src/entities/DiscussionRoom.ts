import { Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DiscussionMessage } from "./DiscussionMessage";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class DiscussionRoom {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToMany(() => User)
  members!: User[]

  @OneToMany(() => DiscussionMessage, discussionMessage => discussionMessage.room, { nullable: true })
  messages!: DiscussionMessage[]

  @OneToOne(() => Group)
  group!: Group
}