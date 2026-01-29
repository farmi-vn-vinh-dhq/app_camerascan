import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "@/components/Toast";

describe("Toast", () => {
  it("renders message text", () => {
    render(<Toast message="Saved!" type="success" onClose={vi.fn()} />);
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });

  it("has alert role", () => {
    render(<Toast message="msg" type="success" onClose={vi.fn()} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Toast message="msg" type="error" onClose={onClose} />);
    await user.click(screen.getByLabelText("Đóng"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("auto-dismisses after duration", async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast message="msg" type="warning" onClose={onClose} durationMs={1000} />);

    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("applies success styling", () => {
    render(<Toast message="ok" type="success" onClose={vi.fn()} />);
    const el = screen.getByRole("alert");
    expect(el.className).toContain("bg-green");
  });

  it("applies error styling", () => {
    render(<Toast message="err" type="error" onClose={vi.fn()} />);
    const el = screen.getByRole("alert");
    expect(el.className).toContain("bg-red");
  });
});
