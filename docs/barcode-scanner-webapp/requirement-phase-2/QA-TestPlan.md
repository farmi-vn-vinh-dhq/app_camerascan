# KẾ HOẠCH TEST - BARCODE SCANNER WEB APP (PHASE 2)

## 1. Test Strategy

| Mục tiêu | Chi tiết |
|---------|----------|
| **Phạm vi kiểm thử** | Tập trung vào code review, kiểm thử logic core, và đảm bảo hệ thống ổn định |
| **Phương pháp** | - Code review toàn diện<br>- Tách biệt layer để dễ mock test<br>- Sử dụng Jest/Vitest cho unit test<br>- React Testing Library cho component test<br>- supertest cho API test |
| **Công cụ** | - Jest/Vitest<br>- React Testing Library<br>- supertest<br>- ESLint/Prettier |
| **Độ bao phủ** | - Unit test ≥ 70% core logic<br>- API test 100% endpoint<br>- Component test cho các UI element quan trọng |
| **Đánh giá chất lượng** | - Không lỗi Critical<br>- Không crash UI<br>- Đạt chuẩn code quality (ESLint pass, không dead code) |

---

## 2. Test Scope

### 2.1 In Scope
- Code review toàn bộ codebase
- Unit test cho: barcode parser, validation logic, save service
- API test cho: POST/GET endpoint, xử lý lỗi
- Component test cho: list render, copy button, error message
- Integration test cho flow scan → save → list → copy
- Kiểm thử error handling (camera denied, decode fail, DB error)
- Kiểm tra performance cơ bản (render 5k record, batch save)

### 2.2 Out of Scope
- Thêm feature mới
- Thay đổi UI/UX lớn
- Thêm hệ thống auth
- Thay đổi database engine
- Triển khai production

---

## 3. Test Cases

### TC-01: Kiểm thử luồng scan → save → list → copy (Success Flow)
- **Mô tả**: Kiểm tra flow chính của ứng dụng khi scan thành công
- **Precondition**: Camera mock trả về barcode hợp lệ
- **Steps**:
  1. Mở trang scan
  2. Scan barcode hợp lệ
  3. Xác nhận lưu vào DB
  4. Kiểm tra hiển thị trong danh sách
  5. Copy giá trị barcode
- **Expected Result**:
  - Barcode được lưu thành công
  - Hiển thị đúng trong danh sách
  - Copy thành công không lỗi
- **Priority**: High

### TC-02: Kiểm thử lỗi camera denied
- **Mô tả**: Xử lý khi người dùng từ chối cấp quyền camera
- **Precondition**: Camera mock trả về lỗi permission denied
- **Steps**:
  1. Mở trang scan
  2. Từ chối quyền camera
  3. Kiểm tra thông báo lỗi
- **Expected Result**:
  - Hiển thị thông báo lỗi "Không thể truy cập camera"
  - Không crash UI
  - Không lưu bất kỳ dữ liệu nào
- **Priority**: Critical

---

## 4. Entry / Exit Criteria

### Entry Criteria
1. Codebase Phase 1 đã hoàn thiện và chạy ổn định
2. Repo đã được chuẩn hóa (ESLint/Prettier pass)
3. Môi trường test đã sẵn sàng (mock camera, DB)
4. Test cases đã được thiết kế đầy đủ

### Exit Criteria
1. Tất cả test case được thực hiện và pass
2. Code review hoàn tất, fix tất cả issue mức High
3. Unit test coverage ≥ 70% core logic
4. API test pass 100% endpoint
5. Không tồn tại bug mức Critical
6. Không crash UI trong mọi scenario test
7. ESLint + Prettier pass toàn bộ codebase
8. Scan flow ổn định qua 30 lần test liên tiếp
