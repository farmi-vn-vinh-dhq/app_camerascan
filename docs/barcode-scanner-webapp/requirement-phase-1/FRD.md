# Barcode Scanner Web App - Phase 1

## 1. Tổng quan chức năng
Ứng dụng web fullstack xây dựng trên **Next.js** cho phép người dùng:
- Mở camera từ trình duyệt
- Quét mã vạch/QR code theo thời gian thực
- Lưu ID quét được vào SQLite
- Hiển thị danh sách mã đã quét và hỗ trợ sao chép nhanh

**Phase 1 tập trung vào luồng cơ bản**:  
`Quét → Lưu → Hiển thị → Sao chép`

---

## 2. Danh sách chức năng

| ID     | Tên chức năng                  | Mô tả chi tiết                                                                 |
|--------|-------------------------------|-------------------------------------------------------------------------------|
| FR-01  | Mở camera                     | Cho phép truy cập camera từ trình duyệt, quét mã vạch/QR code, hiển thị kết quả |
| FR-02  | Hiển thị kết quả quét         | Hiển thị giá trị mã vạch, cho phép xác nhận lưu trữ                             |
| FR-03  | Lưu mã vạch                   | Gọi API lưu mã vạch vào SQLite với các trường `code`, `format`, `created_at`  |
| FR-04  | Hiển thị danh sách mã         | Trang danh sách mã đã quét, sắp xếp theo thời gian mới nhất                   |
| FR-05  | Sao chép mã                   | Hỗ trợ sao chép mã vạch từ giao diện, hiển thị thông báo thành công            |
| FR-06  | Xử lý lỗi                     | Xử lý lỗi camera, lỗi quét, không gây crash ứng dụng                          |

---

## 3. Business Rules

| Rule ID | Mô tả chi tiết                                                                 |
|---------|-------------------------------------------------------------------------------|
| BR-01   | Mã vạch (`code`) phải duy nhất trong cơ sở dữ liệu                            |
| BR-02   | Tự động debounce 500ms giữa các lần quét liên tiếp để tránh trùng lặp          |
| BR-03   | Danh sách mã vạch luôn được sắp xếp theo `created_at` (mới nhất lên đầu)       |
| BR-04   | Chỉ hỗ trợ quét mã vạch/QR code, không hỗ trợ loại mã khác                    |
| BR-05   | Ứng dụng không yêu cầu xác thực người dùng (Phase 1)                          |

---

## 4. Validation Rules

| Validation ID | Điều kiện kiểm tra                                               | Hành động khi lỗi                                     |
|---------------|------------------------------------------------------------------|-------------------------------------------------------|
| VR-01         | Kiểm tra quyền truy cập camera                                  | Hiển thị thông báo hướng dẫn nếu quyền bị từ chối    |
| VR-02         | Kiểm tra kết quả quét có chứa giá trị hợp lệ                     | Không lưu nếu giá trị trống, cho phép quét lại        |
| VR-03         | Kiểm tra mã vạch đã tồn tại trong SQLite                          | Hiển thị cảnh báo và không lưu nếu trùng              |
| VR-04         | Kiểm tra kết nối API khi lưu mã vạch                             | Hiển thị lỗi mạng nếu API không phản hồi              |
| VR-05         | Kiểm tra tính khả dụng của chức năng sao chép (clipboard API)   | Hiển thị thông báo lỗi nếu không hỗ trợ              |

---

**Ghi chú:**  
- Tài liệu này là nguồn tham chiếu duy nhất cho Phase 1  
- Không bao gồm tính năng xác thực, đồng bộ đám mây, hay tích hợp hệ thống bên ngoài
