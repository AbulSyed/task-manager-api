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

    await this.save(user);
    return user;
  }
}