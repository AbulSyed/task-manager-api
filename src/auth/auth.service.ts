import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = this.usersRepository.create({
      username,
      password: hashedPassword
    })

    try {
      const newUser = await this.usersRepository.save(user);
      delete newUser.password;
      return newUser;
    }catch(err){
      if(err.code === '23505'){
        throw new ConflictException('Username already in use');
      }else{
        throw new InternalServerErrorException();
      }
    }
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

    const token = await this.jwtService.sign({ id: user.id });
    const payload = { ...user, token };
    delete payload.password;

    return payload;
  }
}
