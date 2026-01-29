# KIẾN TRÚC KỸ THUẬT - BARCODE SCANNER WEB APP (PHASE 1)

---

## 1. Tổng quan kỹ thuật

| Thành phần | Mô tả |
|-----------|-------|
| **Kiến trúc** | Fullstack Next.js (App Router) + SQLite |
| **Luồng chính** | Scan → Decode → Save → Display → Copy |
| **Điểm nổi bật** | Camera browser-based, Prisma ORM, debounce logic, responsive design |
| **Giới hạn** | Không auth, không cloud, không dashboard |

---

## 2. Kiến trúc hệ thống

┌────────────────────┐
│     Frontend       │
│  (Next.js App)     │
├────────────────────┤
│ - Camera Component │
│ - Scan Result UI   │
│ - Barcode List UI  │
│ - Copy Button      │
└────────────────────┘
          │
          ▼
┌────────────────────┐
│     Backend        │
│  (Next.js API)     │
├────────────────────┤
│ - Scan API         │
│ - Save API         │
│ - List API         │
└────────────────────┘
          │
          ▼
┌────────────────────┐
│     Database       │
│  (SQLite + Prisma) │
├────────────────────┤
│ - Table: barcodes  │
│   (code, format,   │
│    created_at)     │
└────────────────────┘

---

## 3. Công nghệ sử dụng

| Lớp | Công nghệ | Lý do |
|-----|-----------|-------|
| **Frontend** | Next.js 13+ App Router | Hỗ trợ SSR, routing tĩnh, hiệu năng tốt |
| **Camera** | `react-qr-reader` + `jsQR` | Thư viện browser-native, không cần backend |
| **UI** | Tailwind CSS | Responsive, dễ maintain |
| **Backend** | Next.js API Routes | Tích hợp liền mạch với frontend |
| **Database** | SQLite + Prisma ORM | Nhẹ, phù hợp local storage, dễ triển khai |
| **Logging** | `winston` + `pino` | Ghi log lỗi và hoạt động hệ thống |
| **Monitoring** | `next telemetry` + custom metrics | Theo dõi hiệu năng API và thời gian scan |

---

## 4. Luồng xử lý chính

### 4.1 Luồng Scan → Save

mermaid
graph TD
    A[User mở camera] --> B[Camera preview]
    B --> C[Scan barcode/QR]
    C --> D{Decode thành công?}
    D -->|Yes| E[Hiển thị kết quả]
    D -->|No| F[Thông báo lỗi]
    E --> G[User xác nhận lưu]
    G --> H[API /api/save]
    H --> I[Prisma lưu vào SQLite]
    I --> J[Trả về thành công]
    J --> K[Hiển thị danh sách cập nhật]

### 4.2 Luồng Copy

mermaid
graph TD
    A[User click nút Copy] --> B[navigator.clipboard.writeText()]
    B --> C[Hiển thị toast "Copied!"]

---

## 5. Logging & Monitoring

### 5.1 Logging

| Level | Nội dung | Vị trí |
|-------|----------|--------|
| **Error** | Lỗi camera, lỗi decode, lỗi DB | `error.log` |
| **Warn** | Camera denied, scan fail liên tiếp | `warning.log` |
| **Info** | Scan success, save success | `access.log` |
| **Debug** | Chi tiết decode, query DB | `debug.log` (dev mode) |

### 5.2 Monitoring

| Chỉ số | Mốc | Công cụ |
|--------|-----|---------|
| Decode time | < 1.5s | `performance.now()` |
| API latency | < 200ms | `next telemetry` |
| DB query time | < 100ms | Prisma debug logs |
| Memory usage | < 512MB | `process.memoryUsage()` |
| Uptime | 99.9% | `pm2` + health check endpoint |

---

## 6. Mapping Yêu cầu Sang Kiến Trúc

