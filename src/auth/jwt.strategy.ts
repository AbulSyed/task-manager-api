import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./user.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository
  ) {
    super({
      secretOrKey: 'secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  async validate(obj: Object): Promise<User> {
    const user = await this.usersRepository.findOne(obj['id']);

    if(!user){
      throw new UnauthorizedException();
    }

    return user;
  }
}