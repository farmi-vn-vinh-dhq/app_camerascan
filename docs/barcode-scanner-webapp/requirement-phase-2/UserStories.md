# User Stories cho Phase 2 - Barcode Scanner Web App

## US-01: Đánh giá cấu trúc codebase
**As a** Tech Reviewer,  
**I want** review cấu trúc folder và phân tách trách nhiệm giữa các layer,  
**so that** đảm bảo kiến trúc codebase rõ ràng và dễ bảo trì.

**Acceptance Criteria**  
- Given codebase hiện tại  
- When kiểm tra folder structure, separation of concerns, và abstraction layer  
- Then phải có danh sách issue về cấu trúc code và đề xuất refactor.

---

## US-02: Chuẩn hóa quy ước code
**As a** Developer,  
**I want** áp dụng quy ước đặt tên và chuẩn hóa TypeScript,  
**so that** codebase tuân thủ quy chuẩn và dễ đọc.

**Acceptance Criteria**  
- Given codebase chưa chuẩn hóa  
- When thực hiện ESLint và Prettier  
- Then không còn lỗi liên quan đến naming convention, unused import, và kiểu `any`.

---

## US-03: Refactor logic trùng lặp
**As a** Developer,  
**I want** loại bỏ logic trùng lặp và rút gọn hàm quá dài,  
**so that** codebase gọn nhẹ và dễ bảo trì.

**Acceptance Criteria**  
- Given codebase có đoạn logic trùng lặp  
- When refactor các hàm và component có độ dài > 50 dòng  
- Then không còn đoạn code trùng lặp và hàm có độ dài hợp lý.

---

## US-04: Viết unit test cho core logic
**As a** Developer,  
**I want** viết unit test cho parser và validation logic,  
**so that** đảm bảo tính ổn định của chức năng cốt lõi.

**Acceptance Criteria**  
- Given các module core logic  
- When chạy test suite  
- Then coverage ≥ 70% cho các module quan trọng.

---

## US-05: Kiểm thử API
**As a** QA Engineer,  
**I want** test API với các trường hợp lỗi và đầu vào không hợp lệ,  
**so that** đảm bảo API hoạt động chính xác trong mọi tình huống.

**Acceptance Criteria**  
- Given API endpoints  
- When gửi request với payload lỗi, trùng lặp, hoặc DB error  
- Then trả về response đúng và không crash hệ thống.

---

## US-06: Kiểm thử component UI
**As a** QA Engineer,  
**I want** test các component như danh sách mã vạch và nút copy,  
**so that** đảm bảo giao diện hoạt động như mong đợi.

**Acceptance Criteria**  
- Given component UI  
- When tương tác với component  
- Then component hiển thị đúng và phản hồi chính xác.

---

## US-07: Kiểm thử luồng quét mã vạch
**As a** QA Engineer,  
**I want** test luồng quét → lưu → hiển thị → sao chép,  
**so that** đảm bảo toàn bộ quy trình hoạt động mượt mà.

**Acceptance Criteria**  
- Given mock dữ liệu quét mã vạch  
- When thực hiện các tình huống quét thành công, lỗi, hoặc trùng lặp  
- Then luồng xử lý hoàn tất mà không có lỗi nghiêm trọng.

---

## US-08: Xử lý lỗi không làm crash UI
**As a** Developer,  
**I want** đảm bảo hệ thống không crash khi xảy ra lỗi,  
**so that** người dùng có trải nghiệm ổn định.

**Acceptance Criteria**  
- Given các tình huống lỗi như camera denied hoặc decode thất bại  
- When hệ thống xử lý lỗi  
- Then UI không crash và hiển thị thông báo lỗi rõ ràng.

---

## US-09: Đo tốc độ và hiệu năng
**As a** Tech Reviewer,  
**I want** đo thời gian phản hồi API và khả năng hiển thị 5k bản ghi,  
**so that** đảm bảo hệ thống đáp ứng yêu cầu hiệu năng cơ bản.

**Acceptance Criteria**  
- Given hệ thống đang chạy  
- When thực hiện test hiệu năng  
- Then thời gian phản hồi API và render danh sách đạt yêu cầu.

---

## US-10: Bổ sung logging và debug
**As a** Developer,  
**I want** thêm log cấu trúc cho các lỗi quan trọng,  
**so that** hỗ trợ debug và theo dõi lỗi hiệu quả.

**Acceptance Criteria**  
- Given hệ thống có lỗi xảy ra  
- When bật chế độ debug  
- Then log được ghi đầy đủ và có thể theo dõi được nguyên nhân lỗi.
