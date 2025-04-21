# 🧪 On-Demand Salary - Mock Backend API

This project provides mock APIs to support frontend mobile app development and testing.

> Used for simulating features like OTP verification, viewing profile, checking available balance, and withdrawal requests.

---

##  Getting Started

### 1. Clone the project
```
git clone https://github.com/your-username/on-demand-server.git
cd on-demand-server
```
### 2. Install dependencies
```
npm install
```
### 3. Start the server
```
npm run dev
# or
node index.js
```
> The server will run at: `http://localhost:3000`

---

##  Using `request.http`

1. Install the **REST Client** extension on VS Code.
2. Start this backend server.
3. Open the `request.http` file.
4. Click **"Send Request"** above any block to test the endpoint and see mock responses.

---

##  API List & Description

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| POST   | `/api/v1/request-otp`       | Request OTP by phone number       |
| POST   | `/api/v1/otp-info`          | Get current OTP status info       |
| POST   | `/api/v1/verify-otp`        | Submit OTP for verification       |
| GET    | `/api/v1/user/profile`      | Get user profile (requires token) |
| GET    | `/api/v1/user/transactions` | Get user transaction history      |
| POST   | `/api/v1/user/withdraw`     | Submit withdrawal request         |

> ** All `/user/*` endpoints require `Authorization: Bearer <token>`**

---

##  Folder Structure

```
/data           # Mock user & balance data (JSON)
├── creditBalance.json
├── otpEntries.json
├── user.json

/utils          # Helper functions (read/write json, OTP utils, etc.)
├── auth.js
├── otpUtils.js
├── tokenUtils.js
├── userUtils.js

index.js        # Express server with route handlers
request.http    # Sample API request file (for VSCode REST Client)
```

---

##  Notes

- This is **not a production backend**. It’s intended for rapid prototyping and mobile integration testing.
- OTPs are stored and handled in-memory (via JSON).
- No actual SMS/OTP provider is integrated.

---

if you have any question feel free to asking us nutchapon@salary-hero.com

😄😄😄 Happy Testing !!! 😄😄😄
