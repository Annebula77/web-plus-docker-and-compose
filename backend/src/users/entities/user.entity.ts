import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { MyBaseEntity } from '../../utils/base.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsEmail, Length, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class User extends MyBaseEntity {

  @ApiProperty({ example: 'Nick' })
  @IsString()
  @Length(3, 20)
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'Пока еще не рассказал ничего о себе' })
  @IsString()
  @Column({ default: 'Пока еще не рассказал ничего о себе' })
  about: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @ApiProperty({ example: 'ex@ex.ru' })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @Length(8, 255)
  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Wish)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Offer)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Wishlist)
  wishlists: Wishlist[];
}