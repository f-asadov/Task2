import { faker } from '@faker-js/faker';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly configService:ConfigService
      ) {}


      async seedDatabase() {
        
        const usersBatchSize = this.configService.get<number>('USERS_BATCH_SIZE');
        const totalUsers = this.configService.get<number>('TOTAL_USERS'); 

        try {

          for (let i = 0; i < totalUsers; i += usersBatchSize) {
            const users: User[] = [];
            for (let j = 0; j < usersBatchSize; j++) {
                const user = new User();
                user.firstName = faker.person.firstName();
                user.lastName = faker.person.lastName();
                user.age = faker.number.int({ min: 18, max: 100 }); 
                user.gender = faker.person.gender();
                user.problems = faker.datatype.boolean();
                users.push(user);
            }
            await this.usersRepository.save(users);

            const progress = ((i + usersBatchSize) / totalUsers) * 100;
            this.logger.log(`Database seeding progress: ${progress.toFixed(2)}%`);
        }

        this.logger.log('Database seeding completed.');
          
        } catch (error) {
          console.log(error)
          throw new Error(error)
        }
        
        return {msg:'Seeding completed',status:HttpStatus.OK}
        
    }



    async updateProblemsField(): Promise<number> { 
      this.logger.log('Counting users with problems...');

      const countWithProblems = await this.usersRepository.count({ where: { problems: true } });

      this.logger.log(`Users with problems: ${countWithProblems}`);

      const batchSize = this.configService.get<number>('USERS_BATCH_SIZE');
      let updatedCount = 0;

      while (updatedCount < countWithProblems) {
          this.logger.log(`Updating batch starting from offset ${updatedCount}...`);

          await this.usersRepository.createQueryBuilder()
              .update(User)
              .set({ problems: false })
              .where("problems = :problems", { problems: true })
              .execute();

          updatedCount += batchSize;
          this.logger.log(`Updated ${updatedCount} users so far...`);
      }

      this.logger.log('All problems fields updated to false.');

      return countWithProblems; 
  }
}
