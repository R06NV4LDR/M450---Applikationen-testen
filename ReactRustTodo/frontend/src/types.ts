export interface Todo {
    todo_id: number;
    title: string | null;
    description: string | null;
    createdAt: string;
    completed: boolean;
}

export interface NewTodo {
    title: string;
    description: string | null;
    completed: boolean;
}