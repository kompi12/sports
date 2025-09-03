// src/classes/application.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity';
import { User } from 'src/users/user.entity';
import { Class } from 'src/classes/class.entity';


@Injectable()
export class ApplicationService {
   constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
  ) {}

  async apply(userId: string, classId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const cls = await this.classRepository.findOneBy({ id: classId });
    if (!cls) throw new NotFoundException('Class not found');

    // Prevent duplicate application
    const existing = await this.applicationRepository.findOne({ where: { user: { id: userId }, class: { id: cls.id } } });
    if (existing) throw new BadRequestException('Already applied for this class');

    const application = this.applicationRepository.create({
      user,
      class: cls,
      status: ApplicationStatus.PENDING,
    });

    return this.applicationRepository.save(application);
  }

  async findByClass(classId: string) {
    return this.applicationRepository.find({
      where: { class: { id: classId } },
      relations: ['user'],
    });
  }

  async updateStatus(applicationId: string, status: ApplicationStatus) {
    const app = await this.applicationRepository.findOneBy({ id: applicationId });
    if (!app) throw new NotFoundException('Application not found');
    app.status = status;
    return this.applicationRepository.save(app);
  }
}
