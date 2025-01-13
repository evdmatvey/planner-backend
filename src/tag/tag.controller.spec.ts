import { Test, TestingModule } from '@nestjs/testing';
import { Color, Tag } from '@prisma/__generated__';
import { TagMessageConstants } from './constants/tag-message.constants';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

describe('TagController', () => {
  let tagController: TagController;
  let mockTagService;

  const userId = 'userId';
  const tagId = 'tagId';
  let tag: Tag;

  beforeEach(async () => {
    mockTagService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      toggleTagState: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
    }).compile();

    tagController = module.get<TagController>(TagController);
    tag = {
      id: tagId,
      title: 'Test Tag',
      color: Color.ACCENT,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      userId,
    };
  });

  describe('getAll', () => {
    it('should call getAll method of tagService', async () => {
      await tagController.getAll(userId);

      expect(mockTagService.getAll).toHaveBeenCalledWith(userId);
    });

    it('should return all tags for a user', async () => {
      mockTagService.getAll.mockResolvedValue([tag]);

      const result = await tagController.getAll(userId);

      expect(result).toEqual({ tags: [tag] });
    });

    it('should return empty array if tags not found', async () => {
      mockTagService.getAll.mockResolvedValue([]);

      const result = await tagController.getAll(userId);

      expect(result.tags.length).toBe(0);
    });
  });

  describe('getOne', () => {
    it('should call getById method of tagService', async () => {
      await tagController.getOne(userId, tagId);

      expect(mockTagService.getById).toHaveBeenCalledWith(userId, tagId);
    });

    it('should return a tag by id', async () => {
      mockTagService.getById.mockResolvedValue(tag);

      const result = await tagController.getOne(userId, tagId);

      expect(result).toEqual({ tag: tag });
    });

    it('should return null if tag not found', async () => {
      mockTagService.getById.mockResolvedValue(null);

      const result = await tagController.getOne(userId, tagId);

      expect(result.tag).toBeNull();
    });
  });

  describe('create', () => {
    let dto: CreateTagDto;

    beforeEach(() => {
      dto = {
        title: 'New Tag',
      };
    });

    it('should call create method of tagService', async () => {
      await tagController.create(userId, dto);

      expect(mockTagService.create).toHaveBeenCalledWith(userId, dto);
    });

    it('should create a new tag and return it with a success message', async () => {
      mockTagService.create.mockResolvedValue(tag);

      const result = await tagController.create(userId, dto);

      expect(result).toEqual({
        tag: tag,
        message: TagMessageConstants.SUCCESS_CREATE,
      });
    });
  });

  describe('update', () => {
    let dto: UpdateTagDto;

    beforeEach(() => {
      dto = { title: 'Updated Tag' };
    });

    it('should call update method of tagService', async () => {
      await tagController.update(userId, tagId, dto);

      expect(mockTagService.update).toHaveBeenCalledWith(userId, tagId, dto);
    });

    it('should update a tag and return it with a success message', async () => {
      mockTagService.update.mockResolvedValue({ ...tag, ...dto });

      const result = await tagController.update(userId, tagId, dto);

      expect(result).toEqual({
        tag: { ...tag, ...dto },
        message: TagMessageConstants.SUCCESS_UPDATE,
      });
    });
  });

  describe('delete', () => {
    it('should call delete method of tagService', async () => {
      await tagController.delete(userId, tagId);

      expect(mockTagService.delete).toHaveBeenCalledWith(userId, tagId);
    });

    it('should delete a tag and return a success message', async () => {
      mockTagService.delete.mockResolvedValue(tag);

      const result = await tagController.delete(userId, tagId);

      expect(result).toEqual({
        tag: tag,
        message: TagMessageConstants.SUCCESS_DELETE,
      });
      expect(mockTagService.delete).toHaveBeenCalledWith(userId, tagId);
    });
  });
});
