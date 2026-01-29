import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScanResult } from "@/components/ScanResult";

describe("ScanResult", () => {
  const defaultProps = {
    code: "SCAN001",
    format: "QR_CODE" as string | null,
    isSaving: false,
    onSave: vi.fn(),
    onCancel: vi.fn(),
  };

  it("renders scanned code value", () => {
    render(<ScanResult {...defaultProps} />);
    expect(screen.getByText("SCAN001")).toBeInTheDocument();
  });

  it("renders success heading", () => {
    render(<ScanResult {...defaultProps} />);
    expect(screen.getByText(/quét thành công/i)).toBeInTheDocument();
  });

  it("shows format badge when format provided", () => {
    render(<ScanResult {...defaultProps} />);
    expect(screen.getByText("QR_CODE")).toBeInTheDocument();
  });

  it("hides format badge when format is null", () => {
    render(<ScanResult {...defaultProps} format={null} />);
    expect(screen.queryByText("QR_CODE")).not.toBeInTheDocument();
  });

  it("calls onSave when save button clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ScanResult {...defaultProps} onSave={onSave} />);
    await user.click(screen.getByText("Lưu"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ScanResult {...defaultProps} onCancel={onCancel} />);
    await user.click(screen.getByText("Hủy"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows loading text when saving", () => {
    render(<ScanResult {...defaultProps} isSaving={true} />);
    expect(screen.getByText("Đang lưu...")).toBeInTheDocument();
  });

  it("disables buttons when saving", () => {
    render(<ScanResult {...defaultProps} isSaving={true} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});
