import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async signin(signinUserDto: SigninUserDto): Promise<User> {
    const { username, password } = signinUserDto;

    const user = await this.usersRepository.findOne({ username });
    if(!user){
      throw new UnauthorizedException('Failed login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      throw new UnauthorizedException('Failed login');
    }

    return user;
  }
}
