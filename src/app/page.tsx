import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-3xl font-bold">Barcode Scanner</h1>
      <p className="max-w-md text-center text-gray-600">
        Quét mã vạch / QR code, lưu trữ và quản lý nhanh chóng.
      </p>
      <div className="flex gap-4">
        <Link
          href="/scan"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Bắt đầu quét
        </Link>
        <Link
          href="/history"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100 transition-colors"
        >
          Xem lịch sử
        </Link>
      </div>
    </main>
  );
}
