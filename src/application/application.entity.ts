// src/classes/entities/application.entity.ts
import { Sport } from 'src/sport/sport.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';


export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Sport, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Sport;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @CreateDateColumn()
  appliedAt: Date;
}
