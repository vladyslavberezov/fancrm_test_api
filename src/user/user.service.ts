import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.findAll({ raw: true });
      console.log('Users', users);
      this.logger.log(`Found ${users.length} users`);
      return users;
    } catch (e) {
      this.logger.error('Error fetching users', e.message);
      throw e;
    }
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      this.logger.log('Sending data via POST request');
      user.password = await this.authService.hashPassword(user.password);
      this.logger.log(`Hash pass: ${user.password}`);
      const createdUser = await this.userModel.create(user);
      this.logger.log(`Created user: ${JSON.stringify(createdUser.toJSON())}`);
      return createdUser;
    } catch (e) {
      this.logger.error('Error creating user', e.message);
      throw e;
    }
  }

  async findOne(identifier: number | string): Promise<User> {
    try {
      const searchCriteria =
        typeof identifier === 'number'
          ? { id: identifier }
          : { username: identifier };

      this.logger.log(
        `Fetching user with ${typeof identifier === 'number' ? 'id' : 'username'}: ${identifier}`,
      );

      const user = await this.userModel.findOne({
        where: searchCriteria,
        raw: true,
      });

      if (user) {
        this.logger.log(`User found: ${JSON.stringify(user)}`);
      } else {
        this.logger.warn(
          `User with ${typeof identifier === 'number' ? 'id' : 'username'}: ${identifier} not found`,
        );
      }

      return user;
    } catch (e) {
      this.logger.error('Error fetching user', e.message);
      throw e;
    }
  }
}
