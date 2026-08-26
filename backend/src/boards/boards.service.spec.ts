import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BoardsService', () => {
  let service: BoardsService;

  const mockPrismaService = {
    board: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new board', async () => {
      const mockBoard = {
        id: 'uuid-123',
        title: 'Test Board',
        createdAt: new Date(),
      };
      mockPrismaService.board.create.mockResolvedValue(mockBoard);

      const result = await service.create({ title: 'Test Board' });
      expect(result).toEqual(mockBoard);
      expect(mockPrismaService.board.create).toHaveBeenCalledWith({
        data: { title: 'Test Board' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a board by id with cards', async () => {
      const mockBoard = {
        id: 'uuid-123',
        title: 'Test Board',
        cards: [],
      };
      mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);

      const result = await service.findOne('uuid-123');
      expect(result).toEqual(mockBoard);
      expect(mockPrismaService.board.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
        include: { cards: { orderBy: { order: 'asc' } } },
      });
    });
  });
});
