### Backend Server For Mobile Frontend Testing

This project provides mock APIs to support frontend mobile app development and testing.

---

### How to use `request.http`

1. Install **REST Client** extension on VS Code.
2. Start the backend server.
3. Open the `_request.http_` file.
4. Click **"Send Request"** above each block to test.

---

### API List & Description

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| POST   | `/api/v1/request-otp`       | Request OTP by phone number       |
| POST   | `/api/v1/otp-info`          | Get current OTP status info       |
| POST   | `/api/v1/verify-otp`        | Submit OTP for verification       |
| GET    | `/api/v1/user/profile`      | Get user profile (requires token) |
| GET    | `/api/v1/user/transactions` | Get user transaction history      |
| POST   | `/api/v1/user/withdraw`     | Submit withdrawal request         |

**🔐 All `/user/*` endpoints require `Authorization: Bearer <token>`**

---

if you have any question feel free to asking us nutchapon@salary-hero.com

😄😄😄 Happy Testing !!! 😄😄😄
