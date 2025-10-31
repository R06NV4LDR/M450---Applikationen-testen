import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditModal } from '@/components/EditModal';
import * as Controller from '@/middleware/Controller';
import { Todo } from '@/types';
// use Jest globals provided by environment

// Mock the Controller module
jest.mock('@/middleware/Controller', () => ({
  updateTodo: jest.fn(),
}));

describe('EditModal Component', () => {
  const mockTodo: Todo = {
    todo_id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: '2023-10-31'
  };

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (Controller.updateTodo as jest.Mock).mockResolvedValue({});
  });

  it('renders edit button', () => {
    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);
    expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
  });

  it('opens modal when edit button is clicked', () => {
    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByTestId('EditIcon'));
    expect(screen.getByText('Edit Todo')).toBeInTheDocument();
  });

  it('shows pre-filled form with todo data', () => {
    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByTestId('EditIcon'));

    expect(screen.getByLabelText('Title')).toHaveValue('Test Todo');
    expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('submits form with updated data', async () => {
    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByTestId('EditIcon'));

    // Update form fields
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Todo' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Updated Description' },
    });
    fireEvent.click(screen.getByRole('checkbox'));

    // Submit form
    fireEvent.click(screen.getByText('Submit'));

    // Check if updateTodo was called with correct data
    await waitFor(() => {
      expect(Controller.updateTodo).toHaveBeenCalledWith({
        ...mockTodo,
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true,
      });
    });

    // Check if onUpdate callback was called with updated todo
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...mockTodo,
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true,
      });
    });
  });

  it('shows loading state during submission', async () => {
    // Mock a delayed response
    (Controller.updateTodo as jest.Mock).mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByTestId('EditIcon'));
    fireEvent.click(screen.getByText('Submit'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);

    // Open modal
    fireEvent.click(screen.getByTestId('EditIcon'));
    expect(screen.getByText('Edit Todo')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Edit Todo')).not.toBeInTheDocument();
  });

  it('preserves immutable fields when updating', async () => {
    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByTestId('EditIcon'));

    // Update only the title
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Todo' },
    });

    fireEvent.click(screen.getByText('Submit'));

    expect(Controller.updateTodo).toHaveBeenCalledWith({
      ...mockTodo,
      title: 'Updated Todo',
      createdAt: mockTodo.createdAt // Ensure createdAt is preserved
    });
  });

  it('submits even if title is empty (no client validation)', async () => {
    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByTestId('EditIcon'));

    // Clear the title field
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByText('Submit'));

    expect(Controller.updateTodo).toHaveBeenCalled();
  });

  it('handles multiple state updates correctly', async () => {
    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByTestId('EditIcon'));

    // Make multiple changes
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'First Update' },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Second Update' },
    });

    fireEvent.click(screen.getByText('Submit'));

    expect(Controller.updateTodo).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Second Update',
        completed: true
      })
    );
  });

  it('resets form state when reopening modal', () => {
    render(<EditModal todo={mockTodo} onUpdate={mockOnUpdate} />);

    // First interaction
    fireEvent.click(screen.getByTestId('EditIcon'));
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Changed Title' },
    });
    fireEvent.click(screen.getByText('Close'));

    // Reopen modal
    fireEvent.click(screen.getByTestId('EditIcon'));

    // Form should be reset to original todo values
    expect(screen.getByLabelText('Title')).toHaveValue(mockTodo.title);
    expect(screen.getByLabelText('Description')).toHaveValue(mockTodo.description);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
