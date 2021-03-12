import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GroupCategory } from "./GroupCategory";

@Entity()
export class GroupProvider {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    default: ""
  })
  name!: string

  @OneToMany(() => GroupCategory, groupCategrory => groupCategrory.provider, { nullable: true })
  categories!: GroupCategory[]
}