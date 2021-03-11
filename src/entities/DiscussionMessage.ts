import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DiscussionRoom } from "./DiscussionRoom";
import { User } from "./User";

@Entity()
export class DiscussionMessage {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: "text"
  })
  content!: string

  @ManyToOne(() => DiscussionRoom)
  room!: DiscussionRoom

  @ManyToOne(() => User)
  sender!: User

  @Column()
  senderId!: number
  
  @Column()
  sentAt!: Date
}