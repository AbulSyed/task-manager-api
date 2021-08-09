import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm"
import { CreateUserDto } from "./dto/create-user.dto"
import { User } from "./user.entity"

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const user = this.create({
      username,
      password
    })

    try {
      return await this.save(user);
    }catch(err){
      if(err.code === '23505'){
        throw new ConflictException('Username already in use');
      }else{
        throw new InternalServerErrorException();
      }
    }
  }
}