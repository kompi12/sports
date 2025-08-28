import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Sport } from './sport.entity';

@Injectable()
export class SportService {
      constructor(
        @InjectRepository(Sport) private sportRepo: Repository<Sport>,
      ) {}


      async findAll(sports?: string[]) {
          if (sports) {
            return this.sportRepo.find({ where: { name: In(sports) } });
          }
          return this.sportRepo.find();
        }
      
        async findOne(id: string) {
          return this.sportRepo.findOne({ where: { id } });
        }
      
        async create(data: Partial<Sport>) {
        if (!data.name || !data.description) {
          throw new Error('Sport and description are required');
        }
        const c = this.sportRepo.create(data);
        return this.sportRepo.save(c);
      }
}
