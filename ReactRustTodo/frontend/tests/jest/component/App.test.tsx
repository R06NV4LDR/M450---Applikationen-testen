// App.test.tsx
import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../../../src/App";

jest.mock("./components/Todos", () => ({
  __esModule: true,
  default: () => <div data-testid="todos">Todos component</div>,
}));

jest.mock("./providers/BoxProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="box">{children}</div>
  ),
}));

const HEALTH_URL = "http://127.0.0.1:8080/api/health";

describe("<App />", () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    // @ts-expect-error – we’re intentionally replacing the global
    global.fetch = fetchMock;
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    (console.error as jest.Mock).mockRestore();
    global.fetch = originalFetch as any;
    jest.clearAllMocks();
  });

  test("renders Todos when health check succeeds with the expected message", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Everything is working fine" }),
    });

    render(<App />);

    // Initially, before fetch resolves, the fallback error heading is rendered
    expect(
      screen.getByRole("heading", { name: "Error wihthin the API" })
    ).toBeInTheDocument();

    // After fetch resolves with the expected message, main content appears
    expect(await screen.findByText("Todo with a Rust Backend!")).toBeInTheDocument();
    expect(screen.getByText("Todos:")).toBeInTheDocument();
    expect(screen.getByTestId("todos")).toBeInTheDocument();

    // And the error heading should no longer be present
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Error wihthin the API" })
      ).not.toBeInTheDocument();
    });
  });

  test("shows error UI when health check returns non-OK response", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "does not matter" }),
    });

    render(<App />);

    // Error heading should remain because status is never set
    expect(
      await screen.findByRole("heading", { name: "Error wihthin the API" })
    ).toBeInTheDocument();

    // Console error should have been called
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });

    // No Todos visible
    expect(screen.queryByTestId("todos")).not.toBeInTheDocument();
  });

  test("shows error UI when JSON shape is unexpected (no message)", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // missing 'message'
    });

    render(<App />);

    // Still shows error heading
    expect(
      await screen.findByRole("heading", { name: "Error wihthin the API" })
    ).toBeInTheDocument();

    // Logs a useful error about unexpected data
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Response data was not as expected:",
        {}
      );
    });
  });

  test("calls the health endpoint exactly once on mount with the right URL", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Everything is working fine" }),
    });

    render(<App />);

    await screen.findByText("Todo with a Rust Backend!");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(HEALTH_URL);
  });
});
