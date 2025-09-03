import { Test, TestingModule } from '@nestjs/testing';
import { ClassScheduleController } from 'src/class-schedule/class-schedule.controller';
import { ClassSchedule, DayOfWeek } from 'src/class-schedule/class-schedule.entity';
import { ClassScheduleService } from 'src/class-schedule/class-schedule.service';

describe('ClassScheduleController', () => {
  let controller: ClassScheduleController;
  let service: Partial<ClassScheduleService>;

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      create: jest.fn(),
      findByClass: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassScheduleController],
      providers: [{ provide: ClassScheduleService, useValue: service }],
    }).compile();

    controller = module.get<ClassScheduleController>(ClassScheduleController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return all schedules', async () => {
    const schedules = [{ id: '1' } as ClassSchedule];
    (service.findAll as jest.Mock).mockResolvedValue(schedules);

    const result = await controller.findAll();
    expect(result).toEqual(schedules);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create a schedule', async () => {
    const mockSchedule = { id: '10', class: { id: '1', title: 'Football' }, dayOfWeek: DayOfWeek.MONDAY } as ClassSchedule;
    (service.create as jest.Mock).mockResolvedValue(mockSchedule);

    const body = {
      classId: 'Football',
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '18:00',
      endTime: '19:00',
      weekStart: '2025-09-01',
      weekEnd: '2025-12-31',
    };

    const result = await controller.create(body);

    expect(result).toEqual(mockSchedule);
    expect(service.create).toHaveBeenCalledWith('Football', {
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '18:00',
      endTime: '19:00',
      weekStart: '2025-09-01',
      weekEnd: '2025-12-31',
    });
  });

  it('should return schedules by class', async () => {
    const schedules = [{ id: '1' } as ClassSchedule];
    (service.findByClass as jest.Mock).mockResolvedValue(schedules);

    const result = await controller.findByClass('Football');
    expect(result).toEqual(schedules);
    expect(service.findByClass).toHaveBeenCalledWith('Football');
  });

  it('should remove a schedule', async () => {
    const schedule = { id: '1' } as ClassSchedule;
    (service.remove as jest.Mock).mockResolvedValue(schedule);

    const result = await controller.remove('1');
    expect(result).toEqual(schedule);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
