import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CardsService', () => {
  let service: CardsService;

  const mockPrismaService = {
    card: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a card with calculated order', async () => {
      mockPrismaService.card.findFirst.mockResolvedValue(null);
      const mockCreatedCard = {
        id: 'card-1',
        title: 'New Card',
        boardId: 'board-1',
        status: 'TODO',
        order: 0,
      };
      mockPrismaService.card.create.mockResolvedValue(mockCreatedCard);

      const result = await service.create({
        title: 'New Card',
        boardId: 'board-1',
      });

      expect(result).toEqual(mockCreatedCard);
      expect(mockPrismaService.card.create).toHaveBeenCalled();
    });
  });

  describe('move', () => {
    it('should update status and order when moving a card', async () => {
      const mockMovedCard = {
        id: 'card-1',
        status: 'IN_PROGRESS',
        order: 1,
      };
      mockPrismaService.card.update.mockResolvedValue(mockMovedCard);

      const result = await service.move('card-1', {
        status: 'IN_PROGRESS',
        order: 1,
      });

      expect(result).toEqual(mockMovedCard);
      expect(mockPrismaService.card.update).toHaveBeenCalledWith({
        where: { id: 'card-1' },
        data: { status: 'IN_PROGRESS', order: 1 },
      });
    });
  });
});
