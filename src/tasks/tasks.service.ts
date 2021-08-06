import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository
  ) {}

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async getTask(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne(id);

    if(!task){
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTask(id);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.tasksRepository.delete(id);

    if(task.affected === 0){
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(getTasksFilterDto);
  }
  
  // getTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(getTasksFilterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = getTasksFilterDto;

  //   let tasks = this.getTasks();
  //   if(status){
  //     tasks = tasks.filter(task => task.status === status)
  //   }
  //   if(search){
  //     tasks = tasks.filter(task => {
  //       if(task.title.toLowerCase().includes(search) || task.desc.toLowerCase().includes(search)){
  //         return true;
  //       }
  //       return false;
  //     })
  //   }
  //   return tasks;
  // }

  //   return tasks;
  // }
}
