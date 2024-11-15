import { Location } from '../../location/entities/location.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20 })
  lastName: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 40, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];

  @CreateDateColumn({})
  public createdAt: Date;

  @UpdateDateColumn({})
  public updatedAt: Date;

  /**
   * Hides user's sensitive information
   * used when returning users data
   *
   * @params -
   * @returns void
   */
  public async hideSensitives() {
    this.password = 'hidden';
    // Hide other sensitive information as well
  }
}
