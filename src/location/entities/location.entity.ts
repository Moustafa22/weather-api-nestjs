import { User } from '../../user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  city: string;

  @ManyToOne(() => User, (user) => user.locations)
  user: User;

  @CreateDateColumn({})
  public createdAt: Date;

  @UpdateDateColumn({})
  public updatedAt: Date;
}
