```mermaid
erDiagram
    BARCODE ||--o{ SCAN_SESSION : "belongs to"
    ERROR_LOG ||--o{ BARCODE : "related to"
    ERROR_LOG ||--o{ SCAN_SESSION : "related to"

    BARCODE {
        uuid id PK
        string code UNIQUE
        string type
        datetime created_at
        uuid scan_session_id FK
    }

    SCAN_SESSION {
        uuid id PK
        datetime started_at
        datetime ended_at
        integer total_barcodes
    }

    ERROR_LOG {
        uuid id PK
        string error_type
        string message
        datetime timestamp
        uuid barcode_id FK
        uuid scan_session_id FK
    }
```
## 1. Danh sách entity

| Tên entity      | Mô tả ngắn gọn                              |
|-----------------|---------------------------------------------|
| `Barcode`       | Lưu trữ thông tin mã vạch đã quét          |
| `ScanSession`   | Quản lý phiên quét mã vạch                 |
| `ErrorLog`      | Ghi lại các lỗi hệ thống trong quá trình quét |

## 2. Thuộc tính chính

### Barcode
- `id`: UUID (Primary Key)
- `code`: Chuỗi mã vạch (Unique)
- `type`: Kiểu mã vạch (QR, EAN-13, v.v.)
- `created_at`: Thời gian tạo bản ghi
- `scan_session_id`: Tham chiếu đến phiên quét

### ScanSession
- `id`: UUID (Primary Key)
- `started_at`: Thời gian bắt đầu phiên quét
- `ended_at`: Thời gian kết thúc phiên quét (có thể null nếu đang diễn ra)
- `total_barcodes`: Tổng số mã vạch trong phiên

### ErrorLog
- `id`: UUID (Primary Key)
- `error_type`: Loại lỗi (camera_denied, decode_fail, db_write_fail, api_timeout)
- `message`: Mô tả lỗi
- `timestamp`: Thời gian xảy ra lỗi
- `barcode_id`: Tham chiếu đến mã vạch liên quan (nếu có)
- `scan_session_id`: Tham chiếu đến phiên quét liên quan (nếu có)

## 3. Quan hệ dữ liệu

1. **1:N**  
   `ScanSession` có thể chứa nhiều `Barcode`  
   (1 phiên quét → nhiều mã vạch)

2. **0..1:N**  
   `ErrorLog` có thể liên quan đến 1 `Barcode` hoặc `ScanSession`  
   (Lỗi có thể thuộc về mã vạch cụ thể hoặc phiên quét)

3. **N:1**  
   `Barcode` thuộc về 1 `ScanSession`  
   (Mỗi mã vạch chỉ thuộc 1 phiên quét)

---

**Ghi chú:**  
- Tất cả quan hệ có thể mở rộng để hỗ trợ tracking lỗi chi tiết hơn trong Phase 2.  
- `error_type` sử dụng enum để chuẩn hóa loại lỗi.  
- `code` của `Barcode` có ràng buộc unique để tránh trùng lặp.
