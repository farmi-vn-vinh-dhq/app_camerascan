# API Contract - Barcode Scanner Web App (Phase 1)

## 1. Authentication
**Không yêu cầu xác thực** (Phase 1 không có auth/user account).  
Tất cả endpoint có thể truy cập công khai.

---

## 2. API Endpoints

### 2.1 POST /api/barcodes - Lưu barcode
**Mục đích**: Lưu barcode đã quét vào SQLite.  
**Request**:

{
  "code": "string", // Bắt buộc
  "format": "string" // Tùy chọn (ví dụ: "QR_CODE", "EAN_13")
}

**Response thành công (201 Created)**:

{
  "id": "string", // ID tự sinh
  "code": "string",
  "format": "string",
  "createdAt": "datetime"
}

**Response lỗi**:
- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ.
- **409 Conflict**: Barcode `code` đã tồn tại trong DB.
- **500 Internal Server Error**: Lỗi hệ thống.

---

### 2.2 GET /api/barcodes - Lấy danh sách barcode
**Mục đích**: Lấy danh sách barcode đã lưu (sắp xếp theo `created_at` giảm dần).  
**Request**: Không yêu cầu body.

**Response thành công (200 OK)**:

{
  "data": [
    {
      "id": "string",
      "code": "string",
      "format": "string",
      "createdAt": "datetime"
    }
  ]
}

**Response lỗi**:
- **500 Internal Server Error**: Lỗi hệ thống.

---

## 3. Error Handling

### 3.1 Mã lỗi HTTP
| Mã lỗi | Mô tả | Ghi chú |
|--------|-------|---------|
| 201    | Tạo mới thành công | Sau POST /api/barcodes |
| 200    | Lấy dữ liệu thành công | Sau GET /api/barcodes |
| 400    | Dữ liệu đầu vào không hợp lệ | Ví dụ: thiếu `code` |
| 409    | Barcode đã tồn tại | Kiểm tra ràng buộc `UNIQUE` trên `code` |
| 500    | Lỗi hệ thống | Xử lý lỗi bất ngờ từ backend |

### 3.2 Định dạng lỗi

{
  "error": "string", // Mô tả lỗi
  "code": "string" // Mã lỗi (tùy chọn)
}

**Ví dụ**:

{
  "error": "Barcode '123456' đã tồn tại",
  "code": "DUPLICATE_CODE"
}

---

## Ghi chú kỹ thuật
- **SQLite**: Sử dụng Prisma ORM để quản lý DB.
- **Kiểm tra trùng lặp**: Trường `code` có ràng buộc `UNIQUE`.
- **Hiệu năng**: API save < 200ms, load list < 100ms (dưới 5k bản ghi).
