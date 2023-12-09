import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';
import { Offer } from './entities/offer.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, Wish, User]),
    UsersModule,
    WishesModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule { }
