import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    async findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}


 async create(email: string, password: string, role: 'user' | 'admin' = 'user') {
  const hashed = await bcrypt.hash(password, 10);
  const user = this.usersRepo.create({ email, password: hashed, role });
  return this.usersRepo.save(user);
}


  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }
}
