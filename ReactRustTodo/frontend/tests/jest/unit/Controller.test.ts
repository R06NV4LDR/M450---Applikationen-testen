// tests/jest/unit/Controller.test.ts
import axios from "axios";
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../../../src/middleware/Controller";
import type { Todo, NewTodo } from "../../../src/types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const API_URL = "http://localhost:8080/api/todos";

describe("Controller (axios)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getTodos calls GET /api/todos and returns response", async () => {
    const response = { data: [{ todo_id: 1, title: "A", completed: false }] };
    mockedAxios.get.mockResolvedValueOnce(response as any);

    const result = await getTodos();

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(API_URL);
    expect(result).toBe(response);
    expect(result.data).toEqual(response.data);
  });

  test("getTodo calls GET /api/todos/:id and returns response", async () => {
    const response = { data: { todo_id: 42, title: "X", completed: true } };
    mockedAxios.get.mockResolvedValueOnce(response as any);

    const result = await getTodo(42);

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/42`);
    expect(result).toBe(response);
  });

   test("createTodo calls POST /api/todos with body", async () => {
    const newTodo: NewTodo = { title: "New", completed: false };
    const response = { data: { todo_id: 2, ...newTodo } };
    mockedAxios.post.mockResolvedValueOnce(response as any);

    const result = await createTodo(newTodo);

    expect(mockedAxios.post).toHaveBeenCalledWith(API_URL, newTodo);
    expect(result).toBe(response);
  });

  test("updateTodo calls PUT /api/todos/:id with body", async () => {
    const todo: Todo = { todo_id: 7, title: "Edit", completed: true };
    const response = { data: todo };
    mockedAxios.put.mockResolvedValueOnce(response as any);

    const result = await updateTodo(todo);

    expect(mockedAxios.put).toHaveBeenCalledWith(`${API_URL}/7`, todo);
    expect(result).toBe(response);
  });

  test("deleteTodo calls DELETE /api/todos/:id", async () => {
    const response = { data: { success: true } };
    mockedAxios.delete.mockResolvedValueOnce(response as any);

    const result = await deleteTodo(9);

    expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_URL}/9`);
    expect(result).toBe(response);
  });

  test("propagates axios errors (example: getTodos)", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("network"));
    await expect(getTodos()).rejects.toThrow("network");
  });
});