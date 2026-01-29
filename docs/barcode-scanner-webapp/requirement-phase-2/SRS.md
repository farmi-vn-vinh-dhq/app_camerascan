# Software Requirement Specification - Barcode Scanner Web App (Phase 2)

## 1. Giới thiệu

**Mục đích**:  
Phase 2 tập trung vào đánh giá chất lượng mã nguồn, kiểm thử và ổn định hệ thống cho ứng dụng Barcode Scanner Web App đã hoàn thành Phase 1. Mục tiêu chính là đảm bảo hệ thống đạt tiêu chuẩn sản phẩm nội bộ với các yêu cầu về code quality, test coverage và xử lý lỗi.

**Phạm vi**:  
- Đánh giá và cải thiện chất lượng codebase  
- Viết test case đầy đủ (unit, API, component, integration)  
- Kiểm thử luồng nghiệp vụ quan trọng  
- Không bổ sung chức năng mới, không thay đổi kiến trúc lớn  

---

## 2. Tổng quan hệ thống

**Vai trò hệ thống**:  
Ứng dụng web cho phép quét mã vạch, lưu trữ và hiển thị danh sách mã vạch đã quét. Phase 2 tập trung vào kiểm thử và chuẩn hóa codebase để đảm bảo độ ổn định.

**Các thành phần chính**:  
- **Codebase**: Cấu trúc module, layer phân tách (UI, service, API, DB)  
- **Kiến trúc**: Phân tách logic nghiệp vụ và UI, sử dụng TypeScript  
- **Kiểm thử**: Unit test, API test, component test, integration test  
- **Logging**: Ghi log lỗi và thông tin quan trọng  

**Người dùng tương tác**:  
- **Tech Reviewer**: Đánh giá kiến trúc và chất lượng code  
- **QA Engineer**: Thiết kế và thực hiện test case  
- **Developer**: Refactor code, viết test, fix bug  

---

## 3. Yêu cầu chức năng

### 3.1 Code Structure Review (FR-01)  
**Mô tả**:  
- Đánh giá cấu trúc folder, sự phân tách trách nhiệm (separation of concerns)  
- Kiểm tra sự phân tách giữa API layer và UI layer  
- Đánh giá thiết kế component, service abstraction, pattern truy cập DB  

**Kết quả**:  
- Danh sách issue kiến trúc/code  
- Kế hoạch refactor module  

---

### 3.2 Chuẩn hóa coding convention (FR-02)  
**Mô tả**:  
- Áp dụng quy tắc đặt tên (naming convention)  
- Sử dụng TypeScript typing đầy đủ, loại bỏ `any`  
- Đảm bảo ESLint và Prettier chạy thành công  

**Kết quả**:  
- Codebase tuân thủ quy chuẩn  
- Không lỗi linter  

---

### 3.3 Refactor yêu cầu (FR-03)  
**Mô tả**:  
- Xử lý logic trùng lặp  
- Tách hàm/component có độ dài quá mức  
- Di chuyển logic DB ra khỏi UI layer  

**Kết quả**:  
- Codebase sạch, dễ bảo trì  
- Không circular dependency  

---

### 3.4 Unit Tests (FR-04)  
**Mô tả**:  
- Viết test cho:  
  - Parser mã vạch  
  - Logic phát hiện trùng lặp  
  - Service lưu trữ mã vạch  
  - Logic validate đầu vào  

**Yêu cầu**:  
- Coverage ≥ 70% cho logic core  
- Không test camera thật (sử dụng mock)  

---

### 3.5 API Tests (FR-05)  
**Mô tả**:  
- Test các endpoint:  
  - POST `/save-barcode`  
  - GET `/list`  
  - Xử lý lỗi đầu vào, trùng lặp, lỗi DB  

**Kết quả**:  
- 100% test case success/invalid/duplicate/DB error pass  

---

### 3.6 UI Component Tests (FR-06)  
**Mô tả**:  
- Test component:  
  - Hiển thị danh sách mã vạch  
  - Nút copy mã vạch  
  - Thông báo lỗi  

**Yêu cầu**:  
- Kiểm tra render đúng trạng thái  
- Không crash khi xử lý lỗi  

---

### 3.7 Integration Test (FR-07)  
**Mô tả**:  
- Test luồng end-to-end:  
  1. Quét mã vạch → 2. Giải mã → 3. Lưu → 4. Hiển thị → 5. Copy  

**Case test**:  
- Quét thành công  
- Quét trùng lặp  
- Quét thất bại  
- Camera bị từ chối  

---

### 3.8 Kiểm tra xử lý lỗi (FR-08)  
**Mô tả**:  
- Kiểm tra các tình huống:  
  - Camera không được cấp quyền  
  - Giải mã thất bại  
  - Lỗi DB  
  - Timeout API  

**Yêu cầu**:  
- UI không crash, hiển thị thông báo lỗi rõ ràng  

---

### 3.9 Kiểm tra hiệu năng cơ bản (FR-09)  
**Mô tả**:  
- Đo tốc độ:  
  - Latency API cục bộ  
  - Lưu batch 100 mã vạch  
  - Render danh sách 5k bản ghi  

**Yêu cầu**:  
- Không có delay > 2s trong các trường hợp test  

---

### 3.10 Logging & Debug (FR-10)  
**Mô tả**:  
- Bổ sung:  
  - Log cấu trúc cho API  
  - Ghi log lỗi quét thất bại  
  - Flag debug cho môi trường phát triển  

**Yêu cầu**:  
- Không có `console.log` trong code sản phẩm  

---

## 4. Yêu cầu phi chức năng

### 4.1 Chất lượng code  
- Không circular dependency  
- Không dead code, unused import  
- Không `console.log` trong build production  

---

### 4.2 Khả năng kiểm thử  
- Code tách layer để dễ mock  
- Service không phụ thuộc UI  
- DB layer có thể mock  

---

### 4.3 Khả năng bảo trì  
- File ≤ 300 dòng (khuyến nghị)  
- Hàm ≤ 50 dòng (khuyến nghị)  
- Có JSDoc cho logic core  

---

## 5. Giả định & phụ thuộc

### 5.1 Giả định  
- Code Phase 1 đã chạy ổn định  
- Có repo Git ổn định  
- Có thể cài đặt thêm dependency test  

---

### 5.2 Phụ thuộc  
- Framework test: **Jest/Vitest**, **React Testing Library**  
- API test: **supertest/fetch**  
- Không yêu cầu test camera thật  

---

## 6. Định nghĩa "Hoàn thành" (Definition of Done)  
Phase 2 hoàn thành khi:  
- Code review hoàn tất, fix tất cả issue mức High  
- Refactor task chính hoàn tất  
- Unit test coverage ≥ 70%  
- API/UI test pass 100%  
- Không còn bug mức Critical  
- ESLint/format pass  
- Scan flow ổn định qua tất cả test case
