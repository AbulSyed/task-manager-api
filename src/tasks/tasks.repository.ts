import { Brackets, EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, desc } = createTaskDto;

    const task = this.create({
      title,
      desc,
      status: TaskStatus.OPEN
    })

    return await this.save(task);
  }

  async getTasks(getTaskFilterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = getTaskFilterDto;

    const query = this.createQueryBuilder('task');

    if(status){
      query.andWhere(
        'task.status = :status', {
          status
        }
      );
    }

    if(search){
      query.andWhere(
        new Brackets(qb => {
          qb.where('task.title ILIKE :search', {
            search: `%${search}%`
          }).orWhere('task.desc ILIKE :search', {
            search: `%${search}%`
          })
        })
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}