import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BarcodeList } from "@/components/BarcodeList";
import type { BarcodeResponse } from "@/types/barcode";

const MOCK_BARCODES: BarcodeResponse[] = [
  { id: 1, code: "ABC123", format: "QR_CODE", createdAt: "2024-01-02T00:00:00Z" },
  { id: 2, code: "DEF456", format: null, createdAt: "2024-01-01T00:00:00Z" },
];

describe("BarcodeList", () => {
  it("renders empty state when no barcodes", () => {
    render(<BarcodeList barcodes={[]} copySuccess={null} onCopy={vi.fn()} />);
    expect(screen.getByText(/chưa có mã vạch/i)).toBeInTheDocument();
  });

  it("renders all barcode items", () => {
    render(<BarcodeList barcodes={MOCK_BARCODES} copySuccess={null} onCopy={vi.fn()} />);
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("DEF456")).toBeInTheDocument();
  });

  it("shows format badge when format exists", () => {
    render(<BarcodeList barcodes={MOCK_BARCODES} copySuccess={null} onCopy={vi.fn()} />);
    expect(screen.getByText("QR_CODE")).toBeInTheDocument();
  });

  it("shows copy buttons for each item", () => {
    render(<BarcodeList barcodes={MOCK_BARCODES} copySuccess={null} onCopy={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("calls onCopy when copy button clicked", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<BarcodeList barcodes={MOCK_BARCODES} copySuccess={null} onCopy={onCopy} />);

    const firstCopyBtn = screen.getByLabelText("Sao chép ABC123");
    await user.click(firstCopyBtn);
    expect(onCopy).toHaveBeenCalledWith("ABC123");
  });

  it("shows 'Đã sao chép' for the copied item", () => {
    render(<BarcodeList barcodes={MOCK_BARCODES} copySuccess="ABC123" onCopy={vi.fn()} />);
    expect(screen.getByText(/đã sao chép/i)).toBeInTheDocument();
  });

  it("shows formatted dates", () => {
    const { container } = render(
      <BarcodeList barcodes={MOCK_BARCODES} copySuccess={null} onCopy={vi.fn()} />
    );
    const timeElements = container.querySelectorAll("time");
    expect(timeElements).toHaveLength(2);
  });
});
