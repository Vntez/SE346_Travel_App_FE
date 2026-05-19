# Travel App — Frontend (Expo)

Ứng dụng di động du lịch (React Native + Expo), kết nối backend [Travel_App_BE](https://github.com/Khoahuynh2511/SE346_Travel_App_BE).

**App chính nằm trong thư mục `Travel_App/`.**

---

## Bắt đầu nhanh

### 1. Cài đặt

```bash
cd Travel_App
npm install
cp .env.example .env
```

Sửa `Travel_App/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

| Môi trường | URL gợi ý |
|------------|-----------|
| Android emulator | `http://10.0.2.2:8000` |
| iOS simulator | `http://localhost:8000` |
| Máy thật | `http://<IP-máy-dev>:8000` |

### 2. Chạy backend trước

Backend phải chạy và đã seed dữ liệu. Xem README repo BE.

### 3. Chạy app

```bash
cd Travel_App
npm start
```

Quét QR bằng Expo Go hoặc nhấn `a` (Android) / `i` (iOS).

---

## Tài khoản demo

| Email | Mật khẩu | Màn hình |
|-------|----------|----------|
| `demo@example.com` | `demo1234` | Home, địa điểm, review |
| `owner@example.com` | `demo1234` | Dashboard owner, thêm địa điểm |

---

## Tính năng đã nối API

- Đăng nhập / đăng ký / đăng xuất (JWT lưu Secure Store)
- Danh sách & chi tiết địa điểm
- Yêu thích, sửa profile
- Review + like + upload ảnh
- Owner: quản lý địa điểm, promotions, upload ảnh bìa
- Gợi ý chuyến đi (AI preview)

---

## Cấu trúc

```
Travel_App/
  app/(tabs)/          # Màn hình & navigation
  lib/api/             # Client gọi backend
  lib/config.ts        # Base URL API
  .env.example
```

---

## Lệnh thường dùng

```bash
npm start          # Expo dev server
npm run android
npm run ios
npm run lint
```

---

## Lưu ý

- Không commit file `.env` (chứa URL nội bộ).
- Upload ảnh cần backend cấu hình Supabase Storage (`service_role`).
