// components/TaskList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Task, getTasks, updateTask, deleteTask, toggleTaskCompletion } from '../utils/types';
import { format, isBefore, isToday, isTomorrow } from 'date-fns';
import TaskItem from './TaskItem';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const storedTasks = getTasks();
    setTasks(storedTasks);
    setLoading(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !task.completed) || 
      (filter === 'completed' && task.completed);
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleUpdateTask = (updatedTask: Task) => {
    const savedTask = updateTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === savedTask.id ? savedTask : t));
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    const toggledTask = toggleTaskCompletion(id);
    if (toggledTask) {
      setTasks(prev => prev.map(task => task.id === id ? toggledTask : task));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
        
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-700">{tasks.length}</p>
          <p className="text-sm text-blue-600">Total</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-700">
            {tasks.filter(t => t.completed).length}
          </p>
          <p className="text-sm text-green-600">Completed</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-700">
            {tasks.filter(t => !t.completed).length}
          </p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No tasks found</div>
          <p className="text-gray-500 text-sm">
            {searchTerm ? 'Try adjusting your search' : 'Add a new task to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}