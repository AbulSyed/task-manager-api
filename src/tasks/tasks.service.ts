import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(getTasksFilterDto: GetTasksFilterDto): Task[] {
    const { status, search } = getTasksFilterDto;

    let tasks = this.getTasks();
    if(status){
      tasks = tasks.filter(task => task.status === status)
    }
    if(search){
      tasks = tasks.filter(task => {
        if(task.title.toLowerCase().includes(search) || task.desc.toLowerCase().includes(search)){
          return true;
        }
        return false;
      })
    }
    return tasks;
  }

  getTask(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, desc } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      desc,
      status: TaskStatus.OPEN
    }

    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTask(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}
