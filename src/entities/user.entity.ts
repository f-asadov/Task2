import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  firstName: string;

  @Column({ length: 50, nullable: false })
  lastName: string;

  @Column({ type: 'int', width: 3, nullable: false })
  age: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  gender: string;

  @Column({ type: 'boolean'})
  problems: boolean;
}