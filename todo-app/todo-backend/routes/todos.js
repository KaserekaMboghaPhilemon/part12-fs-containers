const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  try {
    req.todo = await Todo.findById(id)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformed id' })
    }
    return next(error)
  }
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res, next) => {
  try {
    await req.todo.deleteOne();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

/* GET todo. */
singleRouter.get('/', (req, res) => {
  res.json(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.todo._id,
      { text, done },
      { new: true, runValidators: true, context: 'query' }
    )

    if (updatedTodo) {
      res.json(updatedTodo)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: 'bad request' })
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
