import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Sport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; 

  @Column()
  description: string;

}
