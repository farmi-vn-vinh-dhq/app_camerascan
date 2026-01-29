# Kế Hoạch Kiểm Thử (Test Plan) - Barcode Scanner Web App (Phase 1)

---

## 1. Test Strategy

### 1.1. Mục tiêu kiểm thử
- Đảm bảo tính năng **Scan → Lưu → Hiển thị → Copy** hoạt động chính xác theo yêu cầu.
- Kiểm tra tính ổn định và hiệu năng trên đa nền tảng (desktop/mobile, đa trình duyệt).
- Xác thực xử lý lỗi và tương tác người dùng thân thiện.

### 1.2. Phương pháp kiểm thử
- **Kiểm thử chức năng** (Functional Testing): Kiểm tra từng luồng nghiệp vụ theo yêu cầu.
- **Kiểm thử giao diện người dùng** (UI/UX Testing): Đảm bảo trải nghiệm mượt mà, không lỗi hiển thị.
- **Kiểm thử hiệu năng** (Performance Testing): Đo lường thời gian decode, lưu trữ và load dữ liệu.
- **Kiểm thử tương thích** (Compatibility Testing): Kiểm tra trên Chrome, Safari, Firefox, và trình duyệt di động.
- **Kiểm thử lỗi** (Error Handling Testing): Xác thực xử lý khi camera bị từ chối hoặc scan thất bại.

### 1.3. Công cụ hỗ trợ
- **Jest/Cypress**: Kiểm thử đơn vị và end-to-end.
- **BrowserStack**: Kiểm tra đa nền tảng.
- **Postman**: Kiểm thử API lưu trữ.
- **Lighthouse**: Đánh giá hiệu năng và khả năng tiếp cận.

---

## 2. Test Scope

### 2.1. Bao gồm (In Scope)
- Mở camera và quét mã vạch/QR.
- Lưu trữ mã vạch vào SQLite (kiểm tra tính duy nhất).
- Hiển thị danh sách mã vạch theo thời gian.
- Tính năng copy mã vạch lên clipboard.
- Xử lý lỗi: camera bị từ chối, scan thất bại.
- Hiệu năng: thời gian decode, lưu trữ, load dữ liệu.
- Tương thích đa trình duyệt và thiết bị di động.

### 2.2. Không bao gồm (Out of Scope)
- Tính năng xác thực người dùng (Auth).
- Đồng bộ dữ liệu đám mây.
- Tạo mã vạch (Generate).
- Thống kê, báo cáo nâng cao.

---

## 3. Test Cases

### TC-01: Kiểm thử quét và lưu mã vạch thành công
| **Bước** | **Hành động** | **Đầu vào** | **Kết quả kỳ vọng** |
|----------|----------------|-------------|----------------------|
| 1 | Mở ứng dụng trên desktop | - | Trang chủ hiển thị nút "Bắt đầu quét" |
| 2 | Nhấn "Bắt đầu quét" | - | Camera bật lên, hiển thị preview |
| 3 | Quét mã QR có nội dung "123456" | Mã QR hợp lệ | Hiển thị thông báo "Đã quét thành công: 123456" |
| 4 | Nhấn "Lưu" | - | Dữ liệu được lưu vào SQLite (kiểm tra qua DB) |
| 5 | Chuyển đến trang danh sách | - | Mã "123456" xuất hiện trong danh sách với thời gian hiện tại |

---

### TC-02: Kiểm thử xử lý lỗi khi camera bị từ chối
| **Bước** | **Hành động** | **Đầu vào** | **Kết quả kỳ vọng** |
|----------|----------------|-------------|----------------------|
| 1 | Mở ứng dụng trên mobile | - | Trang chủ hiển thị nút "Bắt đầu quét" |
| 2 | Nhấn "Bắt đầu quét" | Từ chối quyền camera | Hiển thị thông báo lỗi: "Không thể truy cập camera. Vui lòng cấp quyền..." |
| 3 | Nhấn "Thử lại" | - | Camera bật lên khi cấp quyền thành công |

---

## 4. Entry / Exit Criteria

### 4.1. Điều kiện vào (Entry Criteria)
- Code đã hoàn thành và build thành công.
- Môi trường kiểm thử (Next.js, SQLite, trình duyệt) đã sẵn sàng.
- Tài liệu yêu cầu (FRD) đã được phê duyệt.

### 4.2. Điều kiện ra (Exit Criteria)
- Tất cả test cases trong scope đạt **100% pass**.
- Không tồn tại **critical bug** (lỗi gây crash, mất dữ liệu).
- Hiệu năng đạt yêu cầu:
  - Decode mã vạch ≤ 1.5s.
  - API lưu trữ ≤ 200ms.
  - Load danh sách ≤ 100ms (dữ liệu < 5k bản ghi).
- Ứng dụng chạy ổn định trên Chrome desktop/mobile.
