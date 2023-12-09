import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { MyBaseEntity } from '../../utils/base.entity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsDecimal, IsInt, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Wish extends MyBaseEntity {

  @ApiProperty({ example: 'Chair' })
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({ example: 'http://example.com/product' })
  @IsUrl()
  @Column()
  link: string;

  @ApiProperty({ example: 'http://example.com/image.png' })
  @IsUrl()
  @Column()
  image: string;

  @ApiProperty({ example: '100.00' })
  @IsDecimal({ decimal_digits: '2' })
  @Column('decimal', { scale: 2 })
  price: number;

  @ApiProperty({ example: '50.00' })
  @IsDecimal({ decimal_digits: '2' })
  @Column('decimal', { scale: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => User)
  owner: User;

  @ApiProperty({ example: 'This is a description.' })
  @IsString()
  @Column()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Offer)
  offers: Offer[];

  @ApiProperty({ example: 10 })
  @IsInt()
  @Column('int', { default: 0 })
  copied: number;

  @ManyToMany(() => User)
  @JoinTable()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  wishers: User[];
}