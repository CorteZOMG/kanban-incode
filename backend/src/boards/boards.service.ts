import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  create(createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({
      data: {
        title: createBoardDto.title,
      },
    });
  }

  findAll() {
    return this.prisma.board.findMany({
      include: {
        cards: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.board.findUnique({
      where: { id },
      include: {
        cards: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  update(id: string, updateBoardDto: UpdateBoardDto) {
    return this.prisma.board.update({
      where: { id },
      data: { title: updateBoardDto.title },
    });
  }

  remove(id: string) {
    return this.prisma.board.delete({
      where: { id },
    });
  }
}
