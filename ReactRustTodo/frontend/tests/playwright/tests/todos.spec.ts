import { expect, test, type Page, type Request, type Route } from '@playwright/test';

type Todo = {
  todo_id: number;
  title: string;
  description: string;
  completed: boolean;
};

const FRONTEND_URL = 'http://localhost:5173/';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

const parseRequestBody = <T>(request: Request): Partial<T> => {
  const raw = request.postData();
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Partial<T>;
  } catch {
    return {};
  }
};

const fulfillJson = (route: Route, body: unknown, status = 200) => {
  return route.fulfill({
    status,
    body: JSON.stringify(body),
    headers: {
      ...corsHeaders,
      'content-type': 'application/json',
    },
  });
};

async function setupTodoApiMock(page: Page, initialTodos: Todo[] = []) {
  const state = {
    todos: initialTodos.map(todo => ({ ...todo })),
    nextId:
      initialTodos.reduce((max, todo) => Math.max(max, todo.todo_id), 0) + 1,
  };

  await page.route('**/api/todos', async route => {
    const method = route.request().method();

    if (method === 'OPTIONS') {
      await route.fulfill({ status: 200, headers: corsHeaders, body: '' });
      return;
    }

    if (method === 'GET') {
      await fulfillJson(route, state.todos);
      return;
    }

    if (method === 'POST') {
      const payload = parseRequestBody<Todo>(route.request());
      const newTodo: Todo = {
        todo_id: state.nextId++,
        title: payload.title ?? '',
        description: payload.description ?? '',
        completed: !!payload.completed,
      };
      state.todos.unshift(newTodo);
      await fulfillJson(route, newTodo, 201);
      return;
    }

    await route.fallback();
  });

  await page.route('**/api/todos/*', async route => {
    const method = route.request().method();

    if (method === 'OPTIONS') {
      await route.fulfill({ status: 200, headers: corsHeaders, body: '' });
      return;
    }

    const url = new URL(route.request().url());
    const id = Number(url.pathname.split('/').pop());
    const index = state.todos.findIndex(todo => todo.todo_id === id);

    if (method === 'PUT') {
      const payload = parseRequestBody<Todo>(route.request());
      if (index !== -1) {
        state.todos[index] = {
          ...state.todos[index],
          ...payload,
          todo_id: id,
        };
      }
      await fulfillJson(route, state.todos[index] ?? payload);
      return;
    }

    if (method === 'DELETE') {
      if (index !== -1) {
        state.todos.splice(index, 1);
      }
      await route.fulfill({ status: 204, headers: corsHeaders, body: '' });
      return;
    }

    await route.fallback();
  });

  return state;
}

test.describe('Todos page', () => {
  test('shows empty state when backend has no todos', async ({ page }) => {
    await setupTodoApiMock(page, []);
    await page.goto(FRONTEND_URL);
    await expect(page.getByText('No todos')).toBeVisible();
  });

  test('renders todos from backend and allows editing a task', async ({ page }) => {
    const initialTodos: Todo[] = [
      {
        todo_id: 1,
        title: 'Review pull request',
        description: 'Go through open comments',
        completed: false,
      },
      {
        todo_id: 2,
        title: 'Deploy release',
        description: 'Ship version 1.0.0',
        completed: true,
      },
    ];

    await setupTodoApiMock(page, initialTodos);
    await page.goto(FRONTEND_URL);

    const headings = page.getByRole('heading', { level: 3 });
    await expect(headings).toHaveCount(initialTodos.length);
    await expect(headings.nth(0)).toHaveText(initialTodos[1].title);
    await expect(headings.nth(1)).toHaveText(initialTodos[0].title);

    const editIcons = page.getByTestId('EditIcon');
    await editIcons.nth(1).click();

    const updatedTitle = 'Review pull request and merge';
    const updatedDescription = 'Resolve remaining feedback before merging';

    await page.getByLabel('Title').fill(updatedTitle);
    await page.getByLabel('Description').fill(updatedDescription);
    await page.locator('#completed').check();
    await page.getByRole('button', { name: 'Submit' }).click();

    const updatedContainer = page
      .getByRole('heading', { name: updatedTitle })
      .locator('xpath=ancestor::ul[1]');

    await expect(updatedContainer.getByText('Done')).toBeVisible();
    await expect(updatedContainer.getByText(updatedDescription)).toBeVisible();
  });

  test('removes a todo after clicking the delete icon', async ({ page }) => {
    const initialTodos: Todo[] = [
      {
        todo_id: 10,
        title: 'Write documentation',
        description: 'Document the public API surface',
        completed: false,
      },
      {
        todo_id: 11,
        title: 'Add regression tests',
        description: 'Increase frontend coverage to 80%',
        completed: false,
      },
    ];

    await setupTodoApiMock(page, initialTodos);
    await page.goto(FRONTEND_URL);

    const headings = page.getByRole('heading', { level: 3 });
    await expect(headings).toHaveCount(initialTodos.length);

    const firstDisplayedTitle = initialTodos[1].title;

    await page.getByTestId('DeleteIcon').first().click();

    await expect(headings).toHaveCount(initialTodos.length - 1);
    await expect(
      page.getByRole('heading', { name: firstDisplayedTitle })
    ).toHaveCount(0);
  });
});
