import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersDocument } from './models/users.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<UsersDocument> {
    return this.usersRepository.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 15),
    });
  }

  async verifyUser(email: string, password: string): Promise<UsersDocument> {
    const user: UsersDocument = await this.usersRepository.findOne({
      email,
    });

    const passwordIsValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordIsValid)
      throw new UnauthorizedException('Credentials are not valid!');

    return user;
  }
}
