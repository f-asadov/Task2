import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('fake-users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post('seed')
    async seedDatabase() {
      return  await this.usersService.seedDatabase();      
    }


    @Post('/update-fake-problems')
    async updateProblems():Promise<number>{ 
        return await this.usersService.updateProblemsField()
    }
}
