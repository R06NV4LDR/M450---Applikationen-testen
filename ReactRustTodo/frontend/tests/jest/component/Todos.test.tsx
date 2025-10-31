/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as Controller from "@/middleware/Controller";
import Todos from '@/components/Todos';
import { act } from 'react';
// use Jest globals provided by environment

// Mock the Controller module
jest.mock('@/middleware/Controller', () => ({
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}));
const mockTodos = [
  {
    todo_id: 1,
    title: 'Test Todo 1',
    description: 'Description 1',
    createdAt: '2023-10-31',
    completed: false
  },
  {
    todo_id: 2,
    title: 'Test Todo 2',
    description: 'Description 2',
    createdAt: '2023-10-31',
    completed: true
  }
];

// Mock fetch globally
(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockTodos),
  })
) as unknown as typeof fetch;

describe('Todos Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders todos correctly', async () => {
    await act(async () => {
      render(<Todos />);
    });

    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('shows "No todos" when there are no todos', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    await act(async () => {
      render(<Todos />);
    });

    expect(screen.getByText('No todos')).toBeInTheDocument();
  });

  it('handles todo deletion', async () => {
    await act(async () => {
      render(<Todos />);
    });

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    fireEvent.click(deleteButtons[0]);

    expect(Controller.deleteTodo).toHaveBeenCalledWith(1);
  });

  it('handles todo status update', async () => {
    await act(async () => {
      render(<Todos />);
    });

    const statusIcons = screen.getAllByTestId(/AssignmentLateIcon|CheckIcon/);
    fireEvent.click(statusIcons[0]);

    expect(Controller.updateTodo).toHaveBeenCalledWith(expect.objectContaining({
      todo_id: 1,
      completed: true
    }));
  });

  it('handles pagination correctly', async () => {
    const manyTodos = Array.from({ length: 15 }, (_, i) => ({
      todo_id: i + 1,
      title: `Todo ${i + 1}`,
      description: `Description ${i + 1}`,
      createdAt: '2023-10-31',
      completed: false
    }));

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(manyTodos),
      })
    );

    await act(async () => {
      render(<Todos />);
    });

    // First page should show first 10 todos
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 10')).toBeInTheDocument();
    expect(screen.queryByText('Todo 11')).not.toBeInTheDocument();

    // Click on next page
    const nextPageButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextPageButton);

    // Second page should show remaining todos
    expect(screen.getByText('Todo 11')).toBeInTheDocument();
    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    await act(async () => {
      render(<Todos />);
    });

    expect(screen.getByText('No todos')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('updates todo status correctly', async () => {
    await act(async () => {
      render(<Todos />);
    });

    const initialStatusIcon = screen.getAllByTestId('AssignmentLateIcon')[0];
    fireEvent.click(initialStatusIcon);

    await waitFor(() => {
      expect(Controller.updateTodo).toHaveBeenCalledWith(
        expect.objectContaining({
          todo_id: 1,
          completed: true
        })
      );
    });
  });

  it('handles pagination navigation with first and last buttons', async () => {
    const manyTodos = Array.from({ length: 25 }, (_, i) => ({
      todo_id: i + 1,
      title: `Todo ${i + 1}`,
      description: `Description ${i + 1}`,
      createdAt: '2023-10-31',
      completed: false
    }));

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(manyTodos),
      })
    );

    await act(async () => {
      render(<Todos />);
    });

    const lastPageButton = screen.getByLabelText('Go to last page');
    fireEvent.click(lastPageButton);

    await waitFor(() => {
      expect(screen.getByText('Todo 21')).toBeInTheDocument();
      expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
    });

    const firstPageButton = screen.getByLabelText('Go to first page');
    fireEvent.click(firstPageButton);

    await waitFor(() => {
      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.queryByText('Todo 21')).not.toBeInTheDocument();
    });
  });
});
