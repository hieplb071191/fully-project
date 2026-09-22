import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SourceLoginEnum } from '../../../common/enum/source-login.enum';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  avatar: string;

  @Column({
    type: 'enum',
    enum: SourceLoginEnum,
    default: SourceLoginEnum.USER,
    enumName: 'source_login_enum',
  })
  sourceLogin: SourceLoginEnum;

  @Column({ default: false })
  isConfirm: boolean;

  @Column({ default: false })
  isTwoFa: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  loginAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  bannedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
