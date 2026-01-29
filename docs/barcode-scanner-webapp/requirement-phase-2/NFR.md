# Yêu Cầu Phi Chức Năng - Barcode Scanner Web App (Phase 2)

## 1. Performance (Hiệu Năng)
| Yêu cầu | Đo lường | Kiểm thử |
|---------|----------|----------|
| **Thời gian phản hồi API** | ≤ 500ms cho các endpoint POST/GET | Sử dụng supertest/fetch test đo latency trung bình 100 lần gọi |
| **Tốc độ xử lý batch scan** | ≤ 2 giây cho 100 barcode | Tạo test case batch scan 100 item liên tiếp |
| **Hiệu năng render danh sách** | ≤ 1 giây render 5.000 item | Sử dụng Performance API đo thời gian render với 5.000 record giả lập |
| **Tối ưu bộ nhớ** | Không rò rỉ memory trong 5 phút chạy liên tục | Sử dụng Chrome DevTools Memory Profiler kiểm tra leak |

## 2. Security (Bảo Mật)
| Yêu cầu | Đo lường | Kiểm thử |
|---------|----------|----------|
| **Xử lý lỗi an toàn** | Không hiển thị thông tin hệ thống nhạy cảm | Kiểm tra thông báo lỗi không chứa stack trace, DB connection string |
| **Kiểm tra đầu vào** | 100% input được validate trước xử lý | Sử dụng test case với payload chứa SQL injection/XSS pattern |
| **Bảo vệ endpoint** | Không cho phép truy cập không xác thực | Kiểm tra HTTP status 401 khi gọi API không có token (nếu có) |
| **Lưu trữ an toàn** | Không lưu trữ barcode nhạy cảm | Kiểm tra logic validation từ chối lưu barcode có pattern nhạy cảm |

## 3. Scalability (Khả Năng Mở Rộng)
| Yêu cầu | Đo lường | Kiểm thử |
|---------|----------|----------|
| **Xử lý dữ liệu lớn** | Hỗ trợ ≥ 10.000 record trong DB | Tạo test case insert 10.000 record và kiểm tra thời gian truy vấn |
| **Kiến trúc module hóa** | Không có dependency vòng tròn | Sử dụng tools như madge kiểm tra circular dependency |
| **Tách biệt layer** | API layer không phụ thuộc UI | Kiểm tra codebase không có import từ UI component vào service layer |
| **Khả năng mở rộng logic** | Thêm 1 feature giả lập trong 2 giờ | Tạo test case thêm 1 service mới không ảnh hưởng hệ thống hiện tại |

## 4. Availability (Tính Cấp Cứu)
| Yêu cầu | Đo lường | Kiểm thử |
|---------|----------|----------|
| **Không crash UI** | 100% kịch bản lỗi không làm crash app | Kiểm tra 100% error case (camera denied, decode fail, DB error) không làm UI crash |
| **Tự phục hồi** | Tự động retry 3 lần khi API timeout | Kiểm tra logic retry với mock API trả về 503 3 lần liên tiếp |
| **Uptime** | ≥ 99.9% trong 24h test liên tục | Sử dụng tool như UptimeRobot kiểm tra tính khả dụng |
| **Phục hồi nhanh** | Tự động fallback khi camera không hoạt động | Kiểm tra chuyển sang chế độ manual input khi camera bị deny |

## 5. Compliance (Tuân Thủ)
| Yêu cầu | Đo lường | Kiểm thử |
|---------|----------|----------|
| **Tuân thủ chuẩn code** | ESLint/Prettier pass 100% | Chạy ESLint/Prettier trên toàn bộ codebase |
| **Ghi chú code** | 100% service/core logic có JSDoc | Kiểm tra thông qua static analysis |
| **Logging cấu trúc** | 100% log có format JSON | Kiểm tra log file có chứa field: timestamp, level, message, context |
| **Không log production** | Không có console.log trong build | Kiểm tra build production bằng source map hoặc code scanning |
