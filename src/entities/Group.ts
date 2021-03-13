import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany, Index, OneToOne, JoinColumn } from 'typeorm'
import { DiscussionRoom } from './DiscussionRoom'
import { GroupCategory } from './GroupCategory'
import { GroupCredential } from './GroupCredential'
import { GroupMembership } from './GroupMembership'
import { Review } from './Review'
import { User } from './User'

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    default: ""
  })
  @Index()
  name!: string

  @Column({
    default: 0
  })
  slotsAvailable!: number

  @Column({
    default: 0
  })
  slotsTaken!: number

  @Column({
    default: ""
  })
  rules!: string

  @OneToMany(() => GroupCredential, groupCredential => groupCredential.group, { nullable: true })
  credentials!: GroupCredential[]

  @ManyToOne(() => GroupCategory, groupCategory => groupCategory.groups, { nullable: false })
  groupCategory!: GroupCategory

  @ManyToOne(() => User, user => user.groupsOwned, { nullable: false })
  owner!: User
  
  @OneToMany(() => GroupMembership, groupMembership => groupMembership.group, { nullable: true })
  memberships!: GroupMembership[]

  @OneToMany(() => Review, review => review.group, { nullable: true })
  reviews!: Review[]

  @OneToOne(() => DiscussionRoom, { nullable: true })
  @JoinColumn()
  discussionRoom!: DiscussionRoom

  @DeleteDateColumn({
    select: false,
    nullable: true
  })
  deletedAt!: Date
}