import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { MyBaseEntity } from '../../utils/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsBoolean,
  Min,
  IsNotEmpty,
} from 'class-validator';

@Entity()
export class Offer extends MyBaseEntity {

  @ManyToOne(() => User, (user) => user.offers)
  @IsNotEmpty()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @IsNotEmpty()
  item: Wish;

  @ApiProperty({ example: 100.00 })
  @IsNumber()
  @Min(0.01)
  @Column('decimal', { scale: 2 })
  amount: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @Column({ default: false })
  hidden: boolean;
}