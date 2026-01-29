# API Contract - Barcode Scanner Web App (Phase 2)

## 1. Authentication

**Phương thức:** Bearer Token  
**Header yêu cầu:**  
http
Authorization: Bearer <token>

**Ghi chú:**  
- Token được cấp trong Phase 1 (không thêm hệ thống auth mới)  
- Token có hiệu lực trong 24 giờ  
- Token cần được refresh khi hết hạn (không xử lý refresh trong Phase 2)

---

## 2. API Endpoints

### 2.1 POST /api/barcodes - Lưu mã vạch
**Mục đích:** Lưu trữ dữ liệu mã vạch đã quét  
**Yêu cầu:**  

{
  "barcodeData": "string", // Dữ liệu mã vạch (EAN-13, QR, v.v.)
  "type": "string",         // Loại mã vạch (e.g. "QR", "EAN13")
  "metadata": {
    "device": "string",    // Thiết bị quét
    "location": "string"   // Vị trí quét (tùy chọn)
  }
}

**Trả về:**  

{
  "id": "string",          // ID tự sinh
  "barcodeData": "string",
  "type": "string",
  "metadata": {
    "device": "string",
    "location": "string"
  },
  "createdAt": "datetime", // ISO 8601
  "updatedAt": "datetime"
}

**Trạng thái:**  
- 201 Created: Tạo mới thành công  
- 400 Bad Request: Dữ liệu không hợp lệ  
- 409 Conflict: Mã vạch đã tồn tại  
- 500 Internal Server Error: Lỗi hệ thống

---

### 2.2 GET /api/barcodes - Lấy danh sách mã vạch
**Mục đích:** Lấy toàn bộ mã vạch đã lưu  
**Tham số truy vấn (tùy chọn):**  
http
?limit=100
?offset=0

**Trả về:**  

{
  "items": [
    {
      "id": "string",
      "barcodeData": "string",
      "type": "string",
      "metadata": {
        "device": "string",
        "location": "string"
      },
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "total": 1234
}

**Trạng thái:**  
- 200 OK: Thành công  
- 500 Internal Server Error: Lỗi hệ thống

---

### 2.3 GET /api/barcodes/:id - Lấy chi tiết mã vạch
**Mục đích:** Lấy thông tin chi tiết mã vạch theo ID  
**Trả về:**  

{
  "id": "string",
  "barcodeData": "string",
  "type": "string",
  "metadata": {
    "device": "string",
    "location": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}

**Trạng thái:**  
- 200 OK: Thành công  
- 404 Not Found: ID không tồn tại  
- 500 Internal Server Error: Lỗi hệ thống

---

### 2.4 DELETE /api/barcodes/:id - Xóa mã vạch
**Mục đích:** Xóa mã vạch theo ID  
**Trả về:**  

{
  "deletedId": "string",
  "deletedAt": "datetime"
}

**Trạng thái:**  
- 200 OK: Xóa thành công  
- 404 Not Found: ID không tồn tại  
- 500 Internal Server Error: Lỗi hệ thống

---

## 3. Error Handling

### 3.1 Định dạng lỗi chung

{
  "error": {
    "code": "string",      // Mã lỗi (e.g. "DUPLICATE_BARCODE")
    "message": "string",   // Thông báo lỗi (Tiếng Việt)
    "details": {
      "field": "string",   // Trường lỗi (nếu có)
      "value": "string"    // Giá trị gây lỗi (nếu có)
    }
  }
}

### 3.2 Mã lỗi cụ thể
| Code              | Message (Tiếng Việt)                     | Trạng thái |
|-------------------|------------------------------------------|------------|
| `INVALID_PAYLOAD` | Dữ liệu đầu vào không hợp lệ             | 400        |
| `DUPLICATE_BARCODE` | Mã vạch đã tồn tại trong hệ thống        | 409        |
| `NOT_FOUND`       | Mã vạch không tồn tại                    | 404        |
| `DB_WRITE_ERROR`  | Lỗi ghi dữ liệu vào cơ sở dữ liệu        | 500        |
| `API_TIMEOUT`     | Kết nối API vượt quá thời gian quy định  | 504        |
| `PERMISSION_DENIED` | Không có quyền truy cập tài nguyên     | 403        |

### 3.3 Ví dụ lỗi
**400 Bad Request (Dữ liệu không hợp lệ):**

{
  "error": {
    "code": "INVALID_PAYLOAD",
    "message": "Dữ liệu mã vạch không đúng định dạng",
    "details": {
      "field": "barcodeData",
      "value": "abc123"
    }
  }
}

**409 Conflict (Mã vạch trùng lặp):**

{
  "error": {
    "code": "DUPLICATE_BARCODE",
    "message": "Mã vạch đã tồn tại trong hệ thống",
    "details": {
      "field": "barcodeData",
      "value": "1234567890123"
    }
  }
}

**500 Internal Server Error (Lỗi hệ thống):**

{
  "error": {
    "code": "DB_WRITE_ERROR",
    "message": "Không thể ghi dữ liệu vào cơ sở dữ liệu",
    "details": {
      "error": "Connection refused"
    }
  }
}
