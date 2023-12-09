import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { MyBaseEntity } from '../../utils/base.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Wishlist extends MyBaseEntity {

  @ApiProperty({ example: 'Birthday' })
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({ example: 'This is a description.' })
  @IsString()
  @Column()
  description: string;

  @ApiProperty({ example: 'http://example.com/image.png' })
  @IsUrl()
  @Column()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Wish)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists, { eager: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => User)
  owner: User;
}