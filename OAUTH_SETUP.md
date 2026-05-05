# OAuth Login Setup Guide

Hướng dẫn thiết lập tính năng đăng nhập bằng Google và Facebook.

## 1. Google OAuth Setup

### Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện tại
3. Bật "Google+ API" hoặc "Identity and Access Management API"

### Bước 2: Tạo OAuth 2.0 Credentials

1. Vào **Credentials** → **Create Credentials** → **OAuth client ID**
2. Chọn **Web application**
3. Thêm Authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:5173` (Vite dev server)
   - `https://yourdomain.com` (production)
4. Copy **Client ID**

### Bước 3: Cấu hình trong Frontend

1. Tạo file `.env.local` (từ `.env.example`):

   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

2. Khởi động lại dev server:
   ```bash
   npm run dev
   ```

## 2. Facebook OAuth Setup

### Bước 1: Tạo Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Chọn app type: **Consumer**
4. Điền thông tin app

### Bước 2: Cấu hình Facebook Login

1. Vào **Products** → Thêm **Facebook Login**
2. Chọn **Web**
3. Vào **Settings** → **Basic** để lấy **App ID**
4. Vào **Facebook Login** → **Settings**
5. Thêm **Valid OAuth Redirect URIs**:
   - `http://localhost:3000`
   - `http://localhost:5173`
   - `https://yourdomain.com`

### Bước 3: Cấu hình trong Frontend

1. Cập nhật `.env.local`:
   ```
   VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
   ```

## 3. Backend Configuration (Portal-BE)

### Thay đổi được thêm:

- ✅ Thêm columns `googleId`, `facebookId` vào User entity
- ✅ Thêm endpoint `/auth/social-login` để xử lý OAuth callbacks
- ✅ Support for existing social providers

### API Endpoints:

- `POST /auth/social-login` - Xử lý Google/Facebook login
- `POST /auth/google-callback` - Google callback (optional)
- `POST /auth/facebook-callback` - Facebook callback (optional)

### Request body example:

```json
{
  "provider": "google",
  "email": "user@example.com",
  "fullName": "User Name",
  "idToken": "google_token_here"
}
```

## 4. Frontend Components

### Thay đổi được thêm:

- ✅ GoogleLogin button trên trang AuthPage
- ✅ Facebook Login button
- ✅ OAuth service (`src/services/oauthService.ts`)
- ✅ Type definitions cho Facebook SDK

### Flow:

1. User click Google/Facebook button
2. OAuth provider authentication
3. Token returned to frontend
4. Frontend sends to backend (`/auth/social-login`)
5. Backend validates & creates/updates user
6. JWT token returned to frontend
7. Redirect to dashboard

## 5. Kiểm Tra Setup

### Frontend:

```bash
cd Portal-FE
npm install
npm run dev
```

### Backend:

```bash
cd portal-be
npm install
npm run start:dev
```

### Test đăng nhập:

1. Mở http://localhost:5173 (hoặc port Vite của bạn)
2. Vào trang Login
3. Click nút Google/Facebook
4. Hoàn thành OAuth flow
5. Kiểm tra user được tạo trong database

## 6. Production Considerations

⚠️ **IMPORTANT for Production:**

1. Verify OAuth tokens on backend (not just client-side)
2. Use environment variables cho Client IDs
3. HTTPS only
4. Add CSRF protection
5. Implement token refresh strategy
6. Add rate limiting
7. Monitor OAuth failures

## Troubleshooting

### Google Login không hoạt động:

- Check Client ID có đúng không
- Check Authorized redirect URIs
- Browser console có error gì không?

### Facebook Login không hoạt động:

- Check App ID có đúng không
- Check app is in development mode
- Facebook SDK initialization

### User không được tạo:

- Check backend logs
- Verify email permission được granted
- Check database constraints

## Security Notes

- OAuth tokens được lưu trữ safely trên backend
- Passwords nullable cho social logins
- Email unique constraint prevents duplicates
- JWT tokens issued by backend

---

**Support:** Liên hệ team development nếu có vấn đề.
