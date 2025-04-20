### Backend Server For Mobile Frontend Testing

This is documentation for api list that using on mobile frontend test

### How to use request.http

- install REST Client on vscode extension.
- start up server.
- open _request.http_ file.
- send request to see response.

### API Lists Description

---

| Method | endpoint                           | description                      |
| ------ | ---------------------------------- | -------------------------------- |
| POST:  | /api/v1/signin                     | to signin and get access token   |
| GET:   | /api/v1/user/:user_id/profile      | to get user profile detail       |
| GET:   | /api/v1/user/:user_id/transactions | to get user transactions history |
| POST:  | /api/v1/user/:user_id/withdraw     | to submit withdraw request       |

### Hint

- for detect first time signin you can use your phone number payload which return in token payload

if you have any question feel free to asking us nutchapon@salary-hero.com

😄😄😄 Happy Testing !!! 😄😄😄
