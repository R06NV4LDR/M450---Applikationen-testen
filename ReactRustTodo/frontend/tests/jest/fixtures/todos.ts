export type Todo = { id: string; title: string; description?: string; status: 'OPEN'|'DONE' };

export const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  title: 'Playwright lernen',
  description: 'New Todo Description',
  status: 'OPEN',
  ...overrides,
});

export const makeList = (n = 3) => Array.from({ length: n }, (_, i) =>
  makeTodo({ title: `Task ${i+1}` })
);
