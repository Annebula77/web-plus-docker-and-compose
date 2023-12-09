import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDate } from 'class-validator';

export abstract class MyBaseEntity extends BaseEntity {
  @ApiProperty({ example: 1 })
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2021-04-12T06:25:43.511Z' })
  @IsDate()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ example: '2021-04-12T06:25:43.511Z' })
  @IsDate()
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updateAt: Date;
}