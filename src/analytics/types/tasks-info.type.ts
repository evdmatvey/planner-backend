interface TasksInfo {
  count: number;
  executionTime: number;
}

export interface TasksInfoByGroups {
  completed: TasksInfo;
  todo: TasksInfo;
  all: TasksInfo;
}

export interface TaskGroups {
  date: string;
  tasks: TasksInfoByGroups;
}
