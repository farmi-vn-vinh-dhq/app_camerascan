# Tài liệu Yêu cầu Kinh doanh (BRD) - Web App Quét Barcode Pha 1

## 1. Mục tiêu kinh doanh
- **Tối ưu hóa quy trình thu thập dữ liệu** bằng cách tự động hóa việc quét và lưu trữ mã vạch/QR code
- **Giảm thiểu sai sót** trong quá trình nhập liệu thủ công
- **Nâng cao hiệu suất vận hành** cho nhân viên vận hành thông qua giao diện trực quan
- **Tạo nền tảng dữ liệu** cho các giai đoạn phát triển tiếp theo của hệ thống

## 2. Stakeholders
| Vai trò | Mô tả | Vai trò chính |
|--------|-------|---------------|
| **Scanner User** | Nhân viên vận hành trực tiếp | Sử dụng ứng dụng để quét mã, xem lịch sử và sao chép dữ liệu |
| **IT Department** | Đơn vị triển khai | Đảm bảo tính khả dụng và hiệu năng hệ thống |
| **Management** | Ban lãnh đạo | Đánh giá hiệu quả và lên kế hoạch mở rộng |

## 3. Phạm vi nghiệp vụ
### In-scope
- Quét mã vạch/QR code thời gian thực qua camera trình duyệt
- Lưu trữ dữ liệu quét vào cơ sở dữ liệu SQLite
- Hiển thị danh sách mã đã quét theo thời gian
- Tính năng sao chép nhanh mã vào clipboard
- Hỗ trợ đa nền tảng (desktop + mobile)

### Out-of-scope
- Hệ thống xác thực người dùng
- Đồng bộ dữ liệu đám mây
- Tích hợp với hệ thống bên ngoài
- Tạo mã vạch mới
- Thống kê và báo cáo nâng cao

## 4. KPI & Success Metrics
| Chỉ số | Mốc kỳ vọng | Mô tả |
|--------|-------------|-------|
| **Tỷ lệ thành công quét** | ≥ 95% | Tỷ lệ mã được giải mã chính xác |
| **Thời gian phản hồi** | ≤ 1.5s | Thời gian từ khi bắt đầu quét đến khi hiển thị kết quả |
| **Tỷ lệ lỗi xử lý** | ≤ 2% | Tỷ lệ lỗi trong các trường hợp camera bị từ chối hoặc quét sai |
| **Tỷ lệ sử dụng** | ≥ 80% | Tỷ lệ nhân viên vận hành sử dụng ứng dụng thay vì phương pháp thủ công |

## 5. Ràng buộc & Giả định
### Ràng buộc
- **Kỹ thuật**: 
  - Ứng dụng phải chạy trên Next.js App Router
  - Cơ sở dữ liệu SQLite cục bộ
  - Không yêu cầu xác thực người dùng
- **Nghiệp vụ**:
  - Không hỗ trợ đa người dùng
  - Không tích hợp hệ thống bên ngoài

### Giả định
- Người dùng đồng ý cấp quyền truy cập camera
- Điều kiện ánh sáng phù hợp để quét mã
- Dữ liệu quét có quy mô nhỏ (dưới 5.000 bản ghi)
- Ứng dụng được triển khai trong môi trường nội bộ hoặc cục bộ

---

**Lưu ý**: Tài liệu này là nguồn thông tin duy nhất cho giai đoạn 1, không bao gồm các tính năng mở rộng như phân quyền, đồng bộ đám mây hoặc phân tích dữ liệu.
