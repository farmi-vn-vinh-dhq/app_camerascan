# Kiến trúc hệ thống ứng dụng quét mã vạch (Phase 1)

## 1. Tổng quan kiến trúc

Hệ thống được thiết kế theo mô hình **MVC (Model-View-Controller)** với kiến trúc phân tầng rõ ràng:
- **Frontend**: Giao diện người dùng Next.js xử lý camera, hiển thị kết quả và tương tác
- **Backend**: API routes xử lý nghiệp vụ lưu trữ và truy vấn dữ liệu
- **Database**: SQLite làm hệ thống lưu trữ cục bộ
- **Barcode Scanner**: Thư viện xử lý quét mã vạch trong browser

Hệ thống đảm bảo tính đơn giản, hiệu năng cao và khả năng mở rộng cho các phase sau.

## 2. High-level Architecture

mermaid
graph TD
    A[User Interface] --> B[Camera Access]
    B --> C[Barcode Scanner]
    C --> D[Decode Result]
    D --> E[Save to DB]
    E --> F[Database]
    D --> G[Display Results]
    G --> H[Copy to Clipboard]
    
    subgraph Backend
        E --> I[API Routes]
        I --> F
        F --> I
    end
    
    subgraph Frontend
        A --> B
        D --> G
        G --> H
    end

## 3. Component Description

### 3.1 Frontend (Next.js)
- **Camera Component**: 
  - Yêu cầu quyền truy cập camera qua `navigator.mediaDevices.getUserMedia`
  - Hiển thị preview camera thời gian thực
- **Scanner Component**:
  - Sử dụng thư viện browser-based (ZXing/QuaggaJS)
  - Decode mã vạch/QR code
  - Xử lý debounce để tránh quét trùng lặp
- **UI Components**:
  - Thanh hiển thị kết quả quét
  - Danh sách mã vạch đã lưu (sortable theo thời gian)
  - Nút copy với toast thông báo
- **Error Handling**:
  - Xử lý quyền camera bị từ chối
  - Xử lý lỗi quét không thành công

### 3.2 Backend (Next.js API Routes)
- **/api/scan**: 
  - Nhận dữ liệu từ frontend
  - Lưu vào SQLite với validation unique
- **/api/history**:
  - Trả về danh sách mã vạch đã lưu
  - Hỗ trợ phân trang (nếu cần)

### 3.3 Database (SQLite)
- **Schema**:
  prisma
  model Barcode {
    id        Int    @id @default(autoincrement())
    code      String @unique
    format    String?
    createdAt DateTime @default(now())
  }
  
- **Prisma ORM**: Layer truy vấn an toàn và hiệu quả

### 3.4 Barcode Scanner Library
- Chạy hoàn toàn trong browser
- Hỗ trợ:
  - QR Code
  - UPC-A/EAN
  - Code 128
- Tối ưu hiệu năng < 1.5s/scan

## 4. Deployment View

mermaid
graph LR
    subgraph Client
        A[Browser] --> B[Next.js App]
    end
    
    subgraph Server
        B --> C[Next.js API Routes]
        C --> D[SQLite Database]
    end
    
    subgraph Local
        D --> E[Local File System]
    end
    
    A --> F[Camera Device]
    F --> B

### 4.1 Mô hình triển khai
- **Single Server Architecture**:
  - Next.js đóng vai trò cả frontend và backend
  - SQLite lưu trữ cục bộ trong file `.sqlite`
  - Không cần cấu hình server phức tạp
- **Responsive Design**:
  - Layout tự điều chỉnh cho desktop/mobile
  - Camera preview tỷ lệ 16:9

### 4.2 Quy trình triển khai
1. Phát triển trên môi trường local
2. Build Next.js và deploy lên:
   - Vercel (cho môi trường dev/test)
   - Docker container (cho môi trường sản phẩm)
3. Cấu hình quyền camera qua browser

### 4.3 Tương thích
- Hỗ trợ đầy đủ:
  - Chrome (desktop/mobile)
  - Safari (desktop/mobile)
  - Firefox
- Không hỗ trợ IE11
