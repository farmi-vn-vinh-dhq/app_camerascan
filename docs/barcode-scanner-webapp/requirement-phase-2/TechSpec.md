# GIẢI PHÁP KỸ THUẬT - PHASE 2: BARCODE SCANNER WEB APP (CODE REVIEW & TESTING)

---

## 1. Tổng quan kỹ thuật

**Mục tiêu Phase 2**:
- Đảm bảo chất lượng mã nguồn đạt chuẩn production
- Tối ưu kiến trúc và cấu trúc module
- Đạt coverage test ≥ 70% cho logic core
- Xử lý lỗi critical và ổn định flow chính
- Chuẩn hóa quy trình kiểm thử và logging

**Các hoạt động trọng tâm**:
- Code review toàn diện theo 4 cấp độ (architectural, design, implementation, style)
- Tách biệt rõ ràng các layer: UI, service, data access
- Tối ưu test coverage với 3 cấp độ: unit, integration, e2e
- Xây dựng hệ thống logging cấu hình hóa
- Tối ưu performance cho flow chính

---

## 2. Kiến trúc hệ thống

### 2.1 Cấu trúc phân tầng

[UI Layer]
├── Components (React)
├── Hooks (Custom)
├── Pages
└── Styles

[Service Layer]
├── BarcodeService (Scan/Decode)
├── BarcodeStorageService (DB)
├── ApiService (HTTP client)

[Data Layer]
├── SQLite (Local DB)
└── In-memory cache

[Test Layer]
├── Unit Tests (Jest/Vitest)
├── API Tests (supertest)
├── Component Tests (React Testing Library)
└── E2E Tests (Playwright)

### 2.2 Mô hình kết nối
- UI Layer → Service Layer (1-way dependency)
- Service Layer → Data Layer (1-way dependency)
- Test Layer có thể mock bất kỳ layer nào
- Logging được inject qua dependency injection

---

## 3. Công nghệ sử dụng

| Loại       | Công nghệ                          | Mục đích sử dụng                          |
|------------|------------------------------------|------------------------------------------|
| **Testing** | Jest/Vitest                        | Unit test, API test                      |
|            | React Testing Library              | Component test                           |
|            | Supertest                          | API integration test                     |
| **Code Quality** | ESLint + Prettier               | Linting và format code                   |
| **Type Safety** | TypeScript 4.9+                 | Kiểm soát kiểu dữ liệu                   |
| **Logging** | Winston (dev) / Pino (prod)       | Structured logging                       |
| **Mocking** | Jest Mock, MSW                    | Mock API và service                      |

---

## 4. Luồng xử lý chính

### 4.1 Flow chính: Scan → Save → List → Copy
mermaid
graph TD
    A[Camera Access] --> B{Decode Success?}
    B -->|Yes| C[Validate Duplicate]
    B -->|No| D[Show Error]
    C -->|New| E[Save to DB]
    C -->|Duplicate| F[Show Warning]
    E --> G[Update UI List]
    G --> H[Copy to Clipboard]

### 4.2 Flow lỗi
mermaid
graph TD
    A[Camera Denied] --> B[Show Permission Error]
    C[Decode Failed] --> D[Show Scan Error]
    E[DB Write Failed] --> F[Log & Show DB Error]
    G[API Timeout] --> H[Show Network Error]

### 4.3 Test Scenario
| Scenario               | Expected Result                          | Test Type         |
|------------------------|------------------------------------------|-------------------|
| Scan thành công         | Lưu vào DB và hiển thị trong list         | E2E + API         |
| Scan trùng lặp          | Cảnh báo và không lưu lại               | Unit + Component |
| Camera bị từ chối       | Hiển thị lỗi quyền truy cập              | Mock + UI       |
| Decode lỗi định dạng    | Hiển thị thông báo lỗi                  | Unit + Component |
| Batch save 500 items    | Tối đa 200ms latency                     | Performance Test |

---

## 5. Logging & Monitoring

### 5.1 Cấu trúc log chuẩn

{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "error",
  "service": "BarcodeService",
  "message": "Decode failed",
  "meta": {
    "errorCode": "DECODE_001",
    "input": "invalid_barcode",
    "stack": "..."
  }
}

### 5.2 Logging strategy
| Level    | Khi nào sử dụng                          | Vị trí log                          |
|----------|------------------------------------------|-------------------------------------|
| error    | Lỗi critical (crash, DB fail)            | Console + File                      |
| warn     | Cảnh báo logic (duplicate, invalid)      | Console                              |
| info     | Flow chính (save, scan)                  | Console (dev)                        |
| debug    | Debug logic (decode, validation)         | Console (khi bật debug flag)         |

### 5.3 Monitoring
- **Error tracking**: Sử dụng Sentry (nếu có) hoặc tự xây hệ thống tracking lỗi
- **Performance metrics**: Đo thời gian xử lý từng step (scan, decode, save)
- **Health check**: API endpoint `/health` kiểm tra trạng thái DB và service

---

## 6. Kế hoạch triển khai

### 6.1 Phân chia công việc
| Nhóm           | Nhiệm vụ chính                          | Deliverable                          |
|----------------|------------------------------------------|--------------------------------------|
| Tech Reviewer  | Review kiến trúc và code                 | Danh sách refactor task              |
| QA Engineer    | Viết test case và thực hiện kiểm thử     | Test report + bug report             |
| Developer      | Refactor code, viết test, fix bug        | PR với coverage ≥ 70%                |

### 6.2 Timeline (ước lượng)
| Tuần | Công việc                              | Mốc đạt được                         |
|------|----------------------------------------|--------------------------------------|
| 1    | Code review + refactor                 | Fix high priority issues             |
| 2    | Viết unit test + API test              | Coverage đạt 70%                     |
| 3    | Viết component test + e2e test         | Flow chính ổn định                   |
| 4    | Tối ưu performance + hoàn thiện logging| Đạt DOD Phase 2                      |

---

## 7. Rủi ro & Giải pháp

| Rủi ro                          | Giải pháp                                |
|---------------------------------|------------------------------------------|
| Coverage test không đạt         | Tách nhỏ component, viết mock chi tiết   |
| Lỗi dependency cycle            | Sử dụng dependency inversion pattern     |
| Test case không cover hết case  | Tạo matrix test scenario từ FR           |
| Performance không đạt           | Tối ưu batch processing và caching      |
