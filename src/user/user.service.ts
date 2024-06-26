import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async getAllUsers(): Promise<Partial<User[]>> {
    try {
      return await this.usersRepository.getUsers();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }
  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.getUserByEmail(email);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }
  async getUserByNickname(nickname: string): Promise<User> {
    try {
      const user = await this.usersRepository.getUserByNickname(nickname);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersRepository.createUser(createUserDto);
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    try {
      return await this.usersRepository.updateUser(id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      const user = await this.usersRepository.findUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return await this.usersRepository.deleteUser(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async restoreUser(id: string): Promise<User> {
    try {
      return await this.usersRepository.restoreUser(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to restore user');
    }
  }

  async createUserAuth0(user: any) {
    try {
      return await this.usersRepository.createWithAuth0(user);
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async searchFriends(id: string): Promise<User[]> {
    return await this.usersRepository.searchFriends(id);
  }

  async getDeletedUsers(): Promise<User[]> {
    return await this.usersRepository.getDeletedUsers();
  }

  async makeAdmin(adminCredential: string) {
    return await this.usersRepository.makeAdmin(adminCredential);
  }
}
