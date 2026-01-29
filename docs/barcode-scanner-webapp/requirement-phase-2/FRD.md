# Phân Tích Yêu Cầu - Barcode Scanner Web App (Phase 2)

## 1. Tổng quan chức năng
Phase 2 tập trung vào đánh giá chất lượng mã nguồn, kiểm thử và ổn định hệ thống cho ứng dụng quét mã vạch. Mục tiêu chính là đảm bảo:
- Code sạch, kiến trúc đúng
- Test coverage ≥ 70% cho logic cốt lõi
- Không lỗi logic quan trọng
- Sẵn sàng triển khai nội bộ

## 2. Danh sách chức năng

| ID     | Tên chức năng                          | Mô tả ngắn gọn                                                                 |
|--------|----------------------------------------|---------------------------------------------------------------------------------|
| FR-01  | Review cấu trúc code                   | Đánh giá folder structure, separation of concerns, API/UI layer               |
| FR-02  | Chuẩn hóa convention                   | Áp dụng TypeScript, ESLint, Prettier                                          |
| FR-03  | Refactor code                          | Loại bỏ duplicate logic, tách component/service                               |
| FR-04  | Viết unit test                         | Test parser, validation, service logic                                        |
| FR-05  | Viết API test                          | Kiểm thử POST/GET endpoint với các case success/invalid/duplicate             |
| FR-06  | Kiểm thử component                     | Test render list, nút copy, hiển thị lỗi                                      |
| FR-07  | Test flow end-to-end                   | Quét → lưu → hiển thị → copy                                                  |
| FR-08  | Kiểm tra xử lý lỗi                     | Đảm bảo UI không crash khi lỗi camera, decode, DB                             |
| FR-09  | Đo lường performance                   | Kiểm tra latency API, render 5k record                                        |
| FR-10  | Bổ sung logging                        | Thêm log cấu trúc, lỗi scan, lỗi DB                                           |

## 3. Business Rules
1. **Kiến trúc code**:
   - Không circular dependency
   - Tách biệt layer API/UI/service
   - Component không chứa logic DB

2. **Chuẩn coding**:
   - Dùng TypeScript với typing đầy đủ
   - Không dùng `any` không kiểm soát
   - Quy tắc đặt tên theo Prettier

3. **Kiểm thử**:
   - Phải dùng Jest/Vitest + React Testing Library
   - API test phải mock DB error
   - Không test camera thật

4. **Độ bảo trì**:
   - File < 300 dòng
   - Hàm < 50 dòng
   - Có JSDoc cho logic cốt lõi

## 4. Validation Rules
1. **Code quality**:
   - ESLint + Prettier phải pass
   - Không dead code/unused import
   - Không console.log trong production

2. **Test coverage**:
   - Unit test ≥ 70% logic core
   - API test phải cover 4 case: success, invalid, duplicate, DB error
   - Component test phải render đúng 4 trạng thái

3. **Error handling**:
   - UI không crash khi:
     - Camera denied
     - Decode thất bại
     - DB write fail
     - API timeout

4. **Performance**:
   - Render 5k record trong < 2s
   - API latency local < 200ms
   - Batch scan 100 item trong < 1s

5. **Logging**:
   - Có structured log cho API
   - Ghi log lỗi scan và DB
   - Có debug flag cho dev

6. **Định nghĩa hoàn thành**:
   - Fix tất cả issue mức High
   - Refactor task chính hoàn tất
   - Không còn bug Critical
   - Scan flow ổn định qua 4 test case
