# BARCODE SCANNER WEB APP - PHASE 1

## 1. Tổng quan sản phẩm
Web ứng dụng Next.js full-stack giúp người dùng quét mã vạch/QR, lưu trữ và trích xuất dữ liệu nhanh chóng.  
**Giá trị cốt lõi**: Tối ưu hóa quy trình quét mã trong môi trường nội bộ với giao diện đơn giản, không yêu cầu đăng nhập.  
**Đối tượng sử dụng**: Nhân viên vận hành, kiểm kê, hoặc nhân viên bán lẻ cần xử lý mã vạch nhanh.

---

## 2. Mục tiêu & KPI
### Mục tiêu
- Xây dựng luồng quét-mã-lưu-trích xuất hoàn chỉnh trong 1 ứng dụng.
- Đảm bảo trải nghiệm liền mạch trên desktop và mobile.

### KPI thành công
| Chỉ số        | Mốc đạt | Phương pháp đo lường |
|---------------|---------|----------------------|
| Tỷ lệ quét thành công | ≥ 95%   | Số lần quét thành công / tổng số lần quét |
| Thời gian lưu mã      | ≤ 200ms | Đo thời gian từ quét đến lưu thành công |
| Tỷ lệ lỗi camera      | ≤ 5%    | Số lần từ chối quyền camera / tổng số người dùng |
| Tỷ lệ hài lòng người dùng | ≥ 80%   | Khảo sát nhanh sau khi dùng thử |

---

## 3. Personas người dùng
### **Scanner User** (Người quét mã)
- **Vai trò**: Nhân viên kiểm kê, bán hàng, hoặc logistics.
- **Đặc điểm**:
  - Sử dụng thiết bị di động/desktop có camera.
  - Không có kỹ năng IT chuyên sâu.
  - Cần tốc độ và độ chính xác cao.
- **Đau điểm**:
  - Phải ghi chép thủ công mã vạch.
  - Không có hệ thống đồng bộ dữ liệu.

---

## 4. Use Cases chính
1. **Quét mã vạch/QR**  
   - Người dùng mở camera → quét mã → hệ thống nhận diện và hiển thị kết quả.
2. **Lưu trữ mã đã quét**  
   - Mã được lưu vào SQLite với thông tin thời gian và định dạng.
3. **Hiển thị danh sách mã**  
   - Danh sách mã được sắp xếp theo thời gian, hỗ trợ copy nhanh.
4. **Xử lý lỗi**  
   - Cảnh báo khi không cấp quyền camera hoặc quét sai định dạng.

---

## 5. In-scope / Out-of-scope
### **In-scope**
- Quét mã thực thời, lưu trữ SQLite, hiển thị và copy mã.
- Hỗ trợ desktop và mobile browser (Chrome, Safari, Firefox).
- Giao diện đơn giản, không yêu cầu đăng nhập.

### **Out-of-scope**
- Tài khoản người dùng, phân quyền.
- Đồng bộ dữ liệu đám mây.
- Tạo mã vạch, in mã, hoặc dashboard thống kê.
- Xử lý ảnh quét từ file.

---

## 6. Phụ thuộc & rủi ro
### **Phụ thuộc**
- **Cấp quyền camera**: Người dùng phải cho phép truy cập camera.
- **Điều kiện ánh sáng**: Quét hiệu quả trong môi trường đủ sáng.
- **Dung lượng dữ liệu**: Hạn chế dưới 5000 bản ghi để đảm bảo hiệu năng.

### **Rủi ro**
| Rủi ro                  | Tác động | Giải pháp |
|-------------------------|----------|-----------|
| Người dùng từ chối quyền camera | Không thể quét | Hướng dẫn chi tiết và thông báo rõ ràng |
| Quét sai định dạng      | Dữ liệu không chính xác | Hỗ trợ quét lại và cảnh báo lỗi |
| Dữ liệu trùng lặp       | Mất tính duy nhất | Kiểm tra trùng lặp trước khi lưu |
| Hiệu năng trên mobile   | Chậm hoặc vỡ giao diện | Kiểm thử trên đa thiết bị, tối ưu layout responsive |

---

## 7. Tiêu chí hoàn thành Phase 1
- Ứng dụng mở camera và quét mã thành công.
- Lưu trữ mã vào SQLite không trùng lặp.
- Hiển thị danh sách mã theo thời gian, hỗ trợ copy.
- Xử lý lỗi camera và quét sai không gây crash.
- Hoạt động ổn định trên Chrome desktop/mobile.
