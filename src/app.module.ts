import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClassesModule } from './classes/classes.module';
import { UsersService } from './users/users.service';
import { SportModule } from './sport/sport.module';
import { ClassScheduleModule } from './class-schedule/class-schedule.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',   // change to your db user
      password: 'nika',   // change to your db password
      database: 'sports',
      autoLoadEntities: true,
      synchronize: true, // for dev only, auto-creates tables
    }),
    UsersModule,
    AuthModule,
    ClassesModule,
    SportModule,
    ClassScheduleModule,
    ApplicationModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    // ✅ Seed admin
    const admin = await this.usersService.findByEmail('admin@sports.com');
    if (!admin) {
      await this.usersService.create('admin@sports.com', 'admin123', 'admin');
      console.log('Seeded admin user ✅');
    }

    // ✅ Seed normal user
    const user = await this.usersService.findByEmail('user@sports.com');
    if (!user) {
      await this.usersService.create('user@sports.com', 'user123', 'user');
      console.log('Seeded normal user ✅');
    }
  }
}
