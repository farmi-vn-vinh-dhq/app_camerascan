# 1. Giới thiệu

## 1.1 Mục đích
Xây dựng ứng dụng Web Fullstack bằng **Next.js** để thực hiện luồng cơ bản: **Quét mã vạch/QR → Lưu vào SQLite → Hiển thị danh sách → Sao chép mã**.  
Tài liệu này là **Single Source of Truth** cho Phase 1, định nghĩa chi tiết yêu cầu kỹ thuật và nghiệp vụ.

## 1.2 Phạm vi
- **Bao gồm**:  
  - Mở camera từ trình duyệt  
  - Quét mã vạch/QR theo thời gian thực  
  - Lưu mã vào SQLite  
  - Hiển thị danh sách và sao chép mã  
  - Hỗ trợ desktop và mobile browser  

- **Không bao gồm**:  
  - Tính năng xác thực người dùng  
  - Đồng bộ dữ liệu đám mây  
  - Tạo mã vạch  
  - Thống kê, báo cáo  

## 1.3 Đối tượng sử dụng
- **Người dùng quét mã (Scanner User)**:  
  - Không yêu cầu đăng nhập  
  - Có thể quét mã và xem lịch sử đã lưu  

---

# 2. Tổng quan hệ thống

## 2.1 Kiến trúc hệ thống
- **Frontend**: Next.js App Router (React, TypeScript)  
- **Backend**: API REST/GraphQL (Next.js Server Actions)  
- **Database**: SQLite (file local)  
- **ORM**: Prisma (khuyến nghị)  
- **Thư viện quét mã**: Browser-native (ví dụ: `@zxing/browser`)  

## 2.2 Các thành phần chính
1. **Giao diện người dùng**:  
   - Camera preview  
   - Khu vực hiển thị kết quả quét  
   - Danh sách mã đã lưu  
   - Nút sao chép  

2. **Hệ thống backend**:  
   - API lưu mã vào SQLite  
   - API lấy danh sách mã  

3. **Cơ sở dữ liệu**:  
   - Bảng `Barcode` với các trường: `code`, `format`, `created_at`  

## 2.3 Luồng dữ liệu
1. Người dùng mở camera → quét mã  
2. Frontend decode mã → gửi lên backend  
3. Backend lưu vào SQLite  
4. Frontend tải danh sách từ backend → hiển thị  
5. Người dùng sao chép mã từ UI  

---

# 3. Yêu cầu chức năng

## 3.1 FR-01: Mở camera và quét mã
- **Mô tả**:  
  - Cho phép truy cập camera từ trình duyệt  
  - Quét mã vạch/QR theo thời gian thực  
- **Hành động người dùng**:  
  - Nhấn nút "Bắt đầu quét"  
- **Phản hồi hệ thống**:  
  - Hiển thị camera preview  
  - Decode mã ngay khi nhận diện thành công  
  - Chống quét trùng lặp (debounce 300ms)  

## 3.2 FR-02: Hiển thị kết quả quét
- **Mô tả**:  
  - Hiển thị giá trị mã quét được  
  - Yêu cầu xác nhận lưu (auto-save hoặc nút lưu)  
- **Hành động người dùng**:  
  - Xác nhận lưu mã  
- **Phản hồi hệ thống**:  
  - Hiển thị thông báo thành công  
  - Chuyển sang trang danh sách mã  

## 3.3 FR-03: Lưu mã vào SQLite
- **Mô tả**:  
  - Gọi API backend để lưu mã  
  - Kiểm tra duy nhất `code` trước khi lưu  
- **Dữ liệu lưu**:  
  plaintext
  code (string)  
  format (string, optional)  
  created_at (timestamp)  
  
- **Thành công**:  
  - Mã được lưu vào bảng `Barcode`  

## 3.4 FR-04: Hiển thị danh sách mã
- **Mô tả**:  
  - Hiển thị danh sách mã theo thời gian mới nhất  
  - Bao gồm: `code`, `created_at`  
- **Hành động người dùng**:  
  - Truy cập trang danh sách  
- **Phản hồi hệ thống**:  
  - Load dữ liệu từ SQLite  
  - Sắp xếp theo `created_at` giảm dần  

## 3.5 FR-05: Sao chép mã
- **Mô tả**:  
  - Mỗi dòng mã có nút "Copy"  
  - Sao chép giá trị mã vào clipboard  
- **Hành động người dùng**:  
  - Nhấn nút "Copy"  
- **Phản hồi hệ thống**:  
  - Hiển thị thông báo "Đã sao chép"  
  - Không yêu cầu xác nhận  

## 3.6 FR-06: Xử lý lỗi
- **Mô tả**:  
  - Xử lý lỗi quyền camera, lỗi quét  
  - Không gây crash ứng dụng  
- **Trường hợp lỗi**:  
  - Camera bị từ chối → Hiển thị hướng dẫn cấp quyền  
  - Quét thất bại → Cho phép quét lại  

---

# 4. Yêu cầu phi chức năng

## 4.1 Hiệu năng
- Decode mã trong **< 1.5s**  
- API lưu mã (local) trong **< 200ms**  
- Load danh sách **< 100ms** (dưới 5k bản ghi)  

## 4.2 Tương thích
- Hỗ trợ:  
  - Chrome (chính)  
  - Safari, Firefox  
  - Mobile browser (iOS/Android)  

## 4.3 Responsive
- Giao diện phù hợp với desktop và mobile  
- Camera preview không làm vỡ bố cục  

---

# 5. Giả định & phụ thuộc

## 5.1 Giả định
- Người dùng cấp quyền camera  
- Điều kiện ánh sáng đủ để quét mã  
- Dữ liệu lưu trữ nhỏ (dưới 10k bản ghi)  
- Ứng dụng chạy môi trường local hoặc nội bộ  

## 5.2 Phụ thuộc
- Trình duyệt hỗ trợ API camera (WebRTC)  
- SQLite được cài đặt và cấu hình  
- Thư viện quét mã hoạt động trên trình duyệt  

---

# 6. Định nghĩa hoàn thành Phase 1
- ✅ Mở camera và quét mã thành công  
- ✅ Lưu mã vào SQLite  
- ✅ Hiển thị danh sách mã theo thời gian  
- ✅ Sao chép mã từ UI  
- ✅ Xử lý lỗi camera bị từ chối, quét thất bại  
- ✅ Kiểm tra hiệu năng trên Chrome desktop/mobile
