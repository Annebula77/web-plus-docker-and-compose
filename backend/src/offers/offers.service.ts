import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import {
  NOT_FOUND_GENERAL,
  WISH_OVERPRICE_ERROR,
  WISH_SELF_FORBIDDEN,
} from '../utils/consts';

import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) { }

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wishes = await this.wishesService.findOne(createOfferDto.itemId);
    const wish = await this.wishesService.findOne(wishes.id);
    const sum = wish.price - wish.raised;
    const newRise = Number(wish.raised) + Number(createOfferDto.amount);

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        WISH_SELF_FORBIDDEN,
      );
    }

    if (createOfferDto.amount > sum) {
      throw new ForbiddenException(
        WISH_OVERPRICE_ERROR
      );
    }

    if (wish.raised === wish.price) {
      throw new ForbiddenException('нужная сумма уже собрана');
    }

    await this.wishesService.updateByRise(createOfferDto.itemId, newRise);
    return await this.offersRepository.save({ ...createOfferDto, user });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({ where: { id } });
    if (!offer) {
      throw new NotFoundException(NOT_FOUND_GENERAL);
    }
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({ relations: ['owner', 'item'] });
  }
}
