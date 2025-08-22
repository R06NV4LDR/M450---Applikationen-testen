import axios from 'axios'
import { Todo, NewTodo } from '../types';

const API_URL = 'http://localhost:8080/api/todos';

export const getTodos = async () => {
    return await axios.get(API_URL);
}

export const getTodo = async (id: number) => {
    return await axios.get(`${API_URL}/${id}`);
}

export const createTodo = async (todo: NewTodo) => {
  return await axios.post(API_URL, todo);
}

export const updateTodo = async (todo: Todo) => {
  return await axios.put(`${API_URL}/${todo.todo_id}`, todo);
}

export const deleteTodo = async (id: number) => {
  return await axios.delete(`${API_URL}/${id}`);
}

