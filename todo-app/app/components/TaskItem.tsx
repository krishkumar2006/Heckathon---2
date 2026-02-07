// components/TaskItem.tsx
'use client';

import { useState } from 'react';
import { Task } from '../utils/types';
import { format, isBefore, isToday, isTomorrow } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export default function TaskItem({ task, onUpdate, onDelete, onToggleComplete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
    priority: task.priority
  });

  const handleSaveEdit = () => {
    onUpdate({
      ...task,
      title: editData.title,
      description: editData.description,
      dueDate: editData.dueDate ? new Date(editData.dueDate) : undefined,
      priority: editData.priority as 'low' | 'medium' | 'high'
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
      priority: task.priority
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isBefore(date, new Date())) return `Overdue: ${format(date, 'MMM dd, yyyy')}`;
    
    return format(date, 'MMM dd, yyyy');
  };

  const getDueDateClass = (date?: Date) => {
    if (!date) return '';
    if (isBefore(date, new Date())) return 'text-red-600 font-semibold';
    if (isToday(date)) return 'text-orange-600 font-semibold';
    if (isTomorrow(date)) return 'text-yellow-600 font-semibold';
    return 'text-gray-600';
  };

  return (
    <div className={`border rounded-xl p-4 transition-all duration-200 ${
      task.completed 
        ? 'bg-gray-50 border-gray-200' 
        : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-sm'
    }`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium"
          />
          
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Due Date</label>
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <select
                value={editData.priority}
                onChange={(e) => setEditData({...editData, priority: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                className="mt-1 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
              />
              
              <div className="flex-1">
                <h3 className={`font-medium ${
                  task.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-800'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={`mt-1 text-sm ${
                    task.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
                
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {task.dueDate && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      getDueDateClass(task.dueDate)
                    }`}>
                      📅 {formatDate(task.dueDate)}
                    </span>
                  )}
                  
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}