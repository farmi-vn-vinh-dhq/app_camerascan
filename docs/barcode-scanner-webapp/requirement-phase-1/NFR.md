# Yêu Cầu Phi Chức Năng – Barcode Scanner Web App (Phase 1)

## 1. Hiệu Năng (Performance)
| Yêu cầu | Giá trị | Phương pháp kiểm thử |
|---------|---------|----------------------|
| Decode barcode | ≤ 1.5 giây | Benchmark trên Chrome desktop với 100 test case |
| API lưu barcode (local) | ≤ 200ms | Load testing với 1000 request/s |
| Load danh sách barcode (≤ 5k bản ghi) | ≤ 100ms | Benchmark với 5k bản ghi trong SQLite |
| Khởi tạo camera | ≤ 3 giây | Đo thời gian từ click button đến khi preview hiển thị |

## 2. Bảo Mật (Security)
| Yêu cầu | Mô tả | Phương pháp kiểm thử |
|---------|-------|----------------------|
| Bảo vệ dữ liệu | Mã hóa SQLite file (AES-256) | Kiểm tra bằng tool decryption |
| Ngăn SQL injection | Validate input trước khi lưu | Test với payload SQL injection |
| Ngăn XSS | Encode output khi hiển thị | Scan bằng OWASP ZAP |
| Quyền camera | Yêu cầu xác nhận từ người dùng | Kiểm tra flow cấp quyền trên Chrome/Safari |

## 3. Khả Năng Mở Rộng (Scalability)
| Yêu cầu | Mốc | Phương pháp kiểm thử |
|---------|-----|----------------------|
| Dữ liệu | Hỗ trợ ≥ 50k bản ghi | Test với 50k bản ghi trong SQLite |
| Tốc độ load | Giữ ≤ 500ms với 50k bản ghi | Benchmark tăng dần số lượng bản ghi |
| Camera đa thiết bị | Hỗ trợ ≥ 5 loại mobile device | Test trên 5 thiết bị Android/iOS phổ biến |

## 4. Khả Dụng (Availability)
| Yêu cầu | Mô tả | Phương pháp kiểm thử |
|---------|-------|----------------------|
| Xử lý lỗi camera | Hiển thị thông báo thay vì crash | Test với quyền camera bị từ chối |
| Xử lý lỗi scan | Cho phép quét lại mà không reset | Test 10 lần scan thất bại liên tiếp |
| Khôi phục trạng thái | Giữ dữ liệu sau khi reload | Test reload trang và kiểm tra dữ liệu |
| Tỷ lệ thành công | ≥ 99.5% trong 1000 lần scan | Thống kê lỗi trong 1000 test case |

## 5. Tuân Thủ (Compliance)
| Yêu cầu | Tiêu chuẩn | Phương pháp kiểm thử |
|---------|-----------|----------------------|
| Quyền riêng tư | Tuân thủ GDPR (dữ liệu local) | Kiểm tra policy về dữ liệu lưu trữ |
| Tiêu chuẩn web | Hỗ trợ W3C HTML5 | Validate code với W3C Validator |
| Truy cập thiết bị | Tuân thủ WebRTC spec | Test trên Chrome/Safari/Firefox |
| Mã nguồn mở | Không có license conflict | Scan dependency với Snyk |
