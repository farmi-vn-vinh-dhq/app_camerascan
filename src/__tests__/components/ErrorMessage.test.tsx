import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorMessage } from "@/components/ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message text", () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("has alert role for accessibility", () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows retry button when onRetry provided", () => {
    render(<ErrorMessage message="Error" onRetry={vi.fn()} />);
    expect(screen.getByText(/thử lại/i)).toBeInTheDocument();
  });

  it("hides retry button when onRetry not provided", () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.queryByText(/thử lại/i)).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    await user.click(screen.getByText(/thử lại/i));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
