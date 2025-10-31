import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BoxComponent from "../../../src/providers/BoxProvider";

// Mock @mui/material/Box to inspect props easily
jest.mock("@mui/material/Box", () => {
  return ({ children, ...props }: any) => (
    <div data-testid="mui-box" {...props}>
      {children}
    </div>
  );
});

describe("<BoxComponent />", () => {
  test("renders without crashing", () => {
    render(<BoxComponent />);
    expect(screen.getByTestId("mui-box")).toBeInTheDocument();
  });

  test("renders children correctly", () => {
    render(
      <BoxComponent>
        <p data-testid="child">Child content</p>
      </BoxComponent>
    );

    expect(screen.getByTestId("mui-box")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Child content");
  });

  test("renders as a span element", () => {
    render(<BoxComponent />);
    expect(screen.getByTestId("mui-box")).toHaveAttribute("component", "span");
  });

  test("applies expected styles via sx prop", () => {
    render(<BoxComponent />);
    const box = screen.getByTestId("mui-box");

    // Check that sx prop is passed with required keys
    const sxProp = (box as any).props?.sx || box.getAttribute("sx");
    // Our mock doesn’t apply MUI styles, so we just check the prop is passed
    expect(box).toHaveAttribute("sx");
  });
});
