import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { makeList } from '../fixtures/todos';

const todos = makeList(4);

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ ok: true })),
  http.get('/api/todos', () => HttpResponse.json(todos)),
  http.post('/api/todos', async ({ request }) => {
    const body = await request.json();
    const created = { id: crypto.randomUUID(), status: 'OPEN', ...body };
    todos.unshift(created);
    return HttpResponse.json(created, { status: 201 });
  }),
  http.patch('/api/todos/:id', async ({ params, request }) => {
    const body = await request.json();
    const i = todos.findIndex(t => t.id === params.id);
    todos[i] = { ...todos[i], ...body };
    return HttpResponse.json(todos[i]);
  }),
  http.delete('/api/todos/:id', ({ params }) => {
    const i = todos.findIndex(t => t.id === params.id);
    if (i >= 0) todos.splice(i, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];

export const server = setupServer(...handlers);
