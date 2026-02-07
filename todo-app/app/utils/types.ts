// utils/types.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

// utils/tasks.ts
export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem('tasks');
  if (!tasks) return [];
  
  try {
    const parsedTasks = JSON.parse(tasks);
    // Convert date strings back to Date objects
    return parsedTasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined
    }));
  } catch (error) {
    console.error('Error parsing tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]) => {
  // Convert Date objects to strings for storage
  const serializedTasks = tasks.map(task => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
    dueDate: task.dueDate ? task.dueDate.toISOString() : undefined
  }));
  localStorage.setItem('tasks', JSON.stringify(serializedTasks));
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date(),
    completed: false
  };
  const updatedTasks = [newTask, ...tasks];
  saveTasks(updatedTasks);
  return newTask;
};

export const updateTask = (updatedTask: Task) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === updatedTask.id ? updatedTask : task
  );
  saveTasks(updatedTasks);
  return updatedTask;
};

export const deleteTask = (id: string) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  saveTasks(filteredTasks);
};

export const toggleTaskCompletion = (id: string) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks.find(task => task.id === id);
};