| Yêu cầu | Thành phần |
|---------|------------|
| **FR-01: Camera Scan** | `react-qr-reader` + `getUserMedia` |
| **FR-02: Scan Result Preview** | State management (React Context) |
| **FR-03: Save Barcode** | Prisma model + `/api/save` endpoint |
| **FR-04: Barcode List** | `/api/list` + SWR caching |
| **FR-05: Copy Barcode** | `navigator.clipboard` + toast notification |
| **FR-06: Error Handling** | Try-catch + fallback UI |
| **Performance** | `useMemo`, `useCallback`, Prisma query optimization |
| **Responsive** | Tailwind CSS breakpoints + aspect-ratio |
| **Unique Constraint** | Prisma unique index trên `code` |

---

## 7. Triển khai chi tiết

### 7.1 Frontend

ts
// pages/scan.tsx
'use client'
import { useState, useEffect } from 'react'
import { QrReader } from 'react-qr-reader'

export default function ScanPage() {
  const [result, setResult] = useState('')
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    // Load history from localStorage
    const saved = localStorage.getItem('barcodes')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const handleScan = (data: string | null) => {
    if (data && !history.includes(data)) {
      setResult(data)
      setHistory(prev => [data, ...prev])
      localStorage.setItem('barcodes', JSON.stringify([data, ...prev]))
    }
  }

  return (
    <div className="p-4">
      <QrReader 
        onResult={handleScan}
        constraints={{ facingMode: 'environment' }}
      />
      {result && (
        <div className="mt-4 p-4 bg-green-100">
          <p>Scanned: {result}</p>
          <button 
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-2 bg-blue-500 text-white px-4 py-2"
          >
            Copy
          </button>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-bold">History</h2>
        <ul>
          {history.map((code, i) => (
            <li key={i} className="flex justify-between items-center p-2 border-b">
              <span>{code}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-sm bg-gray-200 px-2"
              >
                Copy
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

### 7.2 Backend (SQLite + Prisma)

prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Barcode {
  id        Int      @id @default(autoincrement())
  code      String   @unique
  format    String?
  createdAt DateTime @default(now())
}

ts
// app/api/save/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { code } = await req.json()
    
    const existing = await prisma.barcode.findUnique({
      where: { code }
    })

    if (existing) {
      return NextResponse.json({ success: false, message: 'Already exists' })
    }

    await prisma.barcode.create({
      data: { code }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

### 7.3 Logging Implementation

ts
// utils/logger.ts
import { createLogger, transports, format } from 'winston'

export const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
  )
})

---

## 8. Triển khai & Test

### 8.1 Môi trường phát triển

bash
# Cài đặt dependencies
npm install react-qr-reader jsQR prisma @prisma/client

# Khởi tạo Prisma
npx prisma init
npx prisma migrate dev --name init

# Chạy dev server
npm run dev

### 8.2 Test case

| Test Case | Mô tả | Expected |
|----------|-------|----------|
| TC01 | Mở camera trên Chrome desktop | Hiển thị preview |
| TC02 | Scan QR code hợp lệ | Hiển thị kết quả và lưu vào DB |
| TC03 | Scan trùng lặp | Không lưu lại |
| TC04 | Từ chối quyền camera | Hiển thị thông báo lỗi |
| TC05 | Scan khi không có ánh sáng | Decode thất bại |
| TC06 | Copy từ UI | Toast "Copied!" |
| TC07 | Load danh sách > 5k record | Thời gian < 100ms |

---

## 9. Rủi ro & Giải pháp

| Rủi ro | Giải pháp |
|--------|-----------|
| Camera không hoạt động trên mobile | Thử nghiệm với `getUserMedia` và fallback UI |
| Decode chậm trên Safari | Tối ưu thư viện `jsQR` |
| SQLite không scale được | Giữ dataset < 10k record |
| Lỗi unique constraint | Xử lý client-side trước khi gọi API |
| Memory leak | Dùng `useEffect` cleanup camera stream |

---

## 10. Kế hoạch phát triển

| Phase | Nội dung |
|-------|----------|
| **Phase 1** | Hoàn thành luồng cơ bản |
| **Phase 2** | Thêm export CSV, filter danh sách |
| **Phase 3** | Thêm auth và cloud sync |
