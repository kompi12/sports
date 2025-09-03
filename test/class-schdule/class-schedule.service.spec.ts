import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Class } from '../../src/classes/class.entity';
import { ClassSchedule, DayOfWeek } from 'src/class-schedule/class-schedule.entity';
import { ClassScheduleService } from 'src/class-schedule/class-schedule.service';

describe('ClassScheduleService', () => {
  let service: ClassScheduleService;
  let scheduleRepo: Partial<Repository<ClassSchedule>>;
  let classRepo: Partial<Repository<Class>>;

  beforeEach(async () => {
    scheduleRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };
    classRepo = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassScheduleService,
        { provide: getRepositoryToken(ClassSchedule), useValue: scheduleRepo },
        { provide: getRepositoryToken(Class), useValue: classRepo },
      ],
    }).compile();

    service = module.get<ClassScheduleService>(ClassScheduleService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a schedule if class exists', async () => {
      const cls = { id: '1', title: 'Football' } as Class;
      (classRepo.findOneBy as jest.Mock).mockResolvedValue(cls);

      const scheduleData: Partial<ClassSchedule> = {
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: '18:00',
        endTime: '19:00',
        weekStart: '2025-09-01',
        weekEnd: '2025-12-31',
      };

      const createdSchedule = { ...scheduleData, class: cls };
      (scheduleRepo.create as jest.Mock).mockReturnValue(createdSchedule);
      (scheduleRepo.save as jest.Mock).mockResolvedValue({ id: '10', ...createdSchedule });

      const result = await service.create('Football', scheduleData);
      expect(result).toEqual({ id: '10', ...createdSchedule });
      expect(scheduleRepo.create).toHaveBeenCalledWith({ ...scheduleData, class: cls });
      expect(scheduleRepo.save).toHaveBeenCalledWith(createdSchedule);
    });

    it('should throw NotFoundException if class not found', async () => {
      (classRepo.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.create('NonExistent', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all schedules with class relations', async () => {
      const schedules = [{ id: '1' } as ClassSchedule];
      (scheduleRepo.find as jest.Mock).mockResolvedValue(schedules);

      const result = await service.findAll();
      expect(result).toEqual(schedules);
      expect(scheduleRepo.find).toHaveBeenCalledWith({ relations: ['class'] });
    });
  });

  describe('findByClass', () => {
    it('should return schedules filtered by class', async () => {
      const schedules = [{ id: '1' } as ClassSchedule];
      (scheduleRepo.find as jest.Mock).mockResolvedValue(schedules);

      const result = await service.findByClass('Football');
      expect(result).toEqual(schedules);
      expect(scheduleRepo.find).toHaveBeenCalledWith({
        where: { class: { title: 'Football' } },
        relations: ['class'],
      });
    });
  });

  describe('remove', () => {
    it('should remove schedule if exists', async () => {
      const schedule = { id: '1' } as ClassSchedule;
      (scheduleRepo.findOneBy as jest.Mock).mockResolvedValue(schedule);
      (scheduleRepo.remove as jest.Mock).mockResolvedValue(schedule);

      const result = await service.remove('1');
      expect(result).toEqual(schedule);
      expect(scheduleRepo.remove).toHaveBeenCalledWith(schedule);
    });

    it('should throw NotFoundException if schedule not found', async () => {
      (scheduleRepo.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
