# User Stories cho Web App Quét Barcode (Phase 1)

## US-001: Mở camera để quét
**As a** Scanner User,  
**I want** mở camera từ trình duyệt để quét mã vạch/QR code,  
**so that** có thể quét nhanh chóng mà không cần cài đặt phần mềm.

### Acceptance Criteria
**Given** Trình duyệt hỗ trợ camera  
**When** Người dùng nhấn nút "Bắt đầu quét"  
**Then**  
- Camera được mở và hiển thị trực tiếp trong giao diện  
- Cảnh báo yêu cầu quyền camera (nếu chưa cấp)  
- Không yêu cầu cài đặt phần mềm bổ sung

---

## US-002: Quét mã vạch/QR code
**As a** Scanner User,  
**I want** quét mã vạch/QR code theo thời gian thực,  
**so that** có thể nhận diện mã nhanh chóng trong lúc di chuyển.

### Acceptance Criteria
**Given** Camera đã được mở  
**When** Người dùng di chuyển mã vạch/QR code vào khung quét  
**Then**  
- Mã được nhận diện và hiển thị kết quả ngay lập tức  
- Không quét trùng lặp trong 3 giây liên tiếp (debounce)  
- Hiển thị thông báo nếu không nhận diện được mã

---

## US-003: Xem kết quả quét
**As a** Scanner User,  
**I want** xem kết quả quét ngay lập tức,  
**so that** có thể xác nhận mã trước khi lưu.

### Acceptance Criteria
**Given** Mã đã được quét thành công  
**When** Hệ thống nhận diện mã  
**Then**  
- Hiển thị giá trị mã vạch/QR code trên màn hình  
- Hiển thị loại mã (Barcode/QR code) nếu có  
- Cung cấp tùy chọn "Lưu ngay" hoặc "Hủy"

---

## US-004: Lưu mã vạch vào hệ thống
**As a** Scanner User,  
**I want** lưu mã vạch đã quét vào hệ thống,  
**so that** có thể truy xuất lại sau này.

### Acceptance Criteria
**Given** Mã vạch đã được quét và xác nhận  
**When** Người dùng nhấn "Lưu" hoặc tự động lưu  
**Then**  
- Mã được lưu vào SQLite với các trường: `code`, `format`, `created_at`  
- Không cho phép lưu mã trùng lặp  
- Hiển thị thông báo thành công hoặc lỗi

---

## US-005: Xem danh sách mã vạch đã lưu
**As a** Scanner User,  
**I want** xem danh sách mã vạch đã quét,  
**so that** có thể tìm lại mã nhanh chóng.

### Acceptance Criteria
**Given** Có ít nhất 1 mã vạch đã lưu  
**When** Người dùng truy cập trang "Lịch sử"  
**Then**  
- Hiển thị danh sách mã vạch theo thứ tự mới nhất lên đầu  
- Mỗi mục bao gồm: mã vạch, thời gian quét  
- Có thể tìm kiếm/mã hóa theo mã

---

## US-006: Sao chép mã vạch từ giao diện
**As a** Scanner User,  
**I want** sao chép mã vạch từ giao diện,  
**so that** có thể sử dụng mã nhanh chóng mà không cần gõ tay.

### Acceptance Criteria
**Given** Mã vạch đang hiển thị trong danh sách  
**When** Người dùng nhấn nút "Copy"  
**Then**  
- Mã được sao chép vào clipboard  
- Hiển thị thông báo "Đã sao chép thành công"  
- Không yêu cầu mở ứng dụng khác

---

## US-007: Xử lý lỗi quyền camera
**As a** Scanner User,  
**I want** hệ thống xử lý lỗi khi không được cấp quyền camera,  
**so that** có thể hiểu nguyên nhân và khắc phục.

### Acceptance Criteria
**Given** Người dùng từ chối quyền camera  
**When** Hệ thống yêu cầu quyền camera  
**Then**  
- Hiển thị thông báo rõ ràng về việc cần quyền camera  
- Cung cấp hướng dẫn cách cấp quyền trên thiết bị  
- Không làm crash ứng dụng

---

## US-008: Xử lý lỗi quét mã vạch
**As a** Scanner User,  
**I want** hệ thống xử lý lỗi khi quét mã vạch thất bại,  
**so that** có thể tiếp tục quét mà không bị gián đoạn.

### Acceptance Criteria
**Given** Mã vạch không hợp lệ hoặc bị mờ  
**When** Hệ thống thử quét mã  
**Then**  
- Hiển thị thông báo "Không thể quét mã"  
- Cho phép quét lại ngay lập tức  
- Không làm crash ứng dụng

---

## US-009: Hiển thị giao diện trên thiết bị di động
**As a** Scanner User,  
**I want** giao diện hiển thị rõ ràng trên điện thoại,  
**so that** có thể quét mã vạch mọi lúc mọi nơi.

### Acceptance Criteria
**Given** Truy cập ứng dụng từ điện thoại di động  
**When** Mở camera quét  
**Then**  
- Camera preview không bị méo hoặc vỡ bố cục  
- Các nút bấm có kích thước phù hợp với tay người dùng  
- Hiển thị kết quả quét rõ ràng trên màn hình nhỏ

---

## US-010: Tối ưu hiệu năng quét mã
**As a** Scanner User,  
**I want** ứng dụng quét mã nhanh và mượt,  
**so that** không bị gián đoạn trong quá trình sử dụng.

### Acceptance Criteria
**Given** Mã vạch/QR code hợp lệ  
**When** Người dùng quét mã  
**Then**  
- Thời gian nhận diện mã ≤ 1.5 giây  
- Thời gian lưu mã ≤ 200ms  
- Tải danh sách mã ≤ 100ms (với ≤ 5000 bản ghi)
