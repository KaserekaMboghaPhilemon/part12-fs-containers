# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: todo-app.spec.js >> Backend API Tests >> GET /api/statistics returns added_todos count from Redis
- Location: tests\todo-app.spec.js:86:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 502
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Todo App E2E Tests', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Navigate to the app before each test
  6   |     await page.goto('/');
  7   |   });
  8   | 
  9   |   test('frontend loads and displays the todo application', async ({ page }) => {
  10  |     // Check that the page title or main heading is visible
  11  |     await expect(page).toHaveTitle(/Todo/i);
  12  |     
  13  |     // Verify the main container or form is present
  14  |     const todoInput = page.getByRole('textbox');
  15  |     await expect(todoInput).toBeVisible();
  16  |   });
  17  | 
  18  |   test('can add a new todo via UI', async ({ page }) => {
  19  |     // Fill in the todo input field
  20  |     const todoInput = page.getByRole('textbox');
  21  |     const testTodoText = `Test todo ${Date.now()}`;
  22  |     
  23  |     await todoInput.fill(testTodoText);
  24  |     
  25  |     // Submit the form (look for submit button or press Enter)
  26  |     await page.keyboard.press('Enter');
  27  |     
  28  |     // Wait a moment for the todo to be added
  29  |     await page.waitForTimeout(500);
  30  |     
  31  |     // Verify the todo appears in the list
  32  |     await expect(page.getByText(testTodoText)).toBeVisible();
  33  |   });
  34  | 
  35  |   test('can toggle todo completion status', async ({ page }) => {
  36  |     // First, add a todo
  37  |     const todoInput = page.getByRole('textbox');
  38  |     const testTodoText = `Toggle test ${Date.now()}`;
  39  |     
  40  |     await todoInput.fill(testTodoText);
  41  |     await page.keyboard.press('Enter');
  42  |     await page.waitForTimeout(500);
  43  |     
  44  |     // Find and click the checkbox or completion button
  45  |     const todoItem = page.locator(`text=${testTodoText}`).locator('..');
  46  |     const checkbox = todoItem.getByRole('checkbox').or(todoItem.getByRole('button', { name: /complete|done|check/i }));
  47  |     
  48  |     if (await checkbox.count() > 0) {
  49  |       await checkbox.first().click();
  50  |       await page.waitForTimeout(500);
  51  |       
  52  |       // Verify the todo's state changed (could be strikethrough, different class, etc.)
  53  |       // This is a basic check - actual implementation may vary
  54  |       await expect(todoItem).toBeVisible();
  55  |     }
  56  |   });
  57  | });
  58  | 
  59  | test.describe('Backend API Tests', () => {
  60  |   test('GET /api/todos returns todos list', async ({ request }) => {
  61  |     const response = await request.get('/api/todos');
  62  |     
  63  |     expect(response.status()).toBe(200);
  64  |     
  65  |     const todos = await response.json();
  66  |     expect(Array.isArray(todos)).toBe(true);
  67  |   });
  68  | 
  69  |   test('POST /api/todos creates a new todo', async ({ request }) => {
  70  |     const newTodo = {
  71  |       text: `API test todo ${Date.now()}`,
  72  |       done: false
  73  |     };
  74  |     
  75  |     const response = await request.post('/api/todos', {
  76  |       data: newTodo
  77  |     });
  78  |     
  79  |     expect(response.status()).toBe(200);
  80  |     
  81  |     const createdTodo = await response.json();
  82  |     expect(createdTodo.text).toBe(newTodo.text);
  83  |     expect(createdTodo).toHaveProperty('_id');
  84  |   });
  85  | 
  86  |   test('GET /api/statistics returns added_todos count from Redis', async ({ request }) => {
  87  |     // First, create a todo to increment the counter
  88  |     await request.post('/api/todos', {
  89  |       data: { text: 'Stats test todo', done: false }
  90  |     });
  91  |     
  92  |     // Then check statistics
  93  |     const response = await request.get('/api/statistics');
  94  |     
> 95  |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  96  |     
  97  |     const stats = await response.json();
  98  |     expect(stats).toHaveProperty('added_todos');
  99  |     expect(typeof stats.added_todos).toBe('number');
  100 |     expect(stats.added_todos).toBeGreaterThan(0);
  101 |   });
  102 | 
  103 |   test('PUT /api/todos/:id updates a todo', async ({ request }) => {
  104 |     // First create a todo
  105 |     const createResponse = await request.post('/api/todos', {
  106 |       data: { text: 'Update test todo', done: false }
  107 |     });
  108 |     const createdTodo = await createResponse.json();
  109 |     
  110 |     // Then update it
  111 |     const updateResponse = await request.put(`/api/todos/${createdTodo._id}`, {
  112 |       data: { text: 'Updated todo text', done: true }
  113 |     });
  114 |     
  115 |     expect(updateResponse.status()).toBe(200);
  116 |     
  117 |     const updatedTodo = await updateResponse.json();
  118 |     expect(updatedTodo.text).toBe('Updated todo text');
  119 |     expect(updatedTodo.done).toBe(true);
  120 |   });
  121 | });
  122 | 
```