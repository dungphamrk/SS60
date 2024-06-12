import axios from 'axios';
import { Task } from "./types";

const API_URL = 'http://localhost:3000/Tasks';

export const getTasks = () => axios.get<Task[]>(API_URL);
export const addTasks = (Task: Task) => axios.post<Task>(API_URL, Task);
export const updateTask = (Task: Task) => axios.put<Task>(`${API_URL}/${Task.id}`, Task);
export const deleteTasks = (id: string) => axios.delete(`${API_URL}/${id}`);
export const updateAllTask =(Task:Task[])=>axios.put(`${API_URL}`,Task);