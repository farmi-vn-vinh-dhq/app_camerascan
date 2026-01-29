# Giả định, Rủi ro và Kế hoạch giảm thiểu - Phase 2: Barcode Scanner Web App

## 1. Giả định (Assumptions)
- Code Phase 1 đã chạy ổn định và có thể kiểm thử
- Repository có trạng thái ổn định để thực hiện refactor và test
- Có thể thêm các dependency test cần thiết (Jest, Vitest, v.v.)
- Không có ràng buộc phức tạp từ hệ thống CI/CD hiện tại
- Đội ngũ đã có kinh nghiệm với các công cụ test được yêu cầu

## 2. Rủi ro (Risks)
- **R1**: Test coverage không đạt mục tiêu 70% do thiếu test case cho logic phức tạp
- **R2**: Phát hiện kỹ thuật nợ (technical debt) lớn từ Phase 1 ảnh hưởng đến refactor
- **R3**: Thời gian bị chậm trễ do phát hiện lỗi logic quan trọng trong quá trình review
- **R4**: Khó mock hoàn toàn các trường hợp lỗi hệ thống (camera, DB) trong test
- **R5**: Xung đột giữa các thành viên trong việc tuân thủ convention coding

## 3. Kế hoạch giảm thiểu (Mitigation Plan)

| Rủi ro | Mức độ | Hành động giảm thiểu | Người chịu trách nhiệm |
|--------|--------|---------------------|------------------------|
| R1 | Cao | Ưu tiên test cho logic core (parser, validation, save) và sử dụng công cụ coverage tool | QA Engineer, Tech Reviewer |
| R2 | Cao | Dành 20% thời gian phase cho refactor kỹ thuật nợ đã được liệt kê trong FR-03 | Developer, Tech Reviewer |
| R3 | Trung bình | Phân rủi ro thành task nhỏ, đánh giá mức độ ảnh hưởng trước khi fix | Tech Reviewer, Project Manager |
| R4 | Trung bình | Sử dụng mock library chuyên dụng (jest-mock, vitest-mock) và thiết kế test case chi tiết | QA Engineer, Developer |
| R5 | Thấp | Tổ chức session chia sẻ convention coding và kiểm tra ESLint/Prettier tự động | Developer, Tech Reviewer |

**Ghi chú**: 
- Các rủi ro được đánh giá theo mức độ ảnh hưởng đến mục tiêu "sẵn sàng production nội bộ"
- Kế hoạch sẽ cập nhật khi phát hiện rủi ro mới trong quá trình thực thi
