import { test, expect } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('textbox')).toBeVisible();
  });

  test('frontend loads and displays the todo application', async ({ page }) => {
    // Check that the page title or main heading is visible
    await expect(page).toHaveTitle(/Todo/i);
    
    // Verify the main container or form is present
    const todoInput = page.getByRole('textbox');
    await expect(todoInput).toBeVisible();
  });

  test('can add a new todo via UI', async ({ page }) => {
    // Fill in the todo input field
    const todoInput = page.getByRole('textbox');
    const testTodoText = `Test todo ${Date.now()}`;
    
    await todoInput.fill(testTodoText);

    const createResponse = page.waitForResponse(response =>
      response.url().endsWith('/api/todos') && response.request().method() === 'POST'
    );
    await page.keyboard.press('Enter');
    expect((await createResponse).ok()).toBe(true);
    await expect(page.getByText(testTodoText)).toBeVisible();
  });

  test('can toggle todo completion status', async ({ page }) => {
    // First, add a todo
    const todoInput = page.getByRole('textbox');
    const testTodoText = `Toggle test ${Date.now()}`;
    
    await todoInput.fill(testTodoText);
    const createResponse = page.waitForResponse(response =>
      response.url().endsWith('/api/todos') && response.request().method() === 'POST'
    );
    await page.keyboard.press('Enter');
    expect((await createResponse).ok()).toBe(true);

    const todoItem = page.getByText(testTodoText).locator('..');
    const updateResponse = page.waitForResponse(response =>
      response.url().includes('/api/todos/') && response.request().method() === 'PUT'
    );
    await todoItem.getByRole('button', { name: 'Set as done' }).click();
    expect((await updateResponse).ok()).toBe(true);
    await expect(todoItem.getByText('This todo is done')).toBeVisible();
  });
});

test.describe('Backend API Tests', () => {
  test('GET /api/todos returns todos list', async ({ request }) => {
    const response = await request.get('/api/todos');
    
    expect(response.status()).toBe(200);
    
    const todos = await response.json();
    expect(Array.isArray(todos)).toBe(true);
  });

  test('POST /api/todos creates a new todo', async ({ request }) => {
    const newTodo = {
      text: `API test todo ${Date.now()}`,
      done: false
    };
    
    const response = await request.post('/api/todos', {
      data: newTodo
    });
    
    expect(response.status()).toBe(201);
    
    const createdTodo = await response.json();
    expect(createdTodo.text).toBe(newTodo.text);
    expect(createdTodo).toHaveProperty('_id');
  });

  test('GET /api/statistics returns added_todos count from Redis', async ({ request }) => {
    // First, create a todo to increment the counter
    await request.post('/api/todos', {
      data: { text: 'Stats test todo', done: false }
    });
    
    // Then check statistics
    const response = await request.get('/api/statistics');
    
    expect(response.status()).toBe(200);
    
    const stats = await response.json();
    expect(stats).toHaveProperty('added_todos');
    expect(typeof stats.added_todos).toBe('number');
    expect(stats.added_todos).toBeGreaterThan(0);
  });

  test('PUT /api/todos/:id updates a todo', async ({ request }) => {
    // First create a todo
    const createResponse = await request.post('/api/todos', {
      data: { text: 'Update test todo', done: false }
    });
    const createdTodo = await createResponse.json();
    
    // Then update it
    const updateResponse = await request.put(`/api/todos/${createdTodo._id}`, {
      data: { text: 'Updated todo text', done: true }
    });
    
    expect(updateResponse.status()).toBe(200);
    
    const updatedTodo = await updateResponse.json();
    expect(updatedTodo.text).toBe('Updated todo text');
    expect(updatedTodo.done).toBe(true);
  });
});
