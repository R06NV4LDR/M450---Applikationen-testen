/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CreateTodoModal } from "@/components/CreateTodoModal";
import * as Controller from "@/middleware/Controller";
// use Jest globals provided by environment

jest.mock("@/middleware/Controller", () => ({
    createTodo: jest.fn(),
    getTodos: jest.fn(),
}));

const mockedController = Controller as unknown as jest.Mocked<typeof Controller>;

describe("CreateTodoModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("opens modal when add icon is clicked and shows form", () => {
        const { container } = render(<CreateTodoModal onCreate={jest.fn()} />);

        const icon = container.querySelector("#createNewTaskIcon");
        expect(icon).toBeTruthy();

        fireEvent.click(icon!);

        // Modal title should be rendered
        expect(screen.getByText("Create Todo")).toBeTruthy();

        // Form fields should be present
        expect(screen.getByLabelText("Title")).toBeTruthy();
        expect(screen.getByLabelText("Description")).toBeTruthy();
        // Checkbox has aria-label "secondary checkbox"
        expect(screen.getByLabelText("secondary checkbox")).toBeTruthy();
    });

    test("submits form, calls createTodo and onCreate with created todo", async () => {
        const onCreate = jest.fn();
        render(<CreateTodoModal onCreate={onCreate} />);

        // open modal
        const icon = document.querySelector("#createNewTaskIcon")!;
        fireEvent.click(icon);

        // fill form
        const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
        const descInput = screen.getByLabelText("Description") as HTMLInputElement;
        const checkbox = screen.getByLabelText("secondary checkbox") as HTMLInputElement;
        const submitButton = screen.getByRole("button", { name: /submit/i });

        fireEvent.change(titleInput, { target: { value: "Test title" } });
        fireEvent.change(descInput, { target: { value: "Test desc" } });
        fireEvent.click(checkbox); // mark completed true

        const newTodoPayload = {
            title: "Test title",
            description: "Test desc",
            completed: true,
        };

        const createdTodo = {
            id: 123,
            ...newTodoPayload,
        };

        mockedController.createTodo.mockResolvedValueOnce({ data: createdTodo } as any);

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockedController.createTodo).toHaveBeenCalledTimes(1);
            expect(mockedController.createTodo).toHaveBeenCalledWith(newTodoPayload);
            expect(onCreate).toHaveBeenCalledTimes(1);
            expect(onCreate).toHaveBeenCalledWith(createdTodo);
        });

        // after submit the modal should be closed (title not present)
        await waitFor(() => {
            expect(screen.queryByText("Create Todo")).toBeNull();
        });
    });

    test("shows error state when API call fails", async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const onCreate = jest.fn();
        
        mockedController.createTodo.mockRejectedValueOnce(new Error("API Error"));
        
        render(<CreateTodoModal onCreate={onCreate} />);
        
        // Open modal
        fireEvent.click(document.querySelector("#createNewTaskIcon")!);
        
        // Fill and submit form
        fireEvent.change(screen.getByLabelText("Title"), { 
            target: { value: "Test title" } 
        });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(mockedController.createTodo).toHaveBeenCalledTimes(1);
            expect(onCreate).not.toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalled();
        });

        consoleSpy.mockRestore();
    });

    test("submitting empty form still calls API (no client validation)", async () => {
        const onCreate = jest.fn();
        render(<CreateTodoModal onCreate={onCreate} />);

        // Open modal
        fireEvent.click(document.querySelector("#createNewTaskIcon")!);

        // Mock API to succeed so component doesn't error
        mockedController.createTodo.mockResolvedValueOnce({ data: { id: 1, title: '', description: '', completed: false } } as any);

        // Submit empty form
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(mockedController.createTodo).toHaveBeenCalled();
        });
    });

    test("closes modal and resets form", async () => {
        const onCreate = jest.fn();
        render(<CreateTodoModal onCreate={onCreate} />);

        // Open modal
        fireEvent.click(document.querySelector("#createNewTaskIcon")!);

        // Fill form
        fireEvent.change(screen.getByLabelText("Title"), { 
            target: { value: "Test title" } 
        });

        // Close modal
        fireEvent.click(screen.getByText("Close"));

        // Reopen modal and check if form is reset
        fireEvent.click(document.querySelector("#createNewTaskIcon")!);
        
        expect((screen.getByLabelText("Title") as HTMLInputElement).value).toBe("");
    });

    test("handles loading state correctly", async () => {
        const onCreate = jest.fn();
        
        // Mock a delayed response
        mockedController.createTodo.mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve({ data: {} } as any), 100))
        );

        render(<CreateTodoModal onCreate={onCreate} />);

        // Open modal and submit
        fireEvent.click(document.querySelector("#createNewTaskIcon")!);
        fireEvent.change(screen.getByLabelText("Title"), { 
            target: { value: "Test title" } 
        });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        // Check loading state
                expect(screen.getByText("Loading...")).toBeTruthy();
                // toBeDisabled matcher typings can be missing in TS; check button disabled state directly
                expect((screen.getByRole("button", { name: /loading/i }) as HTMLButtonElement).disabled).toBe(true);

        await waitFor(() => {
            expect(screen.queryByText("Loading...")).toBeNull();
        });
    });
});
