import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDTO } from './dto/move-card.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    const highestOrderCard = await this.prisma.card.findFirst({
      where: {
        boardId: createCardDto.boardId,
        status: createCardDto.status ?? 'TODO',
      },
      orderBy: { order: 'desc' },
    });

    const nextOrder = highestOrderCard ? highestOrderCard.order + 1 : 0;

    return this.prisma.card.create({
      data: {
        title: createCardDto.title,
        description: createCardDto.description,
        boardId: createCardDto.boardId,
        status: createCardDto.status ?? 'TODO',
        order: nextOrder,
      },
    });
  }

  update(id: string, updateCardDto: UpdateCardDto) {
    return this.prisma.card.update({
      where: { id },
      data: updateCardDto,
    });
  }

  remove(id: string) {
    return this.prisma.card.delete({
      where: { id },
    });
  }

  async move(id: string, moveCardDTO: MoveCardDTO) {
    const { status, order } = moveCardDTO;

    return this.prisma.card.update({
      where: { id },
      data: {
        status,
        order,
      },
    });
  }
}
