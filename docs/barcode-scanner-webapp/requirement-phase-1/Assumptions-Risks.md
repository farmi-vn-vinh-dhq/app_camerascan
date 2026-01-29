# Assumptions

1. Người dùng sẽ cấp quyền truy cập camera khi yêu cầu.
2. Điều kiện ánh sáng khi quét barcode/QR code là đủ để thư viện quét hoạt động hiệu quả.
3. Dữ liệu lưu trữ (SQLite) sẽ không vượt quá 5,000 bản ghi trong Phase 1.
4. Ứng dụng sẽ được triển khai trong môi trường local hoặc nội bộ, không yêu cầu kết nối mạng phức tạp.
5. Thư viện quét (ZXing hoặc tương tự) hoạt động ổn định trên các trình duyệt mục tiêu.

---

# Risks

1. **Không thể truy cập camera trên một số trình duyệt di động**  
   - Một số trình duyệt di động (ví dụ: Safari trên iOS) có thể hạn chế quyền truy cập camera hoặc yêu cầu cài đặt bổ sung.

2. **Hiệu suất quét không đạt yêu cầu**  
   - Thời gian decode barcode có thể vượt quá 1.5 giây nếu thư viện quét không tối ưu hoặc thiết bị yếu.

3. **Xung đột dữ liệu khi lưu barcode**  
   - Trường `code` có thể bị trùng do lỗi logic kiểm tra unique hoặc lỗi đồng bộ API.

4. **Tương thích layout trên thiết bị di động**  
   - Camera preview có thể không hiển thị đúng trên màn hình nhỏ nếu không thiết kế responsive.

5. **Lỗi từ thư viện quét (ZXing)**  
   - Thư viện có thể không hỗ trợ một số định dạng barcode/QR code ít phổ biến.

---

# Mitigation Plan

1. **Xử lý lỗi quyền camera**  
   - Hiển thị thông báo chi tiết và hướng dẫn người dùng cấp quyền (ví dụ: "Vui lòng cho phép truy cập camera trong cài đặt trình duyệt").

2. **Tối ưu hiệu suất**  
   - Sử dụng debounce logic để tránh quét trùng lặp.  
   - Kiểm tra hiệu suất trên thiết bị yếu và tối ưu code (ví dụ: giảm độ phân giải camera tạm thời).

3. **Đảm bảo unique khi lưu dữ liệu**  
   - Thêm kiểm tra `SELECT` trước khi `INSERT` để tránh trùng lặp.  
   - Xử lý lỗi từ SQLite bằng try-catch và thông báo người dùng.

4. **Kiểm tra responsive**  
   - Sử dụng CSS responsive (Flexbox/Grid) và test trên các kích thước màn hình phổ biến (320px, 768px, 1024px).

5. **Xử lý lỗi thư viện quét**  
   - Duy trì bản cập nhật thư viện quét.  
   - Thêm fallback hiển thị thông báo khi không nhận diện được định dạng.
