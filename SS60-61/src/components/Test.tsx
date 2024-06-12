import React, { useEffect, useState } from 'react';
import { getTasks,addTasks,updateTask,deleteTasks, updateAllTask } from './services';
interface Task {
  id: string;
  name: string;
  completed: boolean;
}
const Test: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    fetchTasks();
  }, []);
  const fetchTasks = async () => {
    const response = await getTasks();
    setTasks(response.data);
    console.log(response.data);
  };
  const [newTask, setNewTask] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const addTask = () => {
    if (newTask.trim() !== '') {
      addTasks(
        { id: String( Number(tasks.reduce((maxId, task) => task.id > maxId ? task.id : maxId, tasks[0].id)) + 1), name: newTask, completed: false }
      );
      setNewTask('');
      fetchTasks();
    }
  };
  const toggleTaskCompletion = async (id: string) => {
    const updatedTasks = tasks.map(task =>
        task.id === id ? updateTask({ ...task, completed: !task.completed }) : task
    );
    await fetchTasks(); 
};
  const deleteTask = async (id: string) => {
    await deleteTasks(id);
    fetchTasks()
  };
  const deleteCompletedTasks = async () => {
    const uncompletedTasks = tasks.filter(task => !task.completed);
    setTasks(uncompletedTasks);
    await Promise.all(
        tasks
            .filter(task => task.completed)
            .map(async (task) => {
                await deleteTask(task.id); 
            })
    );
    await fetchTasks(); 
};
 const deleteAllTasks = async () => {
    await Promise.all(
        tasks
            .map(async (task) => {
                await deleteTask(task.id); 
            })
    );
    await fetchTasks(); 
};
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'in-progress') return !task.completed;
    return true;
  });
  return (
    <div className="app">
      <h1>Quản lý công việc</h1>
      <div className="add-task">
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Nhập tên công việc" 
        />
        <button onClick={addTask} className='btn btn-primary'>Thêm công việc</button>
      </div>
      <div className="filters">
        <button className='btn btn-outline-primary' onClick={() => setFilter('all')}>Tất cả</button>
        <button className='btn btn-outline-danger' onClick={() => setFilter('completed')}>Hoàn thành</button>
        <button className='btn btn-outline-danger' onClick={() => setFilter('in-progress')}>Đang thực hiện</button>
      </div>
      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => toggleTaskCompletion(task.id)} 
            />
            <span>{task.name}</span>
            <div>
                <button className='edit btn' onClick={() => deleteTask(task.id)}><i className="material-icons" title="Edit">&#xE254;</i></button>
                <button className='delete btn' onClick={() => deleteTask(task.id)}><i className="material-icons" title="Delete">&#xE872;</i></button>
            </div>
          </li>
        ))}
      </ul>
      <div className="actions">
        <button className='btn btn-danger' onClick={deleteCompletedTasks}>Xóa công việc hoàn thành</button>
        <button className='btn btn-danger' onClick={deleteAllTasks}>Xóa tất cả công việc</button>
      </div>
    </div>
  );
};


export default Test;
