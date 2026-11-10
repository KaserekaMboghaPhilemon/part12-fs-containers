const express = require('express');
const router = express.Router();
const { Todo } = require('../mongo');
const redis = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({});
  res.json(todos);
});

/* POST todo. */
router.post('/', async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    done: false
  });

  const savedTodo = await todo.save();

  // Exercise 10: Increment 'added_todos' counter in Redis
  const currentCount = await redis.get('added_todos');
  const newCount = (currentCount ? parseInt(currentCount, 10) : 0) + 1;
  await redis.set('added_todos', newCount);

  res.status(201).json(savedTodo);
});

const singleRouter = express.Router({ mergeParams: true });

singleRouter.get('/', async (req, res) => {
  res.json(req.todo);
});

singleRouter.delete('/', async (req, res, next) => {
  try {
    await req.todo.deleteOne();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;
  req.todo.text = text;
  req.todo.done = done;
  const updatedTodo = await req.todo.save();
  res.json(updatedTodo);
});

router.use('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    req.todo = await Todo.findById(id);
    if (!req.todo) return res.sendStatus(404);
    next();
  } catch (error) {
    next(error);
  }
}, singleRouter);

module.exports = router;