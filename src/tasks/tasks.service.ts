import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository
  ) {}

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async getTask(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });

    if(!task){
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTask(id, user);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const task = await this.tasksRepository.delete({ id, user });

    if(task.affected === 0){
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  async getTasks(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(getTasksFilterDto, user);
  }
}
