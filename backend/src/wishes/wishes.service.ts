import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult, FindOneOptions } from 'typeorm';
import { Repository, Like, In } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { NOT_FOUND_GENERAL, WISH_OWNER_FORBIDDEN } from '../utils/consts';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) { }

  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
      raised: createWishDto.raised !== undefined ? createWishDto.raised : 0, // Здесь устанавливаем значение по умолчанию, если raised не предоставлено

    });
    return this.wishesRepository.save(wish);
  }
  async updateWish(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: id },
      relations: ['owner: true']
    });

    if (!wish) {
      throw new NotFoundException(NOT_FOUND_GENERAL);
    }

    // Проверка на владельца и на то, что на подарок еще никто не скинулся
    if (wish.owner.id !== userId || wish.raised > 0) {
      throw new ForbiddenException(WISH_OWNER_FORBIDDEN);
    }

    return await this.wishesRepository.update(id, updateWishDto);

  }

  async updateByRise(id: number, newRise: number): Promise<UpdateResult> {
    return await this.wishesRepository.update({ id: id }, { raised: newRise });
  }



  async remove(id: number, userId: number): Promise<unknown> {
    const wish = await this.wishesRepository.findOne({
      where: { id: id },
      relations: ['owner']
    });

    if (!wish) {
      throw new NotFoundException(NOT_FOUND_GENERAL);
    }

    // Проверка на владельца
    if (wish.owner.id !== userId) {
      throw new ForbiddenException(WISH_OWNER_FORBIDDEN);
    }

    await this.wishesRepository.delete(id);
    return wish;
  }

  async getRecentWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async getPopularWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }


  async findOne(wishId: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      relations: {
        owner: {
          wishes: true,
          wishlists: true,
        },
        offers: {
          user: true,
          item: true,
        },
      },
    });
  }


  async searchWishesByName(name: string): Promise<Wish[]> {
    return this.wishesRepository.find({ where: { name: Like(`%${name}%`) } });
  }

  async searchWishesByDescription(description: string): Promise<Wish[]> {
    return this.wishesRepository.find({ where: { description: Like(`%${description}%`) } });
  }


  async findWish(query: FindOneOptions<Wish>): Promise<Wish> {
    return this.wishesRepository.findOne(query);
  }

  async copyWish(id: number, userId: number): Promise<Wish> {
    // Находим существующий подарок по его id
    const existingWish = await this.wishesRepository.findOne({ where: { id } });
    if (!existingWish) {
      throw new NotFoundException(NOT_FOUND_GENERAL);
    }

    // Увеличиваем счетчик copied у существующего подарка на 1
    existingWish.copied += 1;
    await this.wishesRepository.save(existingWish);

    // Создаем новый объект подарка со свойствами существующего подарка
    const newWish = this.wishesRepository.create({
      ...existingWish,  // Копируем свойства существующего подарка
      id: undefined,  // Убеждаемся, что у нового подарка будет новый id
      owner: { id: userId },  // Устанавливаем нового владельца
      copied: 0,  // Сбрасываем счетчик copied для нового подарка
    });

    // Сохраняем новый подарок в базу данных и возвращаем его
    return this.wishesRepository.save(newWish);
  }

  async findWishesByIds(ids: number[]): Promise<Wish[]> {
    // Используйте метод findBy репозитория TypeORM с оператором In для получения массива объектов Wish
    const wishes = await this.wishesRepository.findBy({ id: In(ids) });
    if (wishes.length !== ids.length) {
      // Это проверка на случай, если один или несколько идентификаторов не найдены в базе данных
      throw new NotFoundException(NOT_FOUND_GENERAL);
    }
    return wishes;
  }
}
