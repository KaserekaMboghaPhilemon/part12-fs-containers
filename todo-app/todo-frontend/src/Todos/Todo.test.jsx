// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Todo from './Todo'

afterEach(cleanup)

describe('Todo', () => {
  it('renders an incomplete todo and calls its actions', () => {
    const todo = { _id: 'todo-1', text: 'Write a component test', done: false }
    const deleteTodo = vi.fn()
    const completeTodo = vi.fn()

    render(<Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />)

    expect(screen.getByText(todo.text)).toBeTruthy()
    expect(screen.getByText('This todo is not done')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Set as done' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(completeTodo).toHaveBeenCalledWith(todo)
    expect(deleteTodo).toHaveBeenCalledWith(todo)
  })

  it('shows completed status without the completion action', () => {
    const todo = { _id: 'todo-2', text: 'Keep tests passing', done: true }

    render(<Todo todo={todo} deleteTodo={vi.fn()} completeTodo={vi.fn()} />)

    expect(screen.getByText('This todo is done')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Set as done' })).toBeNull()
  })
})