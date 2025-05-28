import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  transactionCode;

  @Column('float')
  amount;

  @Column()
  sender;

  @Column()
  date;

  @Column()
  type;
}
