import { Test, TestingModule } from '@nestjs/testing';
import { Color, Tag } from '@prisma/__generated__';
import { mockPrismaService } from '@/shared/mocks/prisma-service.mock';
import { PrismaService } from '@/shared/services/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

describe('TagService', () => {
  let service: TagService;
  let prismaService: typeof mockPrismaService;
  let userId: string;
  let tagId: string;
  let tag: Tag;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    prismaService = module.get<typeof mockPrismaService>(PrismaService);
    userId = 'user-id';
    tagId = 'tag-id';
    tag = {
      id: tagId,
      title: 'title',
      color: Color.ACCENT,
      userId,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  });

  describe('getAll', () => {
    it('should call prisma findMany with userId', async () => {
      await service.getAll(userId);

      expect(prismaService.tag.findMany).toHaveBeenCalledWith({
        where: {
          userId,
        },
        include: {
          tasks: {
            select: {
              id: true,
              executionTime: true,
              createdAt: true,
            },
          },
        },
      });
    });

    it('should return a tags by userId', async () => {
      prismaService.tag.findMany.mockResolvedValue([tag]);

      const result = await service.getAll(userId);

      expect(result[0]).toEqual(tag);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array if tags not found by userId', async () => {
      prismaService.tag.findMany.mockResolvedValue([]);

      const result = await service.getAll(userId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('getById', () => {
    it('should call prisma findUnique with userId and tagId', async () => {
      await service.getById(userId, tagId);

      expect(prismaService.tag.findUnique).toHaveBeenCalledWith({
        where: { userId, id: tagId },
      });
    });

    it('should return a tag by userId and tagId', async () => {
      prismaService.tag.findUnique.mockResolvedValue(tag);

      const result = await service.getById(userId, tagId);

      expect(result).toEqual(tag);
    });

    it('should return null if tag not found by userId and tagId', async () => {
      prismaService.tag.findUnique.mockResolvedValue(null);

      const result = await service.getById(userId, tagId);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    let dto: CreateTagDto;

    beforeEach(() => {
      dto = {
        title: tag.title,
      };
    });

    it('should call prisma create with correct data', async () => {
      await service.create(userId, dto);

      expect(prismaService.tag.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          userId,
        },
      });
    });

    it('should create a tag', async () => {
      prismaService.tag.create.mockResolvedValue(tag);

      const result = await service.create(userId, dto);

      expect(result).toEqual(tag);
    });
  });

  describe('update', () => {
    let dto: UpdateTagDto;

    beforeEach(() => {
      dto = {
        title: 'new title',
      };
    });

    it('should call prisma update with correct data', async () => {
      await service.update(userId, tagId, dto);

      expect(prismaService.tag.update).toHaveBeenCalledWith({
        where: {
          userId,
          id: tagId,
        },
        data: dto,
      });
    });

    it('should update tag', async () => {
      prismaService.tag.update.mockResolvedValue({ ...tag, ...dto });

      const result = await service.update(userId, tagId, dto);

      expect(result).toEqual({ ...tag, ...dto });
    });
  });

  describe('delete', () => {
    it('should call prisma delete with correct data', async () => {
      await service.delete(userId, tagId);

      expect(prismaService.tag.delete).toHaveBeenCalledWith({
        where: {
          userId,
          id: tagId,
        },
      });
    });

    it('should delete tag', async () => {
      prismaService.tag.delete.mockResolvedValue(tag);

      const result = await service.delete(userId, tagId);

      expect(result).toEqual(tag);
    });
  });
});
