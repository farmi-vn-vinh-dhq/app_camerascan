# Barcode Scanner Web App – Phase 2: Đánh Giá Chất Lượng & Kiểm Thử

## 1. Tổng quan sản phẩm
Phase 2 tập trung vào **đảm bảo chất lượng mã nguồn, kiểm thử toàn diện và ổn định hệ thống** cho ứng dụng quét mã vạch đã hoàn thành Phase 1.  
Mục tiêu là chuẩn hóa codebase, đạt độ phủ test tối thiểu 70%, loại bỏ lỗi nghiêm trọng và chuẩn bị cho triển khai nội bộ.  
**Không phát triển chức năng mới**, chỉ tập trung vào cải thiện chất lượng kỹ thuật.

---

## 2. Mục tiêu & KPI
### Mục tiêu
- Đảm bảo codebase sạch, kiến trúc đúng chuẩn
- Đạt độ phủ test ≥ 70% cho logic cốt lõi
- Không tồn tại lỗi nghiêm trọng (Critical)
- Chuẩn hóa quy tắc code và logging
- Chuẩn bị sẵn sàng cho production nội bộ

### KPI
| Chỉ số | Mốc đạt |
|--------|---------|
| Test coverage (logic cốt lõi) | ≥ 70% |
| Lỗi Critical tồn dư | 0 |
| Thời gian hoàn thành Phase 2 | 3 tuần |
| Tỷ lệ test case pass | 100% |
| ESLint/Prettier pass | 100% |

---

## 3. Personas người dùng
| Vai trò | Mô tả |
|--------|-------|
| **Tech Reviewer** | Đánh giá kiến trúc, code quality, đề xuất refactor |
| **QA Engineer** | Thiết kế và thực hiện test case, báo cáo lỗi |
| **Developer** | Refactor code, viết test, fix bug, tối ưu logic |

---

## 4. Use Cases chính
1. **Code Review**  
   - Kiểm tra cấu trúc folder, phân tách layer, reuse component  
   - Đánh giá convention, ESLint, Prettier  

2. **Viết test**  
   - Unit test cho parser, validation, service  
   - API test cho endpoint save/list  
   - Component test cho UI element  

3. **Kiểm thử tích hợp**  
   - Luồng quét → lưu → hiển thị → sao chép  
   - Xử lý lỗi camera, decode, DB  

4. **Kiểm tra hiệu năng**  
   - Đo tốc độ API, render danh sách 5k bản ghi  

5. **Logging & Debug**  
   - Bổ sung log cấu trúc, flag debug  

---

## 5. In-scope / Out-of-scope
### In-scope
- Code review toàn bộ codebase  
- Refactor cấu trúc module  
- Viết unit/API/component test  
- Kiểm thử luồng chính, lỗi, hiệu năng  
- Fix bug Critical  

### Out-of-scope
- Thêm chức năng nghiệp vụ mới  
- Thay đổi UI lớn  
- Xây dựng hệ thống auth  
- Thay đổi database engine  
- Triển khai production  

---

## 6. Phụ thuộc & rủi ro
### Phụ thuộc
- Codebase Phase 1 hoạt động ổn định  
- Repository có thể thêm dependency test  
- Không ràng buộc CI/CD phức tạp  

### Rủi ro
| Rủi ro | Mức độ | Giải pháp |
|--------|--------|-----------|
| Test coverage < 70% | Cao | Tăng cường test case cho logic cốt lõi |
| Lỗi Critical tồn dư | Cao | Review code sớm, ưu tiên fix bug |
| Codebase phức tạp | Trung | Refactor từng module nhỏ |
| Thiếu tài nguyên test | Thấp | Sử dụng mock data và test framework sẵn có |
