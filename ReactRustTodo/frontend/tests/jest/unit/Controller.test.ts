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

  test("createTodo calls POST /api/todos with body", async () =
