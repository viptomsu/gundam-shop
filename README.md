# Gundam Shop E-commerce

Dự án thương mại điện tử chuyên kinh doanh các sản phẩm mô hình Gundam, được xây dựng trên nền tảng công nghệ hiện đại nhằm mang lại trải nghiệm mua sắm mượt mà và tối ưu nhất cho người dùng.

## Tính Năng Chính

Dựa trên thiết kế hệ thống, dự án bao gồm các tính năng nổi bật:

- **Hệ thống Sản phẩm Đa dạng**:
  - Phân loại theo **Grade** (HG, MG, PG, v.v.) và **Scale** (1/144, 1/100, v.v.).
  - Hỗ trợ biến thể (Variants) cho từng sản phẩm.
  - Thông tin chi tiết về Series và Thương hiệu (Brand).
- **Tìm kiếm & Lọc**: Tìm kiếm sản phẩm nhanh chóng, lọc theo danh mục, thương hiệu, và thông số kỹ thuật.
- **Giỏ hàng & Đặt hàng**: Quy trình thêm vào giỏ và thanh toán (Checkout) được tối ưu hóa.
- **Quản lý Đơn hàng**: Theo dõi trạng thái đơn hàng (Chờ xác nhận, Đang giao, Đã giao, v.v.).
- **Hệ thống Đánh giá**: Người dùng có thể đánh giá và bình luận về sản phẩm.
- **Admin Dashboard**: Trang quản trị dành cho Admin để quản lý toàn bộ sản phẩm, đơn hàng và người dùng của hệ thống.

## Công Nghệ Sử Dụng

Dự án sử dụng các công nghệ tiên tiến nhất trong hệ sinh thái React/Node.js:

- **Frontend & Framework**: [Next.js 16+](https://nextjs.org/) (App Router) - Tối ưu SEO và hiệu năng.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) kết hợp với [Shadcn UI](https://ui.shadcn.com/) cho thiết kế đẹp và nhất quán.
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Cơ sở dữ liệu quan hệ mạnh mẽ.
- **ORM**: [Prisma](https://www.prisma.io/) - Tương tác với cơ sở dữ liệu dễ dàng và an toàn kiểu dữ liệu (Type-safety).
- **State Management**: Zustand / React Query (TanStack Query).
- **Forms**: React Hook Form kết hợp với Zod để validate dữ liệu.

## Hướng Dẫn Cài Đặt

Thực hiện các bước sau để cài đặt dự án trên máy cục bộ (Local):

1.  **Clone dự án**:

    ```bash
    git clone https://github.com/your-repo/gundam-shop.git
    cd gundam-shop
    ```

2.  **Cài đặt các gói thư viện (Dependencies)**:

    ```bash
    npm install
    # Hoặc yarn install / pnpm install / bun install
    ```

3.  **Cấu hình biến môi trường**:

    - Copy file mẫu `.example.env` thành `.env`:
      ```bash
      cp .example.env .env
      ```
    - Cập nhật các biến quan trọng trong file `.env`:
      - `DATABASE_URL`: Đường dẫn kết nối PostgreSQL.
      - `GEMINI_API_KEY`: API Key từ Google Gemini (Phải có nếu dùng tính năng Seed AI).
      - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cấu hình ảnh (để api upload ảnh chạy được).

4.  **Cấu hình Cơ sở dữ liệu**:
    Đồng bộ schema Prisma vào database:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Khởi tạo dữ liệu mẫu (Seeding)**:
    Có 2 lựa chọn để tạo dữ liệu:

    **Cách 1: Seed Cơ bản (Nhanh)**
    Sử dụng dữ liệu giả (Faker) và danh sách cứng.

    ```bash
    npx prisma db seed
    ```

    **Cách 2: Seed với AI (Chạy rất lâu)**
    Sử dụng Gemini AI để tạo dữ liệu phong phú và Crawl thêm sản phẩm.
    _Yêu cầu: Phải có `GEMINI_API_KEY` trong file `.env`._

    ```bash
    npm run db:init
    ```

## Hướng Dẫn Chạy

### Chạy môi trường phát triển (Development)

Để khởi chạy ứng dụng ở chế độ dev:

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

### Quản lý Database

Sử dụng Prisma Studio để xem và chỉnh sửa dữ liệu trực quan:

```bash
npx prisma studio
```

### Các lệnh Scripts khác

Xem trong file `package.json` mục `scripts`:

- `npm run build`: Build dự án cho production.
- `npm run start`: Chạy bản build production.
- `npm run lint`: Kiểm tra lỗi cú pháp (Linting).

## Demo

Dưới đây là một số hình ảnh thực tế của ứng dụng:

**1. Trang Chủ**
_(Vui lòng thêm ảnh vào `public/demo/home.png`)_
![Trang chủ](/demo/home.png)

**2. Chi tiết Sản phẩm**
_(Vui lòng thêm ảnh vào `public/demo/product.png`)_
![Chi tiết Sản phẩm](/demo/product.png)

## Nguyên Lý & Kiến Trúc

Dự án tuân theo các nguyên tắc thiết kế rõ ràng để đảm bảo tính dễ bảo trì và mở rộng:

- **Schemas (Zod)**: Tất cả các định nghĩa validation schemas được tập trung trong thư mục `schemas/`. Điều này giúp tái sử dụng và đồng bộ logic kiểm tra dữ liệu giữa Client và Server.
- **Utils**: Các hàm tiện ích chung, format dữ liệu được đặt trong `utils/`.
- **Hooks**: Các Custom Hooks của React được đặt trong `hooks/` để tách biệt logic khỏi UI components.
- **API Requests**: Sử dụng `axios` instance đã được cấu hình sẵn trong `lib/axios.ts` cho các request phía Client, đảm bảo thống nhất về xử lý lỗi và headers.
- **Cấu trúc thư mục**: Tuân thủ chuẩn Next.js App Router, với `app/` chứa các pages và layouts, `components/` chứa các UI components nhỏ.